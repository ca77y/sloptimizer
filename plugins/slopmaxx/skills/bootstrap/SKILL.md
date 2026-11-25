---
name: bootstrap
description: Sets a project up for the other skills, together with the user — writes docs/BOARD.md, docs/GIT.md, docs/TESTING.md and the research library, or checks and fixes existing ones.
disable-model-invocation: true
---

# Bootstrap

The other skills read a few project files as ground truth and check none of them, so every rule in them has to be true and has to be the user's. This is the one skill you work through with the user: the repo shows the facts, the user makes the choices. Create what's missing; in what exists, fix only what is wrong or unclear, and keep the rest.

## The files

Fill each template in `resources/` one line per rule, stating the rule and the binding rather than a command transcript:

- **`docs/BOARD.md`** from `resources/BOARD.md`: the tracker and how each operation runs on it (find, read, create, update, relate, comment, move), how story, bug and spike cards are laid out, its statuses, and which moves belong to the user.
- **`docs/GIT.md`** from `resources/GIT.md`: the default branch, how each delivery's work is isolated (branch naming, where the work happens, normally a worktree of its own, what prepares it, and its scratch folder), the commit convention, how PRs are opened and reviewed, and what is off limits.
- **`docs/templates/`**: one template per type of card the board has, written with the user and listed in `docs/BOARD.md`. Each opens with frontmatter that sets the tracker fields a new card of the type gets: `type`, `label`, `summary` (what the type is for, in one line) and `priority` (the default, on the board's scale). The body holds the card's layout, with a line on what goes in each section, inside one fenced block that becomes the card's description; how to set priority when the default doesn't fit, if the type needs that; the bar a card must clear before it's written; and the checklist a reviewer judges it against. Draft from the tracker's existing cards where it has them.
- **`docs/TESTING.md`** from `resources/TESTING.md`: the checks that must pass, how to run the app with several workspaces running it at once, how each kind of change is validated and the proof that goes into the PR, and how work is reviewed.
- **`library/`** from `resources/library/`: copy the tree, and fill the project name.

Every one of these files lives under `docs/`, except the library. Move one an earlier setup left at the root, such as `TESTING.md`, to its place in `docs/`, and update what points to it.

Then point the root `AGENTS.md` or `CLAUDE.md` to each of these files in a line or two, and ignore the scratch folder and the worktree folder in git. Check that the tools `docs/TESTING.md` runs (linters, test runners, type checkers) skip the worktree folder too, and propose the exclusion where one would scan it.

## Work through it with the user

Go one file at a time. For each:

1. Read what the repo and the tracker already show: remotes and branches, commit history, CI config, the package manifest, build files, existing tests and docs, the tracker's teams, statuses and labels through its connected tools.
2. Draft the file from those facts, and propose an answer for every choice they leave open, with the reason. For a choice about what agents may do, propose the narrower option; a wider one goes in only when the user states it.
3. Show the user the draft and the choices, a few at a time, and ask them to confirm or correct each:
   - **Board:** which types of card it has (propose story, bug and spike, and ask whether stories split into features and improvements and whether research gets its own type), each template's sections and checklist, who may move a card to which status, and where cards are filed.
   - **Git:** how each delivery's work is isolated (propose a worktree per delivery at `.worktrees/<branch>` in the root checkout, with `.tmp/` in it as the scratch folder), and what agents may never do.
   - **Testing:** which kinds of change exist, how each is validated, what proof it leaves (screenshots, traces, logs) and how that proof reaches the PR, who reviews and what a review checks, and where the test account and env file come from.
   - Anything else only they can decide.
4. Write the file once the user has settled its choices.

A binding goes in only when it works on the tracker or repo as written; check each read binding by using it once. A value nobody can give yet stays as a `TODO:` line. Record where a credential comes from, never the credential.

## Finish

Run the checks `docs/TESTING.md` now declares. Report the files created and changed, the content kept, and every `TODO:` left, with what would fill it.
