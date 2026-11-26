---
name: spike
description: Answers a bounded technical question with a cited findings document, measuring what evidence can't settle with a throwaway prototype, delivered as a PR.
disable-model-invocation: true
---

# Spike

A spike answers one question so a story can be shaped. Your output is a findings document in the repo, delivered as a PR. Read the project's `docs/BOARD.md` (the board) and `docs/GIT.md` (work isolation, branches, commits, PRs) first. Carry the work through to the pull request in one go: work through an ordinary obstacle, such as a failing command or a timeout, put a choice only the user can make under **Needs you** and carry on, and stop early only when you can't go on without the user.

## Start

Read the Spike card with its comments, or take the question from the request. Where the question is ambiguous, take the most reasonable reading and state it as an assumption. Start the card on the board as `docs/BOARD.md` says.

Isolate your work as `docs/GIT.md` says, so other runs can go on in parallel: it sets the branch, where the work happens, and how that place is prepared. Do everything from here on inside that workspace: every command, every file, every subagent brief, which names it as the project root.

## Find out

- Start from what's known: have the `librarian` agent report what the project library holds, and read the code, upstream docs and known issues.
- When the answer needs sources the library lacks, dispatch the `scout` agent, one per sub-question, in parallel; it saves raw notes you can cite. Then have a `clerk` check the notes they saved, and fix what holds up before you cite them.
- List the claims the answer rests on. A claim that only a measurement can settle gets a throwaway prototype: on a local branch and worktree of its own that `docs/GIT.md` names for prototypes, or under `spike/` in the scratch folder `docs/GIT.md` names otherwise. Record every command and its output, then delete the prototype; the document keeps the evidence.

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

Always have the `reviewer` agent check the document, since it didn't write it. Brief it with the question, the document and the workspace, and ask whether each claim's source says what the claim says, wherever it can open that source (code, library pages, recorded measurements), whether every part of the question is answered or named as unknown, and whether anything recommends. Fix what holds up. One round. Then run any review `docs/TESTING.md` puts before the PR.

## Ship it

Commit, then bring in the latest default branch so the PR merges cleanly, then push and open the PR as `docs/GIT.md` says, linked to the card. Write its description in four parts in this order: **What changes** (the question and its answer), **Needs you** (assumptions to confirm), **Why trust it** (the evidence and its sources), **Not done** (unknowns; leave it out when empty). Open the PR, ready or as a draft, and request its review by the steps in `docs/GIT.md`, exactly as they are written. Move the card as `docs/BOARD.md` says, leaving the transitions it reserves for the user to the user. Report the PR link and the answer.
