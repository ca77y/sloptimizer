---
name: spike
description: Answers a bounded technical question with a cited findings document, measuring what evidence can't settle with a throwaway prototype, delivered as a PR. Use when the user asks to spike, investigate, evaluate, compare options or find out whether something works, or hands over a Spike card.
---

# Spike

A spike answers one question so a story can be shaped. Your output is a findings document in the repo, delivered as a PR. Read the project's `docs/BOARD.md` (the board) and `docs/GIT.md` (branches, commits, PRs) first; each one that exists wins over the defaults here.

## Start

Read the Spike card with its comments, or take the question from the request. Where the question is ambiguous, take the most reasonable reading and state it as an assumption. Start the card on the board as `docs/BOARD.md` says.

Work in a worktree of your own, so other runs can go on in parallel. Create it with its branch from the latest default branch, named and placed as `docs/GIT.md` says; without one, name the branch `<card id>-<slug>` (or a slug of the request) and put the worktree at `.worktrees/<branch>` in the root checkout. Prepare it as `docs/GIT.md` says, and do everything from here on inside it: every command, every file, every subagent brief, which names the worktree as the project root.

## Find out

- Start from what's known: have the `librarian` agent report what the project library holds, and read the code, upstream docs and known issues.
- When the answer needs sources the library lacks, dispatch the `library-scout` agent, one per sub-question, in parallel; it saves raw notes you can cite. With no subagent, gather them yourself by the library conventions.
- List the claims the answer rests on. A claim that only a measurement can settle gets a throwaway prototype: on a local branch and worktree of its own that `docs/GIT.md` names for prototypes, or under `.tmp/spike/` in your worktree otherwise. Record every command and its output, then delete the prototype; the document keeps the evidence.

## Write the findings

Write `docs/spikes/<card id>-<slug>.md`, lowercased, with these sections:

- **Question:** word for word from the card.
- **Answer:** one paragraph that answers it directly, with the conditions it holds under.
- **Findings:** each claim with its citation: a `path:line`, a library page, a URL, or a measurement.
- **Measurements:** each command, its output, and the value. A figure with no recorded command stays out.
- **Options and trade-offs:** each option with what it costs and when it holds, unranked; choosing is the story's job.
- **Unknowns:** what no evidence settled, with why.
- **Assumptions:** what you settled on your own, such as the environment a timing ran in.

## Review

Have the document reviewed as `TESTING.md` says, and by default by someone who didn't write it: the `reviewer` agent when available, or any subagent you can spawn. Brief it with the question, the document and the worktree, and ask whether every claim's source says what it claims, every part of the question is answered or named as unknown, and nothing recommends. Fix what holds up. One round.

## Ship it

Commit, then bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description in four parts in this order: **What changes** (the question and its answer), **Needs you** (assumptions to confirm), **Why trust it** (the evidence and its sources), **Not done** (unknowns; leave it out when empty). Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and the answer.
