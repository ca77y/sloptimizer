---
name: deliver
description: Takes a story card, or a described change, to a reviewed pull request — tests first, validated by running the app, with a PR description written for the reviewer.
disable-model-invocation: true
---

# Deliver

The card says why and what; you decide how, and your output is a pull request a reviewer can trust. Read the project's `docs/BOARD.md` (the board), `docs/GIT.md` (work isolation, branches, commits, PRs) and `docs/TESTING.md` (checks and how to validate) first. Carry the work through to the pull request in one go: work through an ordinary obstacle, such as a failing command or a timeout, put a choice only the user can make under **Needs you** and carry on, and stop early only when you can't go on without the user.

## Start

Read the card with its comments, or take the change from the request. Start the card on the board as `docs/BOARD.md` says.

Isolate your work as `docs/GIT.md` says, so other runs can go on in parallel: it sets the branch, where the work happens, and how that place is prepared. Do everything from here on inside that workspace: every command, every file, every subagent brief, which names it as the project root.

Where the card is ambiguous or leaves a choice open, take the most reasonable reading, carry on, and list it under **Needs you**. Read the code the change touches and its tests before writing any.

Then list the vertical slices the change needs: each adds one behaviour, proven by one failing test. A change that is a single slice needs no spec. With more than one, write a spec by `references/spec.md` to `spec.md` in the scratch folder `docs/GIT.md` names before the first test, with the slices in build order, and build from it. It is the plan and the status in one place: keep it current as you work, so a restarted session reads it first and carries on. It is never committed; what the reviewer needs from it goes into the PR description.

## Build

- Work in vertical slices: one failing test for one behaviour, then the least code that passes it, then the next. Commit each failing test before the code that makes it pass.
- Test behaviour through public interfaces, with expected values from an independent source, so the tests survive a refactor.
- Every acceptance criterion gets a test or a validation step that would fail without the change.
- Run the checks `docs/TESTING.md` declares as you go, and all of them at the end.
- Change only what the card asks for. Something worth fixing outside it goes under **Not done** as a follow-up.

## Validate and review

Once every slice is built and the checks pass, run the `simplify` skill on the whole branch, with its arguments set to the diff it reviews: `Review git diff <base>...HEAD`, where `<base>` is the base branch `docs/GIT.md` names, such as `origin/master`. Then run the checks again and commit what it changed. Everything after this, validation and review alike, sees the simplified code.

Validate each acceptance criterion in the running app the way `docs/TESTING.md` says for its kind of change, on the port or device it gives this workspace, and capture the proof it names for that kind: screenshots, traces, responses, logs.

Before the PR, always have the `qa` agent check the change: brief it with the card, the base branch, the workspace and its scratch folder, and keep your reasoning out. Fix what holds up. One round. Then run any review `docs/TESTING.md` puts before the PR. A criterion still not met, or without its proof, goes under **Not done**, with why.

## Ship it

Bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description for the reviewer, in four parts in this order:

- **What changes:** the behaviour before and after, in the card's terms.
- **Needs you:** each reading or choice you made that the user should confirm.
- **Why trust it:** each criterion with its proof, attached as `docs/TESTING.md` says, then the tests and checks.
- **Not done:** criteria you couldn't check, follow-ups, known gaps. Leave it out when empty.

Open the PR, ready or as a draft, and request its review by the steps in `docs/GIT.md`, exactly as they are written. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and what's under **Needs you** and **Not done**.
