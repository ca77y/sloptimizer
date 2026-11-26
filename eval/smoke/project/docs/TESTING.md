# Testing

How a change in this project is checked, validated, proven and reviewed.

## Checks

Each must exit 0 before a PR is ready.

- Format: none
- Lint: none
- Typecheck: none
- Tests: `python3 -m unittest`

## Running the app

- Setup: none; the project uses only Python's standard library.
- Start: `python3 calc.py <command> <numbers>`, for example `python3 calc.py add 2 3`. It prints the result and exits.
- Running in parallel: each run is its own process, with no port, database or shared state.

## Validating a change

- Command line: validate by running the command for each criterion; proof: the command and its output, inline in the PR description.
- Library and findings documents: validate by opening each citation; proof: the citations, inline in the PR description.
- Attaching proof: inline in the PR description.

A criterion no kind covers, or one that couldn't be checked, is listed under **Not done** in the PR.

## Review

- Who reviews: an independent `qa` agent before a code PR opens; nobody after it.
- What a review checks: every criterion met with its proof, a test that would fail without the change, nothing changed outside the card.
- Ready for review when: the tests pass, and every criterion has its proof or is listed under Not done.

## Blind spots

None.
