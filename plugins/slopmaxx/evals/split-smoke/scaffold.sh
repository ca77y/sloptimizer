#!/bin/sh
# Builds the throwaway project this case runs in: a git repository on main, with the project files the skills read.
set -e
git init -q -b main
git config user.email eval@example.com
git config user.name eval
cat > calc.py <<'PY'
def add(a, b):
    return a + b
PY
cat > test_calc.py <<'PY'
import unittest
from calc import add


class AddTest(unittest.TestCase):
    def test_small(self):
        self.assertEqual(add(2, 2), 4)


if __name__ == "__main__":
    unittest.main()
PY
cat > TESTING.md <<'MD'
# Testing

## Checks

- Tests: `python3 -m unittest`

## Running the app

`calc.py` is a module; there is no app to start.

## Validating a change

- Library: validate by calling the function with `python3 -c`; proof: the command and its output, inline in the PR description.

## Review

- Who reviews: the `qa` agent before the PR opens; no person.
- Ready for review when: the tests pass and every criterion has its proof or is listed under Not done.

## Blind spots

None.
MD
mkdir -p .board docs
cat > docs/BOARD.md <<'MD'
# Board

## Board

- Tracker: local Markdown cards, one file per card under `.board/`.

## Operations

- Find, read, search: read and search `.board/*.md`.
- Create: write `.board/<TYPE>-<n>.md`, where TYPE is `STORY`, `BUG` or `SPIKE` and `n` is one more than the highest existing number of that type (starting at 1): `# <title>`, a `Status: Backlog` line, a `Labels:` line, then the body.
- Update: rewrite the card's body or its `Labels:` line; relations are `Blocked by: <id>` and `Related: <id>` lines under the labels line.
- Move: rewrite the card's `Status:` line.
- Comment: append a `## Comments` section, or a paragraph to it.
- Link a PR: add a `PR: <path>` line under the status line.

## Cards

- Identity: the file name without `.md` (`STORY-1`); spike findings are `docs/spikes/<id lowercased>-<slug>.md`.
- Types: Feature, `docs/templates/feature.md`; Bug, `docs/templates/bug.md`. Each template's frontmatter gives the type's label. A request names its type; otherwise it is a Feature.
- Layout: `# <title>`, the status and labels lines, then the template's fenced block, filled.

## Statuses

- Statuses: Backlog, Todo, In Progress, In Review, Done.
- Moves agents make: to In Progress when work starts, to In Review when the PR opens.
- Moves that belong to the user: Todo and Done.
MD
mkdir -p docs/templates
cat > docs/templates/feature.md <<'MD'
---
type: Feature
label: Feature
summary: A new capability for users of calc.py, small enough for one PR.
---

# Feature

## Template

```markdown
<One paragraph: what changes, and for whom.>

## Why

<Who needs it.>

## Scope

<What the change covers, as behaviour.>

## Out of scope

<What a reader would assume is included but isn't.>

## Acceptance criteria

- <One observable pass/fail behaviour per bullet.>

## Assumptions

## Open questions
```

## Before writing

- The outcome isn't already covered by an existing function or card.

## Checklist

- Each criterion passes or fails with nothing in between, seen from outside the code.
- At most 20 criteria.
- No implementation and no code locations.
MD
cat > docs/templates/bug.md <<'MD'
---
type: Bug
label: Bug
summary: Behaviour of calc.py that fails as a user meets it.
---

# Bug

## Template

```markdown
## Observed

<What happens.>

## Expected

<What should happen instead.>

## Steps

1. <From a clean start to the failure.>
```

## Checklist

- Observed and Expected differ, and the Steps show the failure.
- No diagnosis or fix.
MD
cat > docs/GIT.md <<'MD'
# Git

## Repository

- Remote and forge: `origin`, the local bare repository `.forge/remote.git`; a local stub forge, where a pull request is the file `.forge/prs/smoke.md`.
- Default branch: `main`.

## Workspace

How each delivery's work is isolated. Nothing else runs in this checkout.

- Branch name: `smoke`, from `main`.
- Where the work happens: this checkout, on the branch, switched to with `git switch -c smoke main`; no worktree.
- Preparing it: none.
- Removing it: none.
- Spike prototypes: under `.tmp/spike/`, never committed.

## Commits and push

- Commit convention: Conventional Commits.
- Before each push: `git merge --no-edit main`; push with `git push -u origin smoke`.

## Pull request

- Opening: write `.forge/prs/smoke.md` with `# <title>` and the description, under a `Draft: yes` line while it's a draft.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.

## Restrictions

- Never commit to `main`, merge into it, force-push, or rewrite history.
MD
cat > .board/STORY-1.md <<'MD'
# calc.py for the whole team

Status: Todo
Labels: Feature

calc.py grows from one `add` function into the team's everyday calculator: unit conversions for the field team, a
saved history for the analysts, and a small HTTP service the dashboard can call.

## Why

The field team converts units by hand and gets it wrong; the analysts redo sums they ran yesterday; the dashboard
team wants results without shelling out to Python.

## Scope

- Unit conversions, `python3 calc.py convert <value> <from> <to>`, between metres, feet, kilometres and miles, between
  kilograms and pounds, and between Celsius and Fahrenheit.
- A history: every command-line result is saved to `~/.calc_history`, `python3 calc.py history` lists them, and
  `python3 calc.py history --clear` empties it.
- An HTTP service, `python3 calc.py serve --port <n>`, with `GET /add?a=&b=` and `GET /convert?value=&from=&to=`,
  answering JSON.

## Acceptance criteria

- `python3 calc.py convert 1 km m` prints 1000.
- `python3 calc.py convert 1 mi km` prints 1.609344.
- `python3 calc.py convert 1 m ft` prints 3.28084, rounded to five decimals.
- `python3 calc.py convert 1 kg lb` prints 2.20462, rounded to five decimals.
- `python3 calc.py convert 100 C F` prints 212.
- `python3 calc.py convert 32 F C` prints 0.
- `python3 calc.py convert 1 kg m` exits 2 and says the units don't match.
- `python3 calc.py convert 1 parsec m` exits 2 and names the unknown unit.
- `python3 calc.py convert abc m ft` exits 2 and says the value isn't a number.
- `python3 calc.py add 2 3` prints 5.
- After `python3 calc.py add 2 3`, `python3 calc.py history` lists `add 2 3 = 5`.
- `history` lists results oldest first, one per line.
- `history` with no saved results prints nothing and exits 0.
- `history --clear` empties the history.
- History survives between runs.
- A history file that can't be read is reported, and the command still prints its result.
- `python3 calc.py serve --port 8765` answers `GET /add?a=2&b=3` with `{"result": 5}`.
- `GET /convert?value=1&from=km&to=m` answers `{"result": 1000}`.
- A missing or non-numeric parameter answers 400 with `{"error": "..."}` naming it.
- An unknown path answers 404.
- Mismatched units on `/convert` answer 400.
- The service logs one line per request.
- The service stops cleanly on Ctrl-C.
- `python3 calc.py --help` lists `add`, `convert`, `history` and `serve`.
MD
printf '.worktrees/\n/.tmp/\n/.forge/\n/.board/\n__pycache__/\n' > .gitignore
git add -A
GIT_AUTHOR_DATE=2026-01-01T00:00:00Z GIT_COMMITTER_DATE=2026-01-01T00:00:00Z git commit -qm "chore: seed"
