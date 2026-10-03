import { randomUUID } from "node:crypto";
import {
	convertTimeToUTC,
	deriveMeetingWindow,
	isoStringForSlot,
	localMidnightFromIsoDate,
} from "@zotmeet/shared";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	availabilities,
	GroupRole,
	groups,
	meetings,
	members,
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
const SEED_MEETING_ID = "00000000-0000-0000-0000-000000000098";
const SEED_ADMIN_MEMBER_ID = "00000000-0000-0000-0000-000000000000";
const SEED_ADMIN_USER_ID = "seed_admin";
const SEED_TIME_ZONE = "America/Los_Angeles";
const SEED_DAY_COUNT = 4;

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

	const dates = seedMeetingDates(SEED_TIME_ZONE, SEED_DAY_COUNT);
	const fromTime = convertTimeToUTC("09:00:00", SEED_TIME_ZONE, dates[0]);
	const toTime = convertTimeToUTC("17:00:00", SEED_TIME_ZONE, dates[0]);
	const meeting = {
		title: "Dev availability heatmap",
		description:
			"Seeded 9:00–17:00 meeting with overlapping fake availability.",
		fromTime,
		toTime,
		timezone: SEED_TIME_ZONE,
		dates,
		hostId: SEED_ADMIN_MEMBER_ID,
		group_id: SEED_GROUP_ID,
		archived: false,
	};

	await db
		.insert(meetings)
		.values({ id: SEED_MEETING_ID, ...meeting })
		.onConflictDoUpdate({
			target: meetings.id,
			set: meeting,
		});

	const groupMembers = await db
		.select({ memberId: users.memberId })
		.from(usersInGroup)
		.innerJoin(users, eq(users.id, usersInGroup.userId))
		.where(eq(usersInGroup.groupId, SEED_GROUP_ID));
	const memberIds = groupMembers
		.map((row) => row.memberId)
		.sort((a, b) => a.localeCompare(b));
	const painted = paintSeedAvailability(
		memberIds,
		dates,
		fromTime,
		toTime,
		SEED_TIME_ZONE,
	);

	await db
		.delete(availabilities)
		.where(eq(availabilities.meetingId, SEED_MEETING_ID));
	if (painted.length > 0) {
		await db.insert(availabilities).values(
			painted.map((row) => ({
				memberId: row.memberId,
				meetingId: SEED_MEETING_ID,
				meetingAvailabilities: row.meetingAvailabilities,
				ifNeededAvailabilities: row.ifNeededAvailabilities,
			})),
		);
	}

	console.log(
		`Seeded meeting ${SEED_MEETING_ID} with availability for ${painted.length} members`,
	);
	console.log(
		`Open /availability/${SEED_MEETING_ID} in ${SEED_TIME_ZONE} so the slots line up`,
	);
}

/** `YYYY-MM-DD` for `date` in `timeZone`. */
function calendarDateInTimeZone(date: Date, timeZone: string): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(date);
}

function addCalendarDays(isoDate: string, days: number): string {
	const [year, month, day] = isoDate.split("-").map(Number);
	const next = new Date(Date.UTC(year, month - 1, day + days));
	const yyyy = next.getUTCFullYear();
	const mm = String(next.getUTCMonth() + 1).padStart(2, "0");
	const dd = String(next.getUTCDate()).padStart(2, "0");
	return `${yyyy}-${mm}-${dd}`;
}

/** Tomorrow through the next few days, stored as UTC-midnight ISO strings. */
function seedMeetingDates(timeZone: string, dayCount: number): string[] {
	const today = calendarDateInTimeZone(new Date(), timeZone);
	return Array.from({ length: dayCount }, (_, index) => {
		const day = addCalendarDays(today, index + 1);
		return `${day}T00:00:00.000Z`;
	});
}

/** Inclusive. */
function randomInt(min: number, max: number): number {
	return min + Math.floor(Math.random() * (max - min + 1));
}

/** How many separate stretches a person marks on one day. */
const BLOCKS_PER_DAY = { min: 1, max: 3 };
/** Length of a stretch, in 15-minute slots. */
const BLOCK_LENGTH_SLOTS = { min: 6, max: 20 };

/** Non-overlapping slot indexes for one day. */
function randomDayBlocks(slotCount: number): Set<number> {
	const taken = new Set<number>();
	const blockCount = randomInt(BLOCKS_PER_DAY.min, BLOCKS_PER_DAY.max);
	for (let i = 0; i < blockCount; i++) {
		const length = randomInt(
			BLOCK_LENGTH_SLOTS.min,
			Math.min(BLOCK_LENGTH_SLOTS.max, slotCount),
		);
		const maxStart = slotCount - length;
		if (maxStart < 0) continue;
		for (let attempt = 0; attempt < 8; attempt++) {
			const start = randomInt(0, maxStart);
			let overlaps = false;
			for (let offset = 0; offset < length; offset++) {
				if (taken.has(start + offset)) {
					overlaps = true;
					break;
				}
			}
			if (overlaps) continue;
			for (let offset = 0; offset < length; offset++) {
				taken.add(start + offset);
			}
			break;
		}
	}
	return taken;
}

/**
 * Each member gets a few contiguous stretches per day, like a real response:
 * a random count (including none) and a random length. Someone who rolls
 * empty on every day gets one stretch so they still show on the heatmap.
 */
function paintSeedAvailability(
	memberIds: readonly string[],
	dates: string[],
	fromTime: string,
	toTime: string,
	timeZone: string,
): {
	memberId: string;
	meetingAvailabilities: string[];
	ifNeededAvailabilities: string[];
}[] {
	const { sortedDates, availabilityTimeBlocks } = deriveMeetingWindow(
		{ dates, fromTime, toTime },
		timeZone,
	);
	const slotCount = availabilityTimeBlocks.length;

	return memberIds.map((memberId) => {
		const dayBlocks = sortedDates.map(() => randomDayBlocks(slotCount));
		if (dayBlocks.every((slots) => slots.size === 0) && slotCount > 0) {
			const dayIndex = randomInt(0, sortedDates.length - 1);
			dayBlocks[dayIndex] = randomDayBlocks(slotCount);
			if (dayBlocks[dayIndex].size === 0) {
				const length = Math.min(BLOCK_LENGTH_SLOTS.min, slotCount);
				const start = randomInt(0, slotCount - length);
				for (let offset = 0; offset < length; offset++) {
					dayBlocks[dayIndex].add(start + offset);
				}
			}
		}

		const meetingAvailabilities: string[] = [];
		sortedDates.forEach((date, dayIndex) => {
			const day = localMidnightFromIsoDate(date);
			for (const slotIndex of dayBlocks[dayIndex] ?? []) {
				const minutes = availabilityTimeBlocks[slotIndex];
				if (minutes === undefined) continue;
				meetingAvailabilities.push(isoStringForSlot(day, minutes, timeZone));
			}
		});
		meetingAvailabilities.sort();
		return {
			memberId,
			meetingAvailabilities,
			ifNeededAvailabilities: [],
		};
	});
}

seed()
	.catch((error: unknown) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(() => pool.end());
