# Sloptimizer

Claude Code plugins under `plugins/`, listed by the `sloptimizer` marketplace in
`.claude-plugin/`; the same repo is a skills source for `npx skills`.

- **plugins/<plugin>/** — one plugin: its manifest and its skills.
- **scripts/** — repo tooling, run through the `Makefile`.
- **docs/** — architecture, design, git, board, specs, spikes.
- **library/** — research wiki; evidence, never implementation authority.

`make help` lists the targets; `make check` is what CI runs.

Outside a delivery, work on `master` in the root checkout: create no branch or
worktree, and commit only when the user asks. Only a delivery request creates a
story branch in its own worktree and ends in a PR.

- Write TypeScript, not JavaScript, wherever the runtime allows it.
- Change a plugin's `version` only when the user asks for that bump.
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

Read before acting:

- **Git, branches, commits, PRs, review** — `docs/GIT.md`.
- **Stories and Linear** — `docs/BOARD.md`.
- **Checking and validating a change** — `TESTING.md`.
- **How the repo is built** — `docs/ARCHITECTURE.md` and `docs/design/`.

## Library

Read `library/_meta/librarian.md` before library work.
