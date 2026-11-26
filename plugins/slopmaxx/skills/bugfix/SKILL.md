---
name: bugfix
description: Fixes a reported bug and opens a pull request that shows it before and after — reproduced independently, fixed test first.
disable-model-invocation: true
---

# Bugfix

A bug you can reproduce has a clear check for the fix; one you can't stays unfixed. Your output is a PR that shows the bug before and after. Read the project's `docs/BOARD.md` (the board), `docs/GIT.md` (work isolation, branches, commits, PRs) and `docs/TESTING.md` (checks and how to validate) first. Carry the work through to the pull request in one go: work through an ordinary obstacle, such as a failing command or a timeout, put a choice only the user can make under **Needs you** and carry on, and stop early only when you can't go on without the user.

## Reproduce

Read the Bug card with its comments, or take the report from the request.

Isolate your work as `docs/GIT.md` says, so other runs can go on in parallel: it sets the branch, where the work happens, and how that place is prepared. Do everything from here on inside that workspace: every command, every file, every subagent brief, which names it as the project root.

Have it reproduced by someone who won't write the fix: the `qa` agent, briefed with the report, the workspace and its scratch folder only (`docs/GIT.md` names it).

- **Reproduced:** carry on with its reproduction.
- **Not reproduced:** comment on the card with what was tried and why it fell short, remove the workspace and its unpushed branch, and stop. Report the same to the user.
- **Couldn't run:** report the missing prerequisite, remove the workspace and its unpushed branch, and stop, leaving the card as it is.

## Fix

Start the card on the board as `docs/BOARD.md` says.

- Turn the reproduction into a regression test at the nearest public seam, see it fail for the reported reason, and commit it before the fix.
- Find the cause from the failing test: narrow it until one change flips it, rather than reasoning from the code alone.
- Make the smallest fix that turns it green, and run the checks `docs/TESTING.md` declares.
- Fix the cause, not the symptom; a related problem you find goes under **Not done** as a follow-up.

## Confirm

Once the regression test passes and the checks are green, run the `simplify` skill on the whole branch, with its arguments set to the diff it reviews: `Review git diff <base>...HEAD`, where `<base>` is the base branch `docs/GIT.md` names, such as `origin/master`. Then run the checks again and commit what it changed. Everything after this sees the simplified code.

Run the reported steps in the app the way `docs/TESTING.md` says, on the port or device it gives this workspace, and capture the proof it names. Before the PR, always have a fresh `qa` agent check the fix: brief it with the bug report, the base branch, the reproduction to rerun, the workspace and its scratch folder. The reproduction and the reported steps must now pass. Fix what holds up. One round. Then run any review `docs/TESTING.md` puts before the PR.

## Ship it

Bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description for the reviewer, in four parts in this order:

- **What changes:** the bug as a user meets it, then the behaviour after the fix.
- **Needs you:** each reading or choice you made that the user should confirm.
- **Why trust it:** the reproduction failing before the fix and passing after, with its command and output, the proof `docs/TESTING.md` names, attached as it says, then the checks.
- **Not done:** follow-ups and known gaps. Leave it out when empty.

Open the PR, ready or as a draft, and request its review by the steps in `docs/GIT.md`, exactly as they are written. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and what's under **Needs you** and **Not done**.
