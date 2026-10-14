---
name: review-pr
description: Review a teammate's ZotMeet pull request by number — explain how the change fits the existing system, check it against the repo rules, and triage Cubic's comments. Use when asked to review a PR.
disable-model-invocation: true
argument-hint: "<PR number>"
allowed-tools: Bash(gh pr view *) Bash(gh pr diff *) Bash(gh pr checks *) Bash(gh api *) Bash(git diff *) Bash(git log *) Bash(git fetch *) Read Grep Glob
---

# Review PR #$ARGUMENTS

If no PR number was given, ask for one and stop.

## Gather

- `gh pr view $ARGUMENTS --json title,body,author,baseRefName,headRefName,files,additions,deletions`
- `gh pr diff $ARGUMENTS`
- `gh pr checks $ARGUMENTS`
- Cubic's comments: `gh api repos/{owner}/{repo}/pulls/$ARGUMENTS/comments --paginate` and `gh api repos/{owner}/{repo}/issues/$ARGUMENTS/comments --paginate`, keeping those from Cubic's bot account.

Read changed files in full where the diff alone doesn't show how they're used, and read the callers and callees the change touches. Rules to check against: `AGENTS.md` and the matching `.claude/rules/*.md`.

## Report

Write the review for the maintainer, in this order. Be concrete: file and line for every point.

### 1. What this PR does (3–5 sentences)
The user-visible change and the mechanism.

### 2. How it fits the existing system
The call path through the new code and the existing modules it plugs into or changes. Call out anything it duplicates that already exists in the other app or `@zotmeet/shared`. If the change is easier to follow as a diagram, include a small Mermaid `flowchart` or `sequenceDiagram`.

### 3. Read these first
The 2–3 files or hunks that carry the real logic, and why. Skip boilerplate.

### 4. Problems, by severity
- **Must fix:** bugs, broken behaviour, data/timezone mistakes, auth or token handling, a rule from `AGENTS.md`'s "Don't, without asking" list.
- **Should fix:** convention violations from `.claude/rules/` (wrong package, `sx` for layout, effect-synced state, oversized component, …).
- **Nit:** naming, small readability — only the ones worth the author's time.

Don't report anything Biome or the typechecks already enforce if `gh pr checks` shows them passing.

### 5. Cubic triage
Put every Cubic comment in one of three buckets, one line each with a link or file:line:
- **Real** — agrees with a problem above, or one you missed (then add it to section 4).
- **Convention** — correct per our rules.
- **False positive** — wrong for this repo; name the rule or decision it conflicts with (e.g. the intentionally separate same-named files, tests only in `packages/shared`, plain `useState` forms).

If the same false positive shows up across PRs, suggest the line to add to `cubic.yaml` or `AGENTS.md` to stop it.

### 6. Verdict
Approve / approve with nits / request changes, in one line, plus suggested review comments the maintainer can paste.

Don't post comments, approve, or push anything yourself.
