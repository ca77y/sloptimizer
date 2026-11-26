# Testing

How a change in this project is checked, validated, proven and reviewed.

## Checks

Each must exit 0 before a PR is ready.

- Format: <command, or "none">
- Lint: <command, or "none">
- Typecheck: <command, or "none">
- Tests: <command>

## Running the app

- Setup: <env file and test account, by where they come from; seed data>.
- Start: <command>, ready when <URL and port, simulator, or output line>.
- Running in parallel: <how each workspace gets its own port, database and simulator, so several can run the app at once>.

## Validating a change

How each kind of change is shown to work in the running app, and the proof that goes into the PR description. Repeat a line per kind.

- <Kind, for example UI>: validate by <the steps or flow>; proof: <for example, a screenshot of each criterion's end state, a Playwright trace, a response body, a log excerpt>.
- Attaching proof: <how proof reaches the PR description, for example images uploaded to the PR, a trace linked from a CI artifact, or text inline>.

A criterion no kind covers, or one that couldn't be checked, is listed under **Not done** in the PR.

## Review

- Who reviews: <for example, an independent QA agent before the PR is ready, then a person on the PR>.
- What a review checks: <for example, every criterion met with its proof, tests that would catch a regression, nothing changed outside the card, the project's coding standards>.
- Ready for review when: <for example, checks pass, and every criterion has its proof or is listed under Not done>.

## Blind spots

<What these checks can't see, or "none".>
