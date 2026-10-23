import "dotenv/config";
import { eq, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
	availabilities,
	groups,
	meetingInvites,
	meetings,
	members,
	notifications,
	scheduledMeetings,
	users,
	usersInGroup,
} from "./schema";
import { ArgError, parseSeedArgs, USAGE } from "./seed/args";
import { buildSeedPlan, SEED_TIMEZONE, SEED_USER_PREFIX } from "./seed/build";
import { createRng } from "./seed/rng";
import { type Tx, wipeSeedData } from "./seed/wipe";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
const HOST_OVERRIDE_PARAMS = ["host", "hostaddr", "service"];
const INSERT_CHUNK = 500;

function assertLocalDatabase(databaseUrl: string): void {
	if (process.env.NODE_ENV === "production") {
		throw new ArgError("Refusing to seed with NODE_ENV=production.");
	}
	let url: URL;
	try {
		url = new URL(databaseUrl);
	} catch {
		throw new ArgError("DATABASE_URL is not a valid URL.");
	}
	for (const param of HOST_OVERRIDE_PARAMS) {
		if (url.searchParams.has(param)) {
			throw new ArgError(
				`Refusing to seed: DATABASE_URL has a "${param}" parameter that can redirect the connection.`,
			);
		}
	}
	const host = url.hostname.toLowerCase();
	if (!LOCAL_HOSTS.has(host)) {
		throw new ArgError(
			`Refusing to seed "${host}": DATABASE_URL must point at localhost.`,
		);
	}
}

async function insertChunked<T>(
	rows: T[],
	insert: (chunk: T[]) => Promise<unknown>,
): Promise<void> {
	for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
		await insert(rows.slice(i, i + INSERT_CHUNK));
	}
}

async function seed(): Promise<void> {
	const args = parseSeedArgs(process.argv.slice(2));
	if (args === "help") {
		console.log(USAGE);
		return;
	}
	const { userEmail } = args;

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new ArgError("Missing DATABASE_URL env var.");
	assertLocalDatabase(databaseUrl);

	const pool = new Pool({ connectionString: databaseUrl });
	const db = drizzle(pool);

	try {
		const [realUser] = await db
			.select({ userId: users.id, memberId: users.memberId })
			.from(users)
			.where(eq(sql`lower(${users.email})`, userEmail.toLowerCase()))
			.limit(1);
		if (!realUser) {
			throw new ArgError(
				`No user with email ${userEmail}. Sign in to the app once, then re-run.`,
			);
		}
		if (realUser.userId.startsWith(SEED_USER_PREFIX)) {
			throw new ArgError(
				`${userEmail} is a seeded account; --user needs a real one.`,
			);
		}

		const seed = Math.floor(Math.random() * 2 ** 31);
		const rng = createRng(seed);

		const plan = await db.transaction(async (tx: Tx) => {
			await wipeSeedData(tx);

			const taken = await tx
				.select({ username: members.username })
				.from(members)
				.where(isNotNull(members.username));

			const built = buildSeedPlan({
				seed,
				rng,
				realUser,
				takenUsernames: new Set(
					taken.flatMap((r) => (r.username === null ? [] : [r.username])),
				),
				now: new Date(),
			});

			await tx.insert(members).values(built.admin.member).onConflictDoNothing();
			await tx.insert(users).values(built.admin.user).onConflictDoNothing();
			await insertChunked(built.members, (c) => tx.insert(members).values(c));
			await insertChunked(built.users, (c) => tx.insert(users).values(c));
			await insertChunked(built.groups, (c) => tx.insert(groups).values(c));
			await insertChunked(built.usersInGroup, (c) =>
				tx.insert(usersInGroup).values(c),
			);
			await insertChunked(built.meetings, (c) => tx.insert(meetings).values(c));
			await insertChunked(built.meetingInvites, (c) =>
				tx.insert(meetingInvites).values(c),
			);
			await insertChunked(built.availabilities, (c) =>
				tx.insert(availabilities).values(c),
			);
			await insertChunked(built.scheduledMeetings, (c) =>
				tx.insert(scheduledMeetings).values(c),
			);
			await insertChunked(built.notifications, (c) =>
				tx.insert(notifications).values(c),
			);

			return built;
		});

		const { states } = plan.stats;
		console.log(
			[
				`Seeded (${SEED_TIMEZONE}):`,
				`  ${plan.groups.length} groups, ${plan.members.length} fake members`,
				`  ${plan.meetings.length} meetings: ${states.unscheduled} unscheduled, ${states.scheduled} scheduled, ${states["days-of-week"]} days-of-week, ${states.archived} archived`,
				`  ${plan.stats.responded} responses, ${plan.stats.invitedNotResponded} invited but not responded`,
				`  attached ${userEmail}: ${plan.notifications.length} invite notifications`,
			].join("\n"),
		);
	} finally {
		await pool.end();
	}
}

seed().catch((error: unknown) => {
	if (error instanceof ArgError) {
		console.error(`${error.message}\nRun with --help for usage.`);
	} else {
		console.error("Seed failed:", error);
	}
	process.exit(1);
});
