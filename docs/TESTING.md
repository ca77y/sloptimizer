# Testing

How a change in this repo is checked, validated, proven and reviewed.

## Checks

Each must exit 0 before a PR is ready. `make check` runs them all; CI runs `make lint` and `make test`, and the
pre-commit hook runs `make lint`.

- Format: Prettier, in `make lint`; `make format` rewrites files.
- Lint: `make lint`: markdownlint, ESLint, knip, jscpd, pinned dev tools, and `claude plugin validate --strict`, which fails on a warning.
- Typecheck: `make typecheck`, also in `make lint`.
- Tests: `make test`, or `node --test <file>` for one file.

Tests live in `test/`. They call no model and no network service; they use fixtures.

## Running the app

There is no app. The plugins run through two evals, which call models through the Claude Code login of whoever runs
them. They run only when the user asks, never in CI.

- Smoke: `make smoke`. Runs every case under `eval/smoke/` through `claude plugin eval`: each starts one skill the
  way a user does, in a small project of its own, and runs it to the end. `CASE=<glob>` runs some cases, `MODEL=<model>`
  another model, `RUNS=<n>` more than one run per case. Results and the HTML report go to `.eval/smoke/`.
- Full: `make install-eval` once, then `make eval`, hours, with Docker. Runs SWE-bench Pro tasks through the plugin
  and through plain Claude Code, as [`eval/swepro/README.md`](../eval/swepro/README.md) says. `make eval-grader`
  checks its grader. Reports go to `.eval/runs/`, each compared with the newest release under `eval/results/`.
  `make eval-release` keeps a run there as the report for the plugin's version.

## Validating a change

- Scripts, tests and tooling: validate by `make check`; proof: its output and the names of the tests that prove it.
- Skill, agent or reference text: validate by `make check`, then `make smoke` when the user asks; proof: each case's
  pass or fail and its report.
- Cost, accuracy or quality across versions: validate by `make eval` when the user asks; proof: the run's
  `report.md`, with its comparison against the release before.
- Attaching proof: inline in the PR description.

A criterion no kind covers, or one that couldn't be checked, is listed under **Not done** in the PR.

## Smoke cases

- Smoke covers every skill; the full eval covers the skills whose work hidden tests can grade: `deliver`, `bugfix`
  and `shape`.
- A case is a folder `eval/smoke/<skill>/` holding `case.yaml`, `prompt.md`, `scaffold.sh`, `graders/` and, when the
  skill needs a card to start from, `seed/`.
- `prompt.md` starts the skill as a user does, `/slopmaxx:<skill> …`, and lets it run to the end.
- Every case runs in the same project, `eval/smoke/project/`: a small calculator with a board and a forge that are
  folders (`.board/`, `.forge/`), so a run reaches no real tracker or forge. `fixture.sh` builds it, adds the
  plugin's own library templates and the case's `seed/`, and commits it as one commit on `main`.
- Graders judge what the skill produced: the card, the pull request file, the code, the answer. A grader checks that
  an agent was dispatched only where its independence is the point. No grader can run a command, so "the feature
  works" is judged by reading the file.
- An `llm` grader states its PASS and FAIL conditions, and is judged by `opus`: the default small judge fails
  correct answers on their format.

## Review

- Who reviews: the `gslop:agy-review` skill before the PR opens, in the delivery's worktree, with its findings judged and
  fixed; then Claude Code Review (`.github/workflows/claude-code-review.yml`) on every PR; then the user, who merges.
- How a review is requested and its findings read: the steps under Pull request in `docs/GIT.md`.
- What a review checks: the change does what was asked, `make check` passes, and every rule a project using the
  plugin must follow is in the plugin.
- Ready for review when: `make check` passes and every criterion has its proof or is listed under Not done.

## Blind spots

- `bootstrap` has no smoke case: it works through its files with the user.
- `agy-review` has no smoke case: `claude plugin eval` runs shell commands in a sandbox that can't read the home folder or open a local port, and `agy` needs both to sign in and start.
- Smoke cases never reach a real tracker or forge, and no grader runs the code a skill wrote.
- Smoke runs once on one model unless asked otherwise, without a run of plain Claude Code to compare with.
