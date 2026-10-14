@AGENTS.md

## Claude Code workflow

These apply to Claude Code sessions only; the shared rules above also go to Cubic.

- **Plan first** for any change touching more than two files or more than one package. The plan names every file you'll touch, the existing function or module each change plugs into, and which "Where new code goes" rule decided placement. Wait for approval.
- **Reuse before writing.** Before adding a helper, hook or component, search both apps and `packages/shared` for an existing one, and say what you found.
- **Keep PRs to one concern.** If a task naturally splits (API route + shared schema, then the mobile screen), stop at the boundary and say so.
- A `PostToolUse` hook runs `biome check --write` on every file you edit. When it reports an error it couldn't fix, fix it before moving on — don't suppress it with `biome-ignore` unless the user agrees.
- Before saying a change is done, run the typechecks for the packages you touched (see Commands).
- `/pr-prep` checks a branch and writes its PR description. `/review-pr <number>` reviews someone else's PR.
