import { parseArgs } from "node:util";

export const USAGE = `Seed the local database with future groups, meetings and availabilities.

Usage: pnpm db:seed --user you@example.com

  --user EMAIL  your real, already signed-up account. It joins every seeded
                group, hosts some meetings and gets invite notifications for
                the others.
  --help        show this message

Each run deletes the previous seeded data and creates new data. Real accounts
and everything outside the seeded groups are left alone. All times are
America/Los_Angeles. Only localhost databases are accepted.`;

export class ArgError extends Error {}

const FLAGS = {
	user: { type: "string" },
	help: { type: "boolean" },
} as const;

function readFlags(argv: string[]) {
	const args = argv[0] === "--" ? argv.slice(1) : argv;
	try {
		return parseArgs({ args, options: FLAGS, strict: true }).values;
	} catch (error) {
		throw new ArgError(error instanceof Error ? error.message : String(error));
	}
}

export function parseSeedArgs(argv: string[]): { userEmail: string } | "help" {
	const values = readFlags(argv);
	if (values.help) return "help";

	const userEmail = values.user?.trim();
	if (!userEmail) {
		throw new ArgError("--user EMAIL is required.");
	}
	return { userEmail };
}
