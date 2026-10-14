#!/usr/bin/env node
// PostToolUse hook (Edit|Write): run `biome check --write` on the file Claude
// just edited. Safe fixes (formatting, sorted classes, organized imports) are
// applied silently. Anything Biome can't fix (a restricted import, a hook
// called conditionally) is sent back to Claude via exit code 2, so it fixes
// the problem in the same turn instead of a reviewer finding it on the PR.
// Plain Node so it works without jq on macOS, Linux and Windows.
import { spawnSync } from "node:child_process";
import { relative } from "node:path";

let input = "";
for await (const chunk of process.stdin) input += chunk;

let filePath;
try {
	filePath = JSON.parse(input)?.tool_input?.file_path;
} catch {
	process.exit(0);
}
if (!filePath || !/\.(m?[jt]sx?|json|jsonc|css)$/.test(filePath))
	process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const rel = relative(root, filePath);
if (rel.startsWith("..")) process.exit(0); // outside the repo

const result = spawnSync(
	"pnpm",
	[
		"exec",
		"biome",
		"check",
		"--write",
		"--no-errors-on-unmatched",
		"--colors=off",
		rel,
	],
	{ cwd: root, encoding: "utf8", shell: process.platform === "win32" },
);

// pnpm couldn't start (e.g. not on the PATH hooks see). Exit 2 would block
// Claude on an error it can't fix, so warn and let the edit through.
if (result.error) {
	process.stderr.write(`biome-fix hook skipped: ${result.error.message}\n`);
	process.exit(0);
}

if (result.status !== 0) {
	process.stderr.write(
		`Biome found problems it could not auto-fix in ${rel}. Fix them before continuing:\n${result.stdout}${result.stderr}`,
	);
	process.exit(2);
}
