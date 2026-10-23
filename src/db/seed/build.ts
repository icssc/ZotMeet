import {
	ANCHOR_DATES,
	BLOCK_LENGTH,
	buildZotDateRowsForMeetingDays,
	convertTimeToUTC,
	createMeetingSchema,
	deriveMeetingWindow,
	formatLocalDateKey,
	localMidnightFromIsoDate,
	type ZotDate,
} from "@zotmeet/shared";
import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { NOTIFICATION_TYPES } from "../../lib/notification/types";
import { escapeLikePattern } from "../../lib/sql/like-pattern";
import type {
	InsertAvailability,
	InsertGroup,
	InsertMeeting,
	InsertMeetingInvite,
	InsertMember,
	InsertScheduledMeeting,
	InsertUser,
	notifications,
	usersInGroup,
} from "../schema";
import { GroupRole } from "../schema";
import {
	GROUP_TEMPLATES,
	MEETING_LOCATIONS,
	MEETING_TITLES,
	NAME_POOL,
	WINDOW_PRESETS,
} from "./names";
import type { Rng } from "./rng";

export const SEED_TIMEZONE = "America/Los_Angeles";
export const SEED_USER_PREFIX = "seed_";

const SEED_ADMIN_USER_ID = `${SEED_USER_PREFIX}admin`;
const SEED_ADMIN_MEMBER_ID = "00000000-0000-0000-0000-000000000000";
const SEED_EMAIL_DOMAIN = "seed.zotmeet.dev";

const GROUPS = 3;
const MEMBERS_PER_GROUP = 8;
const MEETINGS_PER_GROUP = 4;
const DAYS_AHEAD = 14;
const MAX_DATES = 4;
const ARCHIVED_RATE = 0.1;
const SCHEDULED_RATE = 0.25;
const DAYS_OF_WEEK_RATE = 0.15;
const RESPONSE_RATE = 0.7;
const REAL_USER_RESPONSE_RATE = 0.5;
const EVERYONE_RESPONDS_RATE = 0.25;
const EVERYONE_RESPONDS_RATE_SCHEDULED = 0.8;
const IF_NEEDED_RATE = 0.3;
const DAY_COVERAGE = 0.8;
const MAX_RANGES_PER_DAY = 2;
const MIN_RANGE_BLOCKS = 2;
const MAX_RANGE_BLOCKS = 12;
const SCHEDULED_DURATION_BLOCKS = [2, 4, 6];
const REAL_USER_HOST_RATE = 0.35;

export function seedTag(seed: number): string {
	return seed.toString(36);
}

function seedUserId(tag: string, handle: string): string {
	return `${SEED_USER_PREFIX}${tag}_${handle}`;
}

export function seedUserIdLike(): string {
	return `${escapeLikePattern(SEED_USER_PREFIX)}%`;
}

export type MeetingState =
	| "unscheduled"
	| "scheduled"
	| "days-of-week"
	| "archived";

export interface RealUser {
	userId: string;
	memberId: string;
}

export interface SeedPlan {
	admin: { member: InsertMember; user: InsertUser };
	members: InsertMember[];
	users: InsertUser[];
	groups: InsertGroup[];
	usersInGroup: (typeof usersInGroup.$inferInsert)[];
	meetings: InsertMeeting[];
	meetingInvites: InsertMeetingInvite[];
	availabilities: InsertAvailability[];
	scheduledMeetings: InsertScheduledMeeting[];
	notifications: (typeof notifications.$inferInsert)[];
	stats: {
		states: Record<MeetingState, number>;
		responded: number;
		invitedNotResponded: number;
	};
}

interface Person extends RealUser {
	isReal: boolean;
}

