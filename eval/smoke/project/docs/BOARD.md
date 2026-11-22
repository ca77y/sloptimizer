# Board

How this project's board is reached and what may be written to it. An operation not bound here isn't allowed.

## Board

- Tracker: local Markdown cards, one file per card under `.board/` in the root checkout. The folder is outside git.
- Access: the file tools. No credential.

## Operations

- Find, read, search: read and search `.board/*.md`.
- Create: write `.board/<PREFIX>-<n>.md`, where the prefix is `STORY` for a Feature, `BUG` for a Bug and `SPIKE` for a Spike, and `n` is one more than the highest number that prefix has (starting at 1). The file is `# <title>`, a `Status: Backlog` line, a `Labels: <label>` line, a `Priority: <priority>` line, then the description.
- Update: rewrite the card's description or its `Labels:` line. Relations are `Blocked by: <id>` and `Related: <id>` lines under the priority line, one per relation.
- Move: rewrite the card's `Status:` line.
- Comment: append a paragraph under a `## Comments` heading at the end of the card, adding the heading when it is missing.
- Link a PR: add a `PR: <path of the PR file>` line under the status line.

## Cards

- Identity: the file name without `.md`, such as `STORY-1`. It names spike findings, `docs/spikes/<id lowercased>-<slug>.md`.
- Types: Feature, `docs/templates/feature.md`; Bug, `docs/templates/bug.md`; Spike, `docs/templates/spike.md`. Each template's frontmatter gives the type's label, summary and default priority. A request names its type; otherwise it is a Feature.
- Priority: High, Medium or Low.
- Dependencies: `Blocked by: <id>` lines.
- Layout: the title is the card's `# ` heading; the description is the template's fenced block, filled, with empty optional sections dropped.

## Statuses

- Statuses: Backlog, Todo, In Progress, In Review, Done.
- Moves agents make: to In Progress when work starts, and to In Review when the PR opens.
- Moves that belong to the user: to Todo, Done or Canceled.

## Other conditions

- Filing a card: whenever a skill's output is a card.
- Editing a card: an answered open question, a stale relation or a wrong label may be fixed; anything that changes the card's goal is reported instead.
