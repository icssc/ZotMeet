import "dotenv/config";
import { eq, isNotNull, like, sql } from "drizzle-orm";
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
import {
	buildSeedPlan,
	type RealUser,
	SEED_TIMEZONE,
	SEED_USER_PREFIX,
	seedTag,
	seedUserIdLike,
} from "./seed/build";
import { createRng } from "./seed/rng";
import { type Tx, wipeSeedData } from "./seed/wipe";

/**
 * Dev-only seed: future groups, meetings and member availabilities, shaped by
 * CLI flags (`pnpm db:seed --help`). It writes straight through the schema, so
 * it sends no email and never calls the app's notification code (it does add
 * in-app invite notifications for a `--user` account), and it refuses to touch
 * a database that is not on this machine.
 */

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);
/** Connection-string params that make `pg` connect somewhere the URL host does not name. */
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
	// `?host=prod.example.com` overrides the host in front of it, so the
	// hostname alone cannot be trusted.
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
	const opts = parseSeedArgs(process.argv.slice(2));
	if (opts === "help") {
		console.log(USAGE);
		return;
	}

	const databaseUrl = process.env.DATABASE_URL;
	if (!databaseUrl) throw new ArgError("Missing DATABASE_URL env var.");
	assertLocalDatabase(databaseUrl);

	const pool = new Pool({ connectionString: databaseUrl });
	const db = drizzle(pool);

	try {
		let realUser: RealUser | null = null;
		if (opts.userEmail) {
			const [row] = await db
				.select({ userId: users.id, memberId: users.memberId })
				.from(users)
				.where(eq(sql`lower(${users.email})`, opts.userEmail.toLowerCase()))
				.limit(1);
			// Fail before anything is wiped: seeding without the account the dev
			// asked for would leave them with data they cannot see.
			if (!row) {
				throw new ArgError(
					`No user with email ${opts.userEmail}. Sign in to the app once, then re-run.`,
				);
			}
			// The wipe deletes seed_ accounts, so one cannot also be the real user.
			if (row.userId.startsWith(SEED_USER_PREFIX)) {
				throw new ArgError(
					`${opts.userEmail} is a seeded account; --user needs a real one.`,
				);
			}
			realUser = row;
		}

		const rng = createRng(opts.seed);

		const plan = await db.transaction(async (tx: Tx) => {
			if (!opts.append) await wipeSeedData(tx);

			// Ids are derived from the seed, so reusing one under `--append` would
			// collide with the earlier run's users. Refuse rather than let the
			// conflict-skipping inserts below quietly drop them.
			const [clash] = await tx
				.select({ id: users.id })
				.from(users)
				.where(like(users.id, seedUserIdLike(seedTag(opts.seed))))
				.limit(1);
			if (clash) {
				throw new ArgError(
					`Seed ${opts.seed} was already used here. Pass a different --seed with --append.`,
				);
			}

			const taken = await tx
				.select({ username: members.username })
				.from(members)
				.where(isNotNull(members.username));

			const built = buildSeedPlan({
				opts,
				rng,
				realUser,
				takenUsernames: new Set(
					taken.flatMap((r) => (r.username === null ? [] : [r.username])),
				),
				now: new Date(),
			});

			// Only the fixed admin can already exist (`--append`); the clash check
			// above guarantees every other row is new.
			await insertChunked(built.members, (c) =>
				tx.insert(members).values(c).onConflictDoNothing(),
			);
			await insertChunked(built.users, (c) =>
				tx.insert(users).values(c).onConflictDoNothing(),
			);
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
				`Seeded (seed ${opts.seed}, ${SEED_TIMEZONE}${opts.append ? ", appended" : ""}):`,
				`  ${plan.groups.length} groups, ${plan.members.length} fake members`,
				`  ${plan.meetings.length} meetings: ${states.unscheduled} unscheduled, ${states.scheduled} scheduled, ${states["days-of-week"]} days-of-week, ${states.archived} archived`,
				`  ${plan.stats.responded} responses, ${plan.stats.invitedNotResponded} invited but not responded`,
				realUser
					? `  attached ${opts.userEmail}: ${plan.notifications.length} invite notifications`
					: "  no --user given: sign-in accounts will not see this data",
				`Re-run with --seed ${opts.seed} to reproduce this data.`,
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