interface PoolPerson extends Person {
	displayName: string;
	username: string;
	email: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");

function minutesToHms(minutes: number): string {
	const m = ((minutes % 1440) + 1440) % 1440;
	return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}:00`;
}

function buildPool(
	tag: string,
	takenUsernames: ReadonlySet<string>,
): PoolPerson[] {
	const taken = new Set(takenUsernames);

	return NAME_POOL.map(({ handle, displayName }) => {
		let username = handle;
		for (let attempt = 0; taken.has(username); attempt++) {
			username = `${handle}.${tag}${attempt === 0 ? "" : attempt}`;
		}
		taken.add(username);
		return {
			userId: seedUserId(tag, handle),
			memberId: crypto.randomUUID(),
			isReal: false,
			displayName,
			username,
			email: `${handle}.${tag}@${SEED_EMAIL_DOMAIN}`,
		};
	});
}

function randomBlockSet(rng: Rng, blockCount: number, maxRanges: number) {
	const blocks = new Set<number>();
	const ranges = rng.int(1, maxRanges);
	for (let r = 0; r < ranges; r++) {
		const length = rng.int(
			Math.min(MIN_RANGE_BLOCKS, blockCount),
			Math.min(MAX_RANGE_BLOCKS, blockCount),
		);
		const start = rng.int(0, blockCount - length);
		for (let i = 0; i < length; i++) blocks.add(start + i);
	}
	return [...blocks].sort((a, b) => a - b);
}

function buildResponse(rng: Rng, zotDates: ZotDate[], blockCount: number) {
	const available: string[] = [];
	const ifNeeded: string[] = [];
	const wantsIfNeeded = rng.chance(IF_NEEDED_RATE);
	const forcedDay = rng.int(0, zotDates.length - 1);

	zotDates.forEach((zotDate, dayIndex) => {
		if (dayIndex !== forcedDay && !rng.chance(DAY_COVERAGE)) return;
		const free = randomBlockSet(rng, blockCount, MAX_RANGES_PER_DAY);
		for (const block of free) {
			available.push(zotDate.getISOStringForBlock(block));
		}
		if (wantsIfNeeded) {
			const freeSet = new Set(free);
			for (const block of randomBlockSet(rng, blockCount, 1)) {
				if (!freeSet.has(block)) {
					ifNeeded.push(zotDate.getISOStringForBlock(block));
				}
			}
		}
	});

	return { available, ifNeeded };
}

function pickState(rng: Rng): MeetingState {
	const roll = rng.next();
	if (roll < ARCHIVED_RATE) return "archived";
	if (roll < ARCHIVED_RATE + SCHEDULED_RATE) return "scheduled";
	if (roll < ARCHIVED_RATE + SCHEDULED_RATE + DAYS_OF_WEEK_RATE) {
		return "days-of-week";
	}
	return "unscheduled";
}

function pickDates(rng: Rng, state: MeetingState, today: Date): string[] {
	if (state === "days-of-week") {
		return rng
			.sample([0, 1, 2, 3, 4, 5, 6], rng.int(2, 5))
			.sort((a, b) => a - b)
			.map((weekday) => ANCHOR_DATES[weekday].toISOString());
	}

	return rng
		.sample(
			Array.from({ length: DAYS_AHEAD }, (_, i) => i + 1),
			rng.int(1, MAX_DATES),
		)
		.sort((a, b) => a - b)
		.map((offset) =>
			fromZonedTime(
				`${formatLocalDateKey(addDays(today, offset))}T00:00:00`,
				SEED_TIMEZONE,
			).toISOString(),
		);
}

export function buildSeedPlan(args: {
	seed: number;
	rng: Rng;
	realUser: RealUser;
	takenUsernames: ReadonlySet<string>;
	now: Date;
}): SeedPlan {
	const { seed, rng, realUser, takenUsernames, now } = args;
	const tag = seedTag(seed);
	const today = localMidnightFromIsoDate(
		formatInTimeZone(now, SEED_TIMEZONE, "yyyy-MM-dd"),
	);
	const baseUrl = (
		process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
	).replace(/\/$/, "");

	const admin: Person = {
		userId: SEED_ADMIN_USER_ID,
		memberId: SEED_ADMIN_MEMBER_ID,
		isReal: false,
	};

	const plan: SeedPlan = {
		admin: {
			member: {
				id: admin.memberId,
				displayName: "Seed Admin",
				username: takenUsernames.has("seed.admin") ? null : "seed.admin",
			},
			user: {
				id: admin.userId,
				memberId: admin.memberId,
				email: `admin@${SEED_EMAIL_DOMAIN}`,
			},
		},
		members: [],
		users: [],
		groups: [],
		usersInGroup: [],
		meetings: [],
		meetingInvites: [],
		availabilities: [],
		scheduledMeetings: [],
		notifications: [],
		stats: {
			states: { unscheduled: 0, scheduled: 0, "days-of-week": 0, archived: 0 },
			responded: 0,
			invitedNotResponded: 0,
		},
	};

	const pool = buildPool(tag, takenUsernames);
	for (const person of pool) {
		plan.members.push({
			id: person.memberId,
			displayName: person.displayName,
			username: person.username,
			school: "UC Irvine",
		});
		plan.users.push({
			id: person.userId,
			memberId: person.memberId,
			email: person.email,
		});
	}

	const real: Person = { ...realUser, isReal: true };

	const titles = rng.shuffle(MEETING_TITLES);

	for (let g = 0; g < GROUPS; g++) {
		const template = GROUP_TEMPLATES[g % GROUP_TEMPLATES.length];
		const round = Math.floor(g / GROUP_TEMPLATES.length);
		const groupId = crypto.randomUUID();
		plan.groups.push({
			id: groupId,
			name: round === 0 ? template.name : `${template.name} ${round + 1}`,
			description: template.description,
			createdBy: SEED_ADMIN_USER_ID,
			createdAt: new Date(now.getTime() - rng.int(1, 30) * 86_400_000),
			archived: false,
		});

		const groupMembers: Person[] = [
			admin,
			...rng.sample(pool, MEMBERS_PER_GROUP),
			real,
		];
		for (const person of groupMembers) {
			plan.usersInGroup.push({
				userId: person.userId,
				groupId,
				role:
					person === admin || (person === real && g === 0)
						? GroupRole.ADMIN
						: GroupRole.MEMBER,
			});
		}

		for (let m = 0; m < MEETINGS_PER_GROUP; m++) {
			const state = pickState(rng);
			plan.stats.states[state]++;

			const dates = pickDates(rng, state, today);
			const [windowFrom, windowTo] = rng.pick(WINDOW_PRESETS);
			const fromTime = convertTimeToUTC(
				`${windowFrom}:00`,
				SEED_TIMEZONE,
				dates[0],
			);
			const toTime = convertTimeToUTC(
				`${windowTo}:00`,
				SEED_TIMEZONE,
				dates[0],
			);
			const meetingType = state === "days-of-week" ? "days" : "dates";
			const title =
				m < titles.length
					? titles[m]
					: `${titles[m % titles.length]} ${Math.floor(m / titles.length) + 1}`;

			createMeetingSchema.parse({
				title,
				fromTime,
				toTime,
				timezone: SEED_TIMEZONE,
				dates,
				meetingType,
			});

			const host = rng.chance(REAL_USER_HOST_RATE)
				? real
				: rng.pick(groupMembers);
			const meetingId = crypto.randomUUID();
			plan.meetings.push({
				id: meetingId,
				title,
				description: rng.chance(0.5) ? `${template.name}: ${title}.` : null,
				location: rng.chance(0.6) ? rng.pick(MEETING_LOCATIONS) : null,
				scheduled: state === "scheduled" ? true : null,
				fromTime,
				toTime,
				timezone: SEED_TIMEZONE,
				group_id: groupId,
				hostId: host.memberId,
				dates,
				meetingType,
				createdAt: new Date(now.getTime() - rng.int(1, 72) * 3_600_000),
				archived: state === "archived",
				membersCanInvite: true,
			});

			plan.meetingInvites.push({
				meetingId,
				inviteToken: crypto.randomUUID(),
				inviterId: host.userId,
				sentAt: now,
			});

			const window = deriveMeetingWindow(
				{ dates, fromTime, toTime },
				SEED_TIMEZONE,
			);
			const blocks = window.availabilityTimeBlocks;
			const zotDates = buildZotDateRowsForMeetingDays(
				window.sortedDates,
				blocks,
				SEED_TIMEZONE,
			);

			const everyone = rng.chance(
				state === "scheduled"
					? EVERYONE_RESPONDS_RATE_SCHEDULED
					: EVERYONE_RESPONDS_RATE,
			);
			for (const person of groupMembers) {
				const responds =
					everyone ||
					rng.chance(person.isReal ? REAL_USER_RESPONSE_RATE : RESPONSE_RATE);
				if (!responds) {
					if (person !== host) {
						plan.availabilities.push({
							memberId: person.memberId,
							meetingId,
							meetingAvailabilities: [],
							ifNeededAvailabilities: [],
						});
						plan.stats.invitedNotResponded++;
					}
					continue;
				}
				const { available, ifNeeded } = buildResponse(
					rng,
					zotDates,
					blocks.length,
				);
				plan.availabilities.push({
					memberId: person.memberId,
					meetingId,
					meetingAvailabilities: available,
					ifNeededAvailabilities: ifNeeded,
				});
				plan.stats.responded++;
			}

			if (!host.isReal && state !== "archived") {
				plan.notifications.push({
					memberId: real.memberId,
					type: NOTIFICATION_TYPES.MEETING_INVITE,
					title,
					message: `You've been invited to join "${title}". Click to view the meeting.`,
					redirect: `${baseUrl}/availability/${meetingId}`,
					createdBy: host.userId,
					groupId: null,
				});
			}

			if (state === "scheduled") {
				const scheduledDate = localMidnightFromIsoDate(rng.pick(dates));
				const duration = Math.min(
					rng.pick(SCHEDULED_DURATION_BLOCKS),
					blocks.length,
				);
				const start = rng.int(0, blocks.length - duration);
				for (let b = start; b < start + duration; b++) {
					plan.scheduledMeetings.push({
						meetingId,
						scheduledDate,
						scheduledFromTime: minutesToHms(blocks[b]),
						scheduledToTime: minutesToHms(blocks[b] + BLOCK_LENGTH),
					});
				}
			}
		}
	}

	return plan;
}
