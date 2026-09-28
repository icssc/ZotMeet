import { randomUUID } from "crypto";
import "dotenv/config";
import {
	ANCHOR_DATES,
	convertTimeFromUTC,
	convertTimeToUTC,
	getTimeFromHourMinuteString,
	type HourMinuteString,
} from "@zotmeet/shared";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	availabilities,
	GroupRole,
	groups,
	type InsertMeeting,
	meetings,
	members,
	scheduledMeetings,
	users,
	usersInGroup,
} from "./schema";

if (!process.env.DATABASE_URL) {
	throw new Error("Missing DATABASE_URL env var.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const BATCH_SIZE = 15;

const SEED_GROUP_ID = "00000000-0000-0000-0000-000000000099";
const SEED_ADMIN_MEMBER_ID = "00000000-0000-0000-0000-000000000000";
const SEED_ADMIN_USER_ID = "seed_admin";

/**
 * Meetings hosted by Seed Admin, the member the mobile app's dev token stands
 * in for (`MOBILE_DEV_HOST_MEMBER_ID`), so a phone that cannot sign in with
 * Google still has something to open. Fixed ids: re-running the seed adds
 * the new batch's availabilities to the same meetings rather than more
 * meetings. Dates are laid out from the day the meeting is first seeded.
 */
const SEED_MEETING_TIMEZONE = "America/Los_Angeles";
const SEED_MEETINGS: SeedMeeting[] = [
	{
		id: "00000000-0000-0000-0000-000000000101",
		title: "ZotMeet Weekly Sync",
		description: "Recurring team sync — pick the slots that work this week.",
		location: "DBH 6011",
		meetingType: "dates",
		dayOffsets: [1, 2, 3, 4, 5],
		startTime: "09:00",
		endTime: "17:00",
		groupMeeting: true,
		// The guest has not answered yet: the "add availability" flow.
		hostAvailability: "none",
	},
	{
		id: "00000000-0000-0000-0000-000000000102",
		title: "Office Hours",
		description: "Which weekday afternoons can you hold office hours?",
		meetingType: "days",
		dayOffsets: [1, 3, 5],
		startTime: "10:00",
		endTime: "14:00",
		hostAvailability: "filled",
	},
	{
		id: "00000000-0000-0000-0000-000000000103",
		title: "Study Session",
		description: "Finals prep. Everyone has answered — check the heatmap.",
		location: "Science Library",
		meetingType: "dates",
		dayOffsets: [7, 9, 11],
		startTime: "18:00",
		endTime: "22:00",
		hostAvailability: "filled",
	},
	{
		id: "00000000-0000-0000-0000-000000000104",
		title: "Project Kickoff",
		description: "Already scheduled: the meeting card and summary states.",
		location: "Zoom",
		meetingType: "dates",
		dayOffsets: [2, 3, 4],
		startTime: "13:00",
		endTime: "16:00",
		hostAvailability: "filled",
		scheduled: { dayOffset: 3, startTime: "14:00", endTime: "15:00" },
	},
];

type SeedMeeting = {
	id: string;
	title: string;
	description: string;
	location?: string;
	meetingType: "dates" | "days";
	/**
	 * `dates`: days after the seed date. `days`: weekday indices (0 = Sunday)
	 * into `ANCHOR_DATES`, the way the creation calendar stores a days-of-week
	 * meeting.
	 */
	dayOffsets: number[];
	/** Local wall-clock "HH:MM" in `SEED_MEETING_TIMEZONE`. */
	startTime: string;
	endTime: string;
	groupMeeting?: boolean;
	/** Whether Seed Admin's own availability is filled in or left empty. */
	hostAvailability: "none" | "filled";
	scheduled?: { dayOffset: number; startTime: string; endTime: string };
};

const NAME_POOL = [
	{ handle: "zotninja", displayName: "Zot Ninja" },
	{ handle: "panteater", displayName: "Peter Anteater" },
	{ handle: "zotking", displayName: "Zot King" },
	{ handle: "aldrichpark", displayName: "Aldrich Park" },
	{ handle: "ringroad", displayName: "Ring Road" },
	{ handle: "merage", displayName: "Dean Merage" },
	{ handle: "bren", displayName: "Bren Events" },
	{ handle: "petr", displayName: "PETR Advisor" },
	{ handle: "crammerr", displayName: "Last-Minute Larry" },
	{ handle: "studybuddy", displayName: "Study Buddy" },
	{ handle: "zotbot", displayName: "ZotBot" },
	{ handle: "icssc", displayName: "ICSSC Council" },
	{ handle: "anteaterfan", displayName: "Anteater Fan" },
	{ handle: "steveair", displayName: "Steve Airpods" },
	{ handle: "mesacourtdj", displayName: "Mesa Court DJ" },
	{ handle: "parkingpass", displayName: "Parking Pass" },
	{ handle: "finalszn", displayName: "Final Szn" },
	{ handle: "middleearth", displayName: "Middle Earth RA" },
	{ handle: "cramlab", displayName: "Science Library" },
	{ handle: "zotgrad", displayName: "Zot Grad" },
];

async function seed(): Promise<void> {
	await db
		.insert(members)
		.values({ id: SEED_ADMIN_MEMBER_ID, displayName: "Seed Admin" })
		.onConflictDoNothing();

	await db
		.insert(users)
		.values({
			id: SEED_ADMIN_USER_ID,
			memberId: SEED_ADMIN_MEMBER_ID,
			email: "admin@zotmeet.dev",
		})
		.onConflictDoNothing();

	await db
		.insert(groups)
		.values({
			id: SEED_GROUP_ID,
			name: "ZotMeet Dev Team",
			description:
				"Dummy group for testing large group sizes and UI overflow states.",
			createdBy: SEED_ADMIN_USER_ID,
			createdAt: new Date(),
			archived: false,
		})
		.onConflictDoNothing();

	await db
		.insert(usersInGroup)
		.values({
			userId: SEED_ADMIN_USER_ID,
			groupId: SEED_GROUP_ID,
			role: GroupRole.ADMIN,
		})
		.onConflictDoNothing();

	const suffix = Math.random().toString(16).slice(2, 6);
	const batch = NAME_POOL.slice(0, BATCH_SIZE).map(
		({ handle, displayName }) => ({
			memberId: randomUUID(),
			userId: `seed_${handle}_${suffix}`,
			displayName,
			handle,
		}),
	);

	await db.transaction(async (tx) => {
		await tx.insert(members).values(
			batch.map(({ memberId, displayName }) => ({
				id: memberId,
				displayName,
			})),
		);

		await tx.insert(users).values(
			batch.map(({ userId, memberId, handle }) => ({
				id: userId,
				memberId,
				email: `${handle}_${suffix}@zotmeet.dev`,
			})),
		);

		await tx.insert(usersInGroup).values(
			batch.map(({ userId }) => ({
				userId,
				groupId: SEED_GROUP_ID,
				role: GroupRole.MEMBER,
			})),
		);
	});

	console.log(`${BATCH_SIZE} users added (batch: _${suffix})`);

	await seedMeetings(batch.map(({ memberId }) => memberId));
}

/** Local midnight of `daysFromNow` days ahead, as the creation page stores dates. */
function localMidnightIso(daysFromNow: number): string {
	const today = formatInTimeZone(
		new Date(),
		SEED_MEETING_TIMEZONE,
		"yyyy-MM-dd",
	);
	const midnight = fromZonedTime(`${today}T00:00:00`, SEED_MEETING_TIMEZONE);
	midnight.setUTCDate(midnight.getUTCDate() + daysFromNow);
	return midnight.toISOString();
}

function meetingDates(seedMeeting: SeedMeeting): string[] {
	if (seedMeeting.meetingType === "days") {
		return seedMeeting.dayOffsets.map((weekday) =>
			ANCHOR_DATES[weekday].toISOString(),
		);
	}
	return seedMeeting.dayOffsets.map(localMidnightIso);
}

/** Every 15-minute slot of the meeting's grid, as the availability table stores them. */
function meetingSlots(
	meeting: Pick<InsertMeeting, "fromTime" | "toTime" | "timezone" | "dates">,
): string[][] {
	const dates = meeting.dates ?? [];
	const reference = dates[0];
	const fromMinutes = getTimeFromHourMinuteString(
		convertTimeFromUTC(
			meeting.fromTime,
			meeting.timezone,
			reference,
		) as HourMinuteString,
	);
	let toMinutes = getTimeFromHourMinuteString(
		convertTimeFromUTC(
			meeting.toTime,
			meeting.timezone,
			reference,
		) as HourMinuteString,
	);
	if (toMinutes <= fromMinutes) toMinutes += 24 * 60;

	return dates.map((date) => {
		// The grid keys a day by the calendar date in the stored string
		// (`use-availability-data.ts`), which for a days-of-week meeting's
		// anchor dates is the UTC date, not the zone's.
		const datePart = date.slice(0, 10);
		const slots: string[] = [];
		for (let minutes = fromMinutes; minutes < toMinutes; minutes += 15) {
			const hours = Math.floor(minutes / 60);
			const localTime = `${datePart}T${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:00`;
			slots.push(fromZonedTime(localTime, meeting.timezone).toISOString());
		}
		return slots;
	});
}

/** Deterministic PRNG so a member's pattern is the same on every machine. */
function mulberry32(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/**
 * One member's answer: on each day, one contiguous available window and,
 * sometimes, an if-needed tail after it — the shape real answers take, so the
 * heatmap has peaks rather than noise.
 */
function memberAvailability(
	slotsByDate: string[][],
	seed: number,
): { meetingAvailabilities: string[]; ifNeededAvailabilities: string[] } {
	const random = mulberry32(seed);
	const meetingAvailabilities: string[] = [];
	const ifNeededAvailabilities: string[] = [];

	for (const slots of slotsByDate) {
		// A day skipped now and then.
		if (random() < 0.2) continue;

		const start = Math.floor(random() * slots.length * 0.5);
		const length = Math.max(4, Math.floor(random() * slots.length * 0.6));
		const end = Math.min(slots.length, start + length);
		meetingAvailabilities.push(...slots.slice(start, end));

		if (random() < 0.5) {
			const ifNeededEnd = Math.min(slots.length, end + 4);
			ifNeededAvailabilities.push(...slots.slice(end, ifNeededEnd));
		}
	}

	return { meetingAvailabilities, ifNeededAvailabilities };
}

async function seedMeetings(batchMemberIds: string[]): Promise<void> {
	for (const [index, seedMeeting] of SEED_MEETINGS.entries()) {
		const dates = meetingDates(seedMeeting);
		const meeting: InsertMeeting = {
			id: seedMeeting.id,
			title: seedMeeting.title,
			description: seedMeeting.description,
			location: seedMeeting.location ?? null,
			fromTime: convertTimeToUTC(
				seedMeeting.startTime,
				SEED_MEETING_TIMEZONE,
				dates[0],
			),
			toTime: convertTimeToUTC(
				seedMeeting.endTime,
				SEED_MEETING_TIMEZONE,
				dates[0],
			),
			timezone: SEED_MEETING_TIMEZONE,
			hostId: SEED_ADMIN_MEMBER_ID,
			dates,
			meetingType: seedMeeting.meetingType,
			group_id: seedMeeting.groupMeeting ? SEED_GROUP_ID : null,
			scheduled: seedMeeting.scheduled ? true : null,
		};

		const inserted = await db
			.insert(meetings)
			.values(meeting)
			.onConflictDoNothing()
			.returning({ id: meetings.id });

		// The meeting was seeded on an earlier run: its dates are whatever they
		// were then, so compute this batch's slots from the stored row.
		const [stored] = inserted.length
			? [meeting]
			: await db
					.select({
						fromTime: meetings.fromTime,
						toTime: meetings.toTime,
						timezone: meetings.timezone,
						dates: meetings.dates,
					})
					.from(meetings)
					.where(eq(meetings.id, seedMeeting.id))
					.limit(1);
		if (!stored) continue;

		const slotsByDate = meetingSlots(stored);
		const rows = batchMemberIds.map((memberId, memberIndex) => ({
			memberId,
			meetingId: seedMeeting.id,
			...memberAvailability(slotsByDate, index * 100 + memberIndex + 1),
		}));
		if (inserted.length) {
			rows.push({
				memberId: SEED_ADMIN_MEMBER_ID,
				meetingId: seedMeeting.id,
				...(seedMeeting.hostAvailability === "filled"
					? memberAvailability(slotsByDate, index * 100)
					: { meetingAvailabilities: [], ifNeededAvailabilities: [] }),
			});
		}
		await db
			.insert(availabilities)
			.values(rows)
			.onConflictDoNothing({
				target: [availabilities.memberId, availabilities.meetingId],
			});

		if (inserted.length && seedMeeting.scheduled) {
			const { dayOffset, startTime, endTime } = seedMeeting.scheduled;
			await db.insert(scheduledMeetings).values({
				meetingId: seedMeeting.id,
				scheduledDate: new Date(localMidnightIso(dayOffset)),
				scheduledFromTime: convertTimeToUTC(
					startTime,
					SEED_MEETING_TIMEZONE,
					dates[0],
				),
				scheduledToTime: convertTimeToUTC(
					endTime,
					SEED_MEETING_TIMEZONE,
					dates[0],
				),
			});
		}
	}

	console.log(
		`${SEED_MEETINGS.length} meetings hosted by Seed Admin (${SEED_ADMIN_MEMBER_ID})`,
	);
}

seed()
	.catch((error: unknown) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(() => pool.end());
