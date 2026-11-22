# Architecture

How the repo and its plugins are built. The principles they are designed against are in [`DESIGN.md`](DESIGN.md), and the rules that always apply are in the root `AGENTS.md`. When a change alters a decision below, update it here in the same change.

## Distribution

- One repo, two installers: the `sloptimizer` Claude Code marketplace in `.claude-plugin/marketplace.json`, and a skills source for `npx skills`, which scans each plugin's `skills/` folder.
- Each plugin is a folder under `plugins/` with its manifest in `.claude-plugin/plugin.json`, its skills in `skills/`, its agents in `agents/`, and its smoke eval cases in `evals/`.
- `npx skills` installs every skill into one flat folder, so skill names are unique across the whole repo.

## Skills and agents

- A skill is an entry point: `skills/<name>/SKILL.md`, with `name` equal to the folder and a `description` that says when to use it. Its `references/` hold what only the skill needs, such as `split`'s plan bar or `deliver`'s spec template, and `resources/` hold files it copies into a project, such as `bootstrap`'s templates for project files.
- Every skill but `bootstrap` can be started by the model from its description; `bootstrap` sets `disable-model-invocation`, because it works through each file with the user.
- A skill or an agent may use any other skill when the work calls for it.
- `agy-review` is the one skill that reaches outside Claude Code: it runs Google's Antigravity CLI, `agy`, headless, so the review comes from a different tool and model. It is a skill, not an agent, because `agy` is already the independent reviewer and judging its findings needs the main session's context. It needs `agy` installed and signed in on the user's machine, and reports when it isn't.
- The main session does the work. An agent exists only where independence or a clean context is the point, and each skill decides when to dispatch it:

| Agent       | Model  | Does                                                                                                | Dispatched by              |
| ----------- | ------ | --------------------------------------------------------------------------------------------------- | -------------------------- |
| `qa`        | opus   | reproduces a bug from the report alone, or checks a change against its card; writes only `.tmp/qa/` | `deliver`, `bugfix`        |
| `reviewer`  | sonnet | reviews a draft card, plan or document against a checklist; report-only                             | `shape`, `split`, `spike`  |
| `librarian` | sonnet | answers from the existing library; read-only                                                        | `ask`, `research`, `spike` |
| `scout`     | haiku  | fetches sources for one sub-question and saves raw notes                                            | `research`, `spike`        |
| `scribe`    | sonnet | writes and revises wiki pages from raw notes, with the index and taxonomy                           | `research`                 |
| `clerk`     | sonnet | checks pages or an answer against their citations; report-only                                      | `research`, `ask`          |

- A skill that dispatches an agent says what to do when no subagent is available: do that job itself, in the same order.

## The project contract

A skill knows nothing about a project until it reads the project's own files, and treats them as ground truth. `bootstrap` writes them with the user; every other skill only reads them.

| File              | What the skills read from it                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `docs/BOARD.md`   | how the tracker is reached, each operation's binding, the card types, statuses and which moves are the user's            |
| `docs/templates/` | one template per card type: tracker fields in frontmatter, the description layout, the bar before writing, the checklist |
| `docs/GIT.md`     | how each delivery's work is isolated, branches, commits, pushes, PRs and restrictions                                    |
| `TESTING.md`      | the checks, how to run the app per workspace, how each kind of change is validated and proven, and review                |
| `library/`        | the persistent store of research and knowledge, by the conventions in `library/_meta/librarian.md`                       |

- The plugin carries no project rules and no card templates. The one default it keeps is work isolation: with no `docs/GIT.md`, a delivery works in a worktree of its own at `.worktrees/<branch>`.
- A missing file the skill can't do without, such as a card template for `shape`, is reported with a pointer to `bootstrap`.
- Because the rules live in the project's files, an eval's scaffold can declare its own: the smoke cases and the SWE-bench setup have deliveries work on a branch in the checkout, without a worktree.

## Source of truth

- The code is the only source of truth for how a project behaves now. Cards, findings and library pages record intent or what was known when written, so every skill reads the code it touches when it starts.
- A card holds why and what, never how: no code locations, and no description of how the code works now.

## Tooling

- Repo tooling is TypeScript run directly by Node 26, under `scripts/`, with static tests in `test/`. The `Makefile` is the entry point; `make help` lists the targets.
- `make lint` runs every static check, and the pre-commit hook runs it; `make test` runs the unit tests; `make check` runs both and `npx skills` discovery, as CI does.
- Two evals call models and run only when the user asks: `make smoke`, the cases under `plugins/<plugin>/evals/` through `claude plugin eval`, and `make eval`, the SWE-bench Pro comparison in `scripts/swepro/`. `TESTING.md` says how each is used.
