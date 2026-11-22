---
name: agy-review
description: Has Google's Antigravity CLI (agy), on a Gemini model, review the current branch's changes before they are pushed or opened as a pull request, then checks each finding against the code and fixes what holds up. Use when the user asks for an agy, Antigravity or Gemini review, a second-model or cross-model review, or a review of a branch before pushing it.
---

# agy review

A second model reviews the branch before it is pushed: Google's Antigravity CLI, `agy`, on a Gemini model, so the review doesn't share the author's blind spots. You then judge each finding and fix what holds up. Read the project's `docs/GIT.md` for the scratch folder (`.tmp/` in the workspace by default) and `TESTING.md` for the checks; each one that exists wins over the defaults here.

## Run

The review covers the current state of the workspace the change is in, against its base: committed, uncommitted and untracked changes since it last matched the base, whether on a branch or on the default branch itself. The workspace is the delivery's worktree inside a delivery, as `docs/GIT.md` sets it, and otherwise the checkout the user is working in. The base is `origin/HEAD` (the default branch when there is no remote), or the one the user names.

`agy` reviews the folder it starts in, so start it in that workspace. Note the workspace's `git status --porcelain` and `git diff HEAD | git hash-object --stdin` first, so you can tell afterwards whether the reviewer changed anything. Then, with the workspace's absolute path as `<workspace>`, this skill's folder as `<skill>` and the base as `<base>`:

```sh
cd <workspace>
mkdir -p <scratch>/agy-review
agy -p "Base: <base>. $(cat <skill>/references/brief.md)" \
  --model gemini-4-neon-high \
  --mode auto \
  --output-format json \
  --json-schema <skill>/references/findings.schema.json \
  --print-timeout 20m > <scratch>/agy-review/review.json
```

- Use the model the user or `TESTING.md` names in place of Gemini 4 Neon; `agy models` lists the slugs.
- A review takes minutes; run it in the background and wait for it to finish.
- The result is one JSON object: `status` is `SUCCESS` and the review is in `structured_output`. Any other status, a missing `agy`, or empty output means no review happened: report the error `agy` gave and how to fix it, such as running `agy` once in a terminal to sign in, and stop there.

When the status or diff hash changed, the reviewer touched the checkout: show the user what changed, and leave it for them to keep or discard.

## Judge

The findings come from a reviewer without your context: weigh each as advice, and decide by the code. For each one, read the code it points at and the code around it, and decide whether it holds up.

- Fix what holds up, with a failing test first when it is a behaviour bug, and run the checks `TESTING.md` declares.
- Leave what doesn't, with one line on why.
- One round: the fixes are not sent back for another review.

Inside a delivery, commit the fixes as `docs/GIT.md` says; otherwise leave them uncommitted for the user.

## Report

Report the model that reviewed, the reviewer's summary, each finding with what you did about it (fixed, or left and why), and anything the review didn't cover.
