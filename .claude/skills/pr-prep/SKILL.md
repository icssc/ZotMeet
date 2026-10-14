---
name: pr-prep
description: Get the current branch ready for a PR — run the checks, self-review the diff against ZotMeet's rules, and write a walkthrough PR description. Use before opening or updating a pull request.
disable-model-invocation: true
argument-hint: "[base branch, default main]"
allowed-tools: Bash(git diff *) Bash(git log *) Bash(git status *) Bash(git merge-base *) Bash(pnpm check*) Bash(pnpm exec biome *) Bash(pnpm --filter * typecheck) Bash(npx tsc --noEmit)
---

# Prepare this branch for a pull request

Base branch: `$ARGUMENTS` (use `main` if empty). Compare against `git merge-base HEAD <base>`.

## 1. Scope

List the changed files and group them by package (web `src/`, `apps/mobile/`, `packages/shared`, `packages/tokens`, config). If the diff mixes unrelated concerns, or is over ~400 changed lines outside generated files and migrations, say so and propose how to split it before doing anything else. Ask whether to continue.

## 2. Checks

Run, in this order, and report each result in one line:

1. `pnpm check`
2. the typechecks for the packages touched: `pnpm --filter @zotmeet/shared typecheck` / `npx tsc --noEmit` / `pnpm --filter @zotmeet/mobile typecheck`. Anything under `packages/**` needs all three.

If something fails, fix it when the fix is mechanical and inside this branch's changes; otherwise stop and report it.

## 3. Self-review

Read the full diff (not just file names) and check it against `AGENTS.md` and the matching files in `.claude/rules/` (web, mobile, packages, react). Look for, at minimum:

- code in the wrong package (the "Where new code goes" order), or logic duplicated that already exists in the other app or in `@zotmeet/shared` — search before claiming it's new;
- hex/HSL/px literals, `sx` used for layout on web, `new Date(iso)` on a day column;
- React: state synced with `useEffect`, unstable list keys, components over ~250 lines or doing two jobs, missing pending/error state on async actions;
- an API route that reimplements server logic instead of calling an `@actions`/`@data` function, or a response not built with `satisfies`;
- leftover debug code, commented-out code, TODOs without an issue.

Fix what is clearly wrong. List anything that needs a judgment call instead of changing it.

## 4. PR description

Fill in `.github/pull_request_template.md`. In **How it works**, give the call path through the new code (e.g. screen → hook → `lib/api/x.ts` → `src/app/api/x/route.ts` → `@actions/x`), what existing code it plugs into, and which rule decided where new code went. In **Start reviewing at**, name the 2–3 files a reviewer should read first and why. Leave screenshots and the issue number for the author to fill.

Print the description in a fenced markdown block so it can be pasted. Don't commit, push, or open the PR.

## 5. Summary

End with: checks (pass/fail), what you fixed, open questions for the author, and the description.
