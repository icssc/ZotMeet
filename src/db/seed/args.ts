import { parseArgs } from "node:util";
import { getTimeFromHourMinuteString } from "@zotmeet/shared";
import { MAX_POOL_USERS } from "./names";

export interface SeedOptions {
	groups: number;
	/** Size of the fake user pool. */
	users: number;
	/** Fake members per group, sampled from the pool. */
	members: number;
	/** Meetings per group. */
	meetings: number;
	/** Meetings fall 1..days days from today. */
	days: number;
	maxDates: number;
	/** "HH:MM" Pacific, or null to pick a preset per meeting. */
	from: string | null;
	to: string | null;
	/** Per-meeting probabilities. They are mutually exclusive, in this order. */
	archived: number;
	scheduled: number;
	daysOfWeek: number;
	userEmail: string | null;
	seed: number;
	append: boolean;
}

export const USAGE = `Seed the local database with future groups, meetings and availabilities.

Usage: pnpm db:seed [flags]

Counts
  --groups N        groups to create                              (default 3)
  --users N         fake user pool size                           (default 20, at least --members)
  --members N       fake members per group, sampled from the pool (default 8)
  --meetings N      meetings per group                            (default 4)

Meeting shape
  --days N          meetings fall 1..N days from today            (default 14)
  --max-dates N     max dates on a "dates" meeting                (default 4)
  --from HH:MM      meeting window start, Pacific time            (default: random preset)
  --to HH:MM        meeting window end, Pacific time              (default: random preset)

Meeting states (probabilities 0-1, applied per meeting in this order)
  --archived F      archived                                      (default 0.1)
  --scheduled F     already scheduled, upcoming                   (default 0.25)
  --days-of-week F  "days of the week" (recurring) meetings       (default 0.15)
                    anything left over is an unscheduled "dates" meeting

Other
  --user EMAIL      add this real, already signed-up user to every group,
                    host some meetings and invite them to the rest
  --seed N          reproduce a previous run (the seed is printed each run)
  --append          keep earlier seeded data instead of wiping it first
                    (use a seed you have not used before)
  --help            show this message

All times are America/Los_Angeles. Only localhost databases are accepted.
The same --seed gives the same content on the same calendar day; meeting dates
are counted forward from today, and ids and invite tokens are always random.`;

export class ArgError extends Error {}

function integer(
	flag: string,
	raw: string | undefined,
	fallback: number,
	min: number,
	max: number,
): number {
	if (raw === undefined) return fallback;
	// Digits only: `Number()` would also accept "", "1e9" and "0x10".
	const value = /^\d+$/.test(raw) ? Number(raw) : Number.NaN;
	if (!Number.isSafeInteger(value) || value < min || value > max) {
		throw new ArgError(
			`--${flag} must be a whole number from ${min} to ${max} (got "${raw}")`,
		);
	}
	return value;
}

function fraction(
	flag: string,
	raw: string | undefined,
	fallback: number,
): number {
	if (raw === undefined) return fallback;
	const value = Number(raw);
	if (!Number.isFinite(value) || value < 0 || value > 1) {
		throw new ArgError(`--${flag} must be between 0 and 1 (got "${raw}")`);
	}
	return value;
}

const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

type HourMinute = `${string}:${string}`;

function time(flag: string, raw: string | undefined): HourMinute | null {
	if (raw === undefined) return null;
	const match = TIME_RE.exec(raw);
	if (!match) {
		throw new ArgError(`--${flag} must look like HH:MM (got "${raw}")`);
	}
	return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function minutes(hhmm: HourMinute): number {
	return getTimeFromHourMinuteString(`${hhmm}:00`);
}

const FLAGS = {
	groups: { type: "string" },
	users: { type: "string" },
	members: { type: "string" },
	meetings: { type: "string" },
	days: { type: "string" },
	"max-dates": { type: "string" },
	from: { type: "string" },
	to: { type: "string" },
	archived: { type: "string" },
	scheduled: { type: "string" },
	"days-of-week": { type: "string" },
	user: { type: "string" },
	seed: { type: "string" },
	append: { type: "boolean" },
	help: { type: "boolean" },
} as const;

function readFlags(argv: string[]) {
	// `pnpm db:seed -- --flag` hands the script a literal leading "--".
	const args = argv[0] === "--" ? argv.slice(1) : argv;
	try {
		return parseArgs({ args, options: FLAGS, strict: true }).values;
	} catch (error) {
		throw new ArgError(error instanceof Error ? error.message : String(error));
	}
}

/** Returns `"help"` when `--help` was passed; throws `ArgError` on bad input. */
export function parseSeedArgs(argv: string[]): SeedOptions | "help" {
	const values = readFlags(argv);
	if (values.help) return "help";

	const members = integer("members", values.members, 8, 0, MAX_POOL_USERS);
	const users = integer(
		"users",
		values.users,
		Math.max(20, members),
		1,
		MAX_POOL_USERS,
	);
	if (members > users) {
		throw new ArgError(
			`--members (${members}) cannot exceed --users (${users}); raise --users`,
		);
	}

	const from = time("from", values.from);
	const to = time("to", values.to);
	if ((from === null) !== (to === null)) {
		throw new ArgError("--from and --to must be given together");
	}
	if (from !== null && to !== null && minutes(to) - minutes(from) < 30) {
		throw new ArgError("--to must be at least 30 minutes after --from");
	}

	const archived = fraction("archived", values.archived, 0.1);
	const scheduled = fraction("scheduled", values.scheduled, 0.25);
	const daysOfWeek = fraction("days-of-week", values["days-of-week"], 0.15);
	// Tolerance: 0.1 + 0.2 + 0.7 is 1.0000000000000002 in floating point.
	if (archived + scheduled + daysOfWeek > 1 + 1e-9) {
		throw new ArgError(
			"--archived, --scheduled and --days-of-week must add up to at most 1",
		);
	}

	return {
		groups: integer("groups", values.groups, 3, 1, 200),
		users,
		members,
		meetings: integer("meetings", values.meetings, 4, 0, 200),
		days: integer("days", values.days, 14, 1, 365),
		maxDates: integer("max-dates", values["max-dates"], 4, 1, 31),
		from,
		to,
		archived,
		scheduled,
		daysOfWeek,
		userEmail: values.user?.trim() || null,
		seed: integer(
			"seed",
			values.seed,
			Math.floor(Math.random() * 2 ** 31),
			0,
			2 ** 32 - 1,
		),
		append: values.append === true,
	};
}
