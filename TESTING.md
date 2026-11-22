# Testing

How a change in this repo is checked, validated, proven and reviewed.

## Checks

Each must exit 0 before a PR is ready. `make check` runs them all; CI runs `make lint`, `make discovery` and
`make test`, and the pre-commit hook runs `make lint`.

- Format: Prettier, in `make lint`; `make format` rewrites files.
- Lint: `make lint`: markdownlint, ESLint, knip, jscpd, pinned dev tools, and `claude plugin validate`; then
  `make discovery` for `npx skills`.
- Typecheck: `make typecheck`, also in `make lint`.
- Tests: `make test`, or `node --test <file>` for one file.

Tests live in `test/`. They call no model and no network service; they use fixtures.

## Running the app

There is no app. The plugins run through two evals, which call models through the Claude Code login of whoever runs
them. They run only when the user asks, never in CI.

- Smoke: `make smoke`, about ten minutes. Runs every case tagged `smoke` under `plugins/<plugin>/evals/`. Its
  terminal output is the result; it keeps no report.
- Full: `make install-eval` once, then `make eval`, hours, with Docker. Runs SWE-bench Pro tasks through the plugin
  and through plain Claude Code, as [`scripts/swepro/README.md`](scripts/swepro/README.md) says. `make eval-grader`
  checks its grader. Reports go to `.eval/runs/`.

## Validating a change

- Scripts, tests and tooling: validate by `make check`; proof: its output and the names of the tests that prove it.
- Skill, agent or reference text: validate by `make check`, then `make smoke` when the user asks; proof: each case's
  pass or fail and its report.
- Cost, accuracy or quality across runs: validate by `make eval` when the user asks; proof: the run's `report.md`.
- Attaching proof: inline in the PR description.

A criterion no kind covers, or one that couldn't be checked, is listed under **Not done** in the PR.

## Eval cases

- A case is a folder `plugins/<plugin>/evals/<name>/` holding `case.yaml`, `prompt.md`, `scaffold.sh` and
  `graders/`, with `name` equal to the folder name.
- Every skill a model can start has a smoke case.
- `prompt.md` asks for the skill by name, `Use the more-slop:<skill> skill to …`, is tagged `smoke`, and sets
  `timeout_seconds` to at most 600.
- `scaffold.sh` builds a git repository on `main` with everything the skill reads, and reaches no real tracker or
  forge. Its `docs/GIT.md` has a delivery work on the branch `smoke` in the checkout.
- One grader checks that the skill fired; the others check milestones reached within ten minutes. No file grader
  passes on the scaffold alone.

## Review

- Who reviews: Claude Code Review (`.github/workflows/claude-code-review.yml`) on every PR, then the user, who merges.
- How a review is requested and its findings read: opening the PR fires it; after each later push, re-fire it with a PR comment whose whole body is `@review`. Findings arrive as a PR comment from `claude[bot]` and as line comments.
- What a review checks: the change does what was asked, `make check` passes, and every rule a project using the
  plugin must follow is in the plugin.
- Ready for review when: `make check` passes and every criterion has its proof or is listed under Not done.

## Blind spots

- `bootstrap` has no smoke case.
- Smoke cases never reach a real tracker or forge, and stop at the first milestones.
