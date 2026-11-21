---
name: deliver
description: Takes a story card, or a described change, to a reviewed pull request — tests first, validated by running the app, with a PR description written for the reviewer. Use when the user asks to deliver, implement, build or ship a card, ticket, story or change.
---

# Deliver

The card says why and what; you decide how, and your output is a pull request a reviewer can trust. Read the project's `docs/BOARD.md` (the board), `docs/GIT.md` (branches, commits, PRs) and `TESTING.md` (checks and how to validate) first; each one that exists wins over the defaults here.

## Start

Read the card with its comments, or take the change from the request. Start the card on the board as `docs/BOARD.md` says.

Work in a worktree of your own, so other runs can go on in parallel. Create it with its branch from the latest default branch, named and placed as `docs/GIT.md` says; without one, name the branch `<card id>-<slug>` (or a slug of the request) and put the worktree at `.worktrees/<branch>` in the root checkout. Prepare it as `docs/GIT.md` says, and do everything from here on inside it: every command, every file, every subagent brief, which names the worktree as the project root.

Where the card is ambiguous or leaves a choice open, take the most reasonable reading, carry on, and list it under **Needs you**. Read the code the change touches and its tests before writing any.

## Build

- Work in vertical slices: one failing test for one behaviour, then the least code that passes it, then the next. Commit each failing test before the code that makes it pass.
- Test behaviour through public interfaces, with expected values from an independent source, so the tests survive a refactor.
- Every acceptance criterion gets a test or a validation step that would fail without the change.
- Run the checks `TESTING.md` declares as you go, and all of them at the end.
- Change only what the card asks for. Something worth fixing outside it goes under **Not done** as a follow-up.

## Validate and review

Validate each acceptance criterion in the running app the way `TESTING.md` says for its kind of change, on the port or device it gives this worktree, and capture the proof it names for that kind: screenshots, traces, responses, logs.

Then have the change reviewed as `TESTING.md` says. The check before the PR is independent: the `qa` agent when available, or any subagent you can spawn, briefed with the card, the base branch and the worktree, with your reasoning kept out. With no subagent, re-read the diff cold against the card. Fix what holds up. One round. A criterion still not met, or without its proof, goes under **Not done**, with why.

## Ship it

Bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description for the reviewer, in four parts in this order:

- **What changes:** the behaviour before and after, in the card's terms.
- **Needs you:** each reading or choice you made that the user should confirm.
- **Why trust it:** each criterion with its proof, attached as `TESTING.md` says, then the tests and checks.
- **Not done:** criteria you couldn't check, follow-ups, known gaps. Leave it out when empty.

Open the PR ready when the ready-for-review conditions in `TESTING.md` hold and nothing under **Not done** blocks merging, and as a draft otherwise. Request review as `TESTING.md` says. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and what's under **Needs you** and **Not done**.
