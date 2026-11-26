# Sloptimizer

Claude Code plugins under `plugins/`, listed by the `sloptimizer` marketplace in
`.claude-plugin/`.

- **`plugins/<plugin>/`** — one plugin: its manifest, skills and agents.
- **eval/** — the evals, which call models: `smoke/`, one case per skill, `swepro/`, the SWE-bench Pro comparison, and `results/`, its report for each plugin version.
- **scripts/** — repo tooling, run through the `Makefile`.
- **test/** — static tests.
- **docs/** — architecture, design, git, board, card templates, spikes.
- **library/** — persistent store of research and knowledge; evidence, never implementation authority.

`make help` lists the targets. `make lint` runs every static check and the
pre-commit hook runs it; `make test` runs the unit tests; `make check` is what CI
runs; `make smoke` and `make eval` call models.

## Rules

- Outside a delivery, work on `master` in the root checkout: create no branch or
  worktree, and commit only when the user asks. Only a delivery request creates a
  story branch in its own worktree and ends in a PR.
- Write TypeScript, not JavaScript, wherever the runtime allows it.
- Change a plugin's `version` only when the user asks for that bump. A release
  is that bump committed and pushed to `master`, with no git tag.
- Run a check that calls models only when the user asks. A delivery request
  with a criterion that needs one counts as asking.
- A rule that governs what happens in a project using a plugin must be encoded
  where that project gets it: the skill, agent or reference under `plugins/`.
  `docs/` explains a rule; it never enforces one, because a project using the
  plugin never sees it.
- In skills, agents and references, state the behaviour you want, not what to
  avoid; a prohibition puts the unwanted behaviour in context. Keep a "don't"
  only for a hard guardrail with no positive form, and pair it with the
  target.

## Where to look

Read a file when the task reaches what it covers:

- `docs/GIT.md` — before creating a branch or worktree, committing, pushing or
  opening a PR: naming, isolation, commit convention, PR commands, what agents
  never do in git.
- `docs/BOARD.md` — before reading, filing, updating or moving a Linear card:
  the bindings, card types and which moves belong to the user.
- `docs/templates/<type>.md` — before writing a card of that type: its fields,
  layout and checklist.
- `docs/TESTING.md` — before calling a change done, or when adding an eval case:
  the checks, how each kind of change is validated and proven, and review.
- `docs/ARCHITECTURE.md` — when changing how plugins, skills or agents are built,
  or what they read from a project.
- `docs/DESIGN.md` and `docs/BEST_PRACTICES.md` — before writing or changing a
  skill, agent or reference, and again to check the change before calling it
  done: the principles they are designed against, and the outside rules, by id,
  to check the wording against.
- `library/_meta/librarian.md` — before adding to or answering from the library:
  its conventions.
