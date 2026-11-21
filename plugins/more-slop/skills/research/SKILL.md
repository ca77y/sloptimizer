---
name: research
description: Answers a question from new primary sources and adds the answer to the project's research library — raw notes per source, wiki pages that answer it — delivered as a PR. Use when the user asks to research a topic, gather sources or docs, or add something to the library.
---

# Research

The library holds evidence and synthesis; it never decides the product. Your output is wiki pages that answer the question, backed by one raw note per source, delivered as a PR. Read `library/_meta/librarian.md` (the library's conventions), `docs/BOARD.md` (the board) and `docs/GIT.md` (branches, commits, PRs) first; each one that exists wins over the defaults here. Without a library, report that and suggest the `bootstrap` skill.

## Start

Read the card with its comments, or take the question from the request. Start the card on the board as `docs/BOARD.md` says.

Work in a worktree of your own, so other runs can go on in parallel. Create it with its branch from the latest default branch, named and placed as `docs/GIT.md` says; without one, name the branch `<card id>-<slug>` (or a slug of the request) and put the worktree at `.worktrees/<branch>` in the root checkout. Prepare it as `docs/GIT.md` says, and do everything from here on inside it: every command, every file, every subagent brief, which names the worktree as the project root.

## Plan

Have the `librarian` agent report what the library already holds on the question, and its gaps. Split what it can't answer into a few sub-questions, each answerable from a handful of sources.

## Gather

Dispatch the `library-scout` agent, one per sub-question, in parallel, each briefed with its sub-question and the worktree. Each saves raw notes and reports what it couldn't find.

## Write

Brief the `library-scribe` agent with the question, the raw notes the scouts saved plus any the librarian cited, and the pages to write or extend. It writes the wiki pages that answer the question and updates the index and taxonomy.

## Check

Have the pages reviewed as `TESTING.md` says. By default, have a `library-clerk` check the changed pages and raw notes against their citations and the conventions. Send its blocking findings back to the scribe to fix. One round; what's still open goes under **Not done**.

With no subagents available, do each job yourself, in this order, by the library conventions.

## Ship it

Commit, then bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description in four parts in this order: **What changes** (the question, a short answer, and links to the pages), **Needs you** (calls you made to confirm), **Why trust it** (the sources and how many), **Not done** (gaps; leave it out when empty). Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and the short answer.
