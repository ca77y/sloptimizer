---
name: research
description: Answers a question from new primary sources and adds the answer to the project's research library — raw notes per source, wiki pages that answer it — delivered as a PR.
disable-model-invocation: true
---

# Research

The library holds evidence and synthesis; it never decides the product. Your output is wiki pages that answer the question, backed by one raw note per source, delivered as a PR. Read `library/_meta/librarian.md` (the library's conventions), `docs/BOARD.md` (the board) and `docs/GIT.md` (work isolation, branches, commits, PRs) first. Carry the work through to the pull request in one go: work through an ordinary obstacle, such as a failing command or a timeout, put a choice only the user can make under **Needs you** and carry on, and stop early only when you can't go on without the user.

## Start

Read the card with its comments, or take the question from the request. Start the card on the board as `docs/BOARD.md` says.

Isolate your work as `docs/GIT.md` says, so other runs can go on in parallel: it sets the branch, where the work happens, and how that place is prepared. Do everything from here on inside that workspace: every command, every file, every subagent brief, which names it as the project root.

## Plan

Have the `librarian` agent report what the library already holds on the question, and its gaps. Split what it can't answer into the fewest sub-questions that cover it, each answerable from a handful of sources. A narrow question stays one sub-question, with one scout: each scout is a session of its own, so a second one has to earn its cost.

## Gather

Dispatch the `scout` agent, one per sub-question, in parallel, each briefed with its sub-question and the workspace. Each saves raw notes and reports what it couldn't find.

## Write

Brief the `scribe` agent with the question, the raw notes the scouts saved plus any the librarian cited, and the pages to write or extend. It writes the wiki pages that answer the question and updates the index and taxonomy.

## Check

Always have a `clerk` check the changed pages and raw notes against their citations and the conventions. Send its blocking findings on pages back to the scribe to fix; a finding on a raw note goes under **Not done**, since a note is written once. One round; what's still open goes under **Not done**. Then run any review `TESTING.md` puts before the PR.

## Ship it

Commit, then bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description in four parts in this order: **What changes** (the question, a short answer, and links to the pages), **Needs you** (calls you made to confirm), **Why trust it** (the sources and how many), **Not done** (gaps; leave it out when empty). Open the PR ready when the ready-for-review conditions in `TESTING.md` hold and nothing under **Not done** blocks merging, and as a draft otherwise. Request review as `TESTING.md` says. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and the short answer.
