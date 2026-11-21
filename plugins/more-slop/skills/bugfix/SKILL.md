---
name: bugfix
description: Fixes a reported bug end to end — has it reproduced independently, fixes it test first, confirms the reproduction now passes, and opens a PR showing before and after. Use when the user asks to fix, debug or deliver a bug, a Bug card, or something broken, failing or slow.
---

# Bugfix

A bug you can reproduce has a clear check for the fix; one you can't stays unfixed. Your output is a PR that shows the bug before and after. Read the project's `docs/BOARD.md` (the board), `docs/GIT.md` (branches, commits, PRs) and `TESTING.md` (checks and how to validate) first; each one that exists wins over the defaults here.

## Reproduce

Read the Bug card with its comments, or take the report from the request.

Work in a worktree of your own, so other runs can go on in parallel. Create it with its branch from the latest default branch, named and placed as `docs/GIT.md` says; without one, name the branch `<card id>-<slug>` (or a slug of the request) and put the worktree at `.worktrees/<branch>` in the root checkout. Prepare it as `docs/GIT.md` says, and do everything from here on inside it: every command, every file, every subagent brief, which names the worktree as the project root.

Have it reproduced by someone who won't write the fix: the `qa` agent when available, or any subagent you can spawn, briefed with the report and the worktree only. With no subagent, reproduce it yourself under `.tmp/qa/` before reading the code you suspect.

- **Reproduced:** carry on with its reproduction.
- **Not reproduced:** comment on the card with what was tried and why it fell short, remove the worktree and its unpushed branch, and stop. Report the same to the user.
- **Couldn't run:** report the missing prerequisite, remove the worktree and its unpushed branch, and stop, leaving the card as it is.

## Fix

Start the card on the board as `docs/BOARD.md` says.

- Turn the reproduction into a regression test at the nearest public seam, see it fail for the reported reason, and commit it before the fix.
- Find the cause from the failing test: narrow it until one change flips it, rather than reasoning from the code alone.
- Make the smallest fix that turns it green, and run the checks `TESTING.md` declares.
- Fix the cause, not the symptom; a related problem you find goes under **Not done** as a follow-up.

## Confirm

Run the reported steps in the app the way `TESTING.md` says, on the port or device it gives this worktree, and capture the proof it names. Then have the change reviewed as `TESTING.md` says. The check before the PR is independent: a fresh `qa`, briefed with the report as the change asked for, the base branch, the reproduction to rerun, and the worktree. The reproduction and the reported steps must now pass. With no subagent, rerun them yourself and re-read the diff cold. Fix what holds up. One round.

## Ship it

Bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description for the reviewer, in four parts in this order:

- **What changes:** the bug as a user meets it, then the behaviour after the fix.
- **Needs you:** each reading or choice you made that the user should confirm.
- **Why trust it:** the reproduction failing before the fix and passing after, with its command and output, the proof `TESTING.md` names, attached as it says, then the checks.
- **Not done:** follow-ups and known gaps. Leave it out when empty.

Open the PR ready when the ready-for-review conditions in `TESTING.md` hold and nothing under **Not done** blocks merging, and as a draft otherwise. Request review as `TESTING.md` says. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and what's under **Needs you** and **Not done**.
