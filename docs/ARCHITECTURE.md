# Architecture

How the repo and its plugins are built. The principles they are designed against are in [`DESIGN.md`](DESIGN.md), and the rules that always apply are in the root `AGENTS.md`. When a change alters a decision below, update it here in the same change.

## Distribution

- The repo is the `sloptimizer` Claude Code marketplace, listed in `.claude-plugin/marketplace.json`. The plugins are written for Claude Code and installed only through it, so a skill can rely on its plugin's agents and on Claude Code's own features.
- Each plugin is a folder under `plugins/` with its manifest in `.claude-plugin/plugin.json`, its skills in `skills/`, and its agents in `agents/`. It ships no eval cases; those live in `eval/`.
- `slopmaxx` takes work from an idea to a pull request. `gslop` holds `agy-review` on its own, so a project installs the Antigravity dependency only when it wants that review.

## Skills and agents

- A skill is an entry point: `skills/<name>/SKILL.md`, with `name` equal to the folder and a `description` that says when to use it. Its `references/` hold what only the skill needs, such as `split`'s plan bar or `deliver`'s spec template, and `resources/` hold files it copies into a project, such as `bootstrap`'s templates for project files.
- The user starts a skill, by typing its name: each sets `disable-model-invocation`, because a skill writes to the board, the repo or the forge and the user decides when that happens. Two can also be started by the model. `split` is one, so `shape` can hand it a request that holds more than one outcome and the result is cards either way, never a note telling the user what to run. `agy-review`, in `gslop`, is the other for now, so a delivery can run it before its PR opens.
- A skill may name another skill for the user to run next, as `split` names `shape`. No agent holds the `Skill` or `Agent` tool, so an agent starts neither.
- `agy-review`, the only skill in `gslop`, is the one skill that reaches outside Claude Code: it runs Google's Antigravity CLI, `agy`, headless, so the review comes from a different tool and model. It is a skill, not an agent, because `agy` is already the independent reviewer and judging its findings needs the main session's context. It needs `agy` installed and signed in on the user's machine, and reports when it isn't.
- The main session does the work. An agent exists only where independence or a clean context is the point, and each skill decides when to dispatch it:

| Agent       | Model  | Does                                                                                                                       | Dispatched by              |
| ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `qa`        | opus   | reproduces a bug from the report alone, or checks a change against its card; writes only under `qa/` in the scratch folder | `deliver`, `bugfix`        |
| `reviewer`  | sonnet | reviews a draft card, plan or document against a checklist; report-only                                                    | `shape`, `split`, `spike`  |
| `librarian` | sonnet | answers from the existing library; read-only                                                                               | `ask`, `research`, `spike` |
| `scout`     | sonnet | fetches sources for one sub-question and saves raw notes                                                                   | `research`, `spike`        |
| `scribe`    | sonnet | writes and revises wiki pages from raw notes, with the index and taxonomy                                                  | `research`                 |
| `clerk`     | sonnet | checks pages or an answer against their citations; report-only                                                             | `research`, `ask`, `spike` |

- Every agent but `scout` lists the tools it has. `scout` names the ones it lacks instead (the shell, edits, other agents and skills), so it can search and fetch with whatever web tools the session has, such as an MCP server's where the built-in ones are denied. That also gives it the session's other MCP tools.

## The project contract

A skill knows nothing about a project until it reads the project's own files, and treats them as ground truth. `bootstrap` writes them with the user; every other skill only reads them.

| File              | What the skills read from it                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `docs/BOARD.md`   | how the tracker is reached, each operation's binding, the card types, statuses and which moves are the user's            |
| `docs/templates/` | one template per card type: tracker fields in frontmatter, the description layout, the bar before writing, the checklist |
| `docs/GIT.md`     | how each delivery's work is isolated, branches, commits, pushes, PRs and restrictions                                    |
| `docs/TESTING.md` | the checks, how to run the app per workspace, how each kind of change is validated and proven, and review                |
| `library/`        | the persistent store of research and knowledge, by the conventions in `library/_meta/librarian.md`                       |

- The plugin carries no project rules, no card templates and no defaults of its own. Every skill but `bootstrap` runs in a project `bootstrap` has set up, and takes these files as given.
- Because the rules live in the project's files, an eval's scaffold can declare its own: the smoke cases and the SWE-bench setup have deliveries work on a branch in the checkout, without a worktree.

## Source of truth

- The code is the only source of truth for how a project behaves now. Cards, findings and library pages record intent or what was known when written, so every skill reads the code it touches when it starts.
- A card holds why and what, never how: no code locations, and no description of how the code works now.

## Tooling

- Repo tooling is TypeScript run directly by Node 26, under `scripts/` and `eval/`, with static tests in `test/`. The `Makefile` is the entry point; `make help` lists the targets.
- `make lint` runs every static check, and the pre-commit hook runs it; `make test` runs the unit tests; `make check` runs both, as CI does.
- Two evals call models and run only when the user asks. `make smoke` runs the cases under `eval/smoke/` through `claude plugin eval`, one per skill, each to the end in a small project of its own; because that command reads cases from inside a plugin, the target copies the plugin and the cases into a temporary folder first. `make eval` runs the SWE-bench Pro comparison in `eval/swepro/`, and each report compares itself with the one released for the version before, kept under `eval/results/`. `docs/TESTING.md` says how each is used.
