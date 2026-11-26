# Git

How work moves through git and the forge in this project.

## Repository

- Remote and forge: `origin`, GitHub `ca77y/sloptimizer` over SSH, reached through `gh` authenticated as `ca77y`. Push only story branches, only to `origin`.
- Default branch: `master`, unprotected; every PR targets it, and GitHub merges by squash and deletes the remote branch. Work outside a delivery happens on `master` in the root checkout, committed only when the user asks.

## Workspace

Every delivery runs in a worktree of its own, branched from the latest `master`, so deliveries run in parallel.

- Branch name: `<commit type>/<lowercase card id>-<slug>`, for example `feat/smr-412-trigger-evals`; without a card, `<commit type>/<slug>`. The slug is lowercase kebab-case.
- Where the work happens: a worktree at `.worktrees/<branch>` in the root checkout, ignored by git, created with `git fetch origin master` then `git worktree add .worktrees/<branch> -b <branch> origin/master`; for an existing branch, `git worktree add .worktrees/<branch> <branch>`.
- Preparing it: `npm ci` from its root.
- Removing it: whoever merges the PR, right after merging and in the same session: `git worktree remove .worktrees/<branch>` and `git branch -D <branch>`. A request to merge authorizes this.
- Scratch folder: `.tmp/` in each workspace, ignored by git.
- Spike prototypes: a local branch `spike/<slug>` in the worktree `.worktrees/spike/<slug>`, never pushed, deleted when the spike's findings are written.

## Commits and push

- Commit convention: Conventional Commits, `feat`, `fix`, `docs`, `refactor`, `test` or `chore` with an optional `(<area>)`; every commit on a story branch names the card id. Stage explicit paths.
- Commit hooks: `.githooks/pre-commit` runs `make lint`, every static check but the tests, so a failing test can be committed before its fix; `make install` turns it on.
- Before each push: `git fetch origin master` and `git merge --no-edit origin/master`. Push with `git push -u origin <branch>` the first time and `git push` after.

## Pull request

- Opening and review, step by step:
  1. Open the PR ready: `gh pr create --repo ca77y/sloptimizer --base master --head <branch> --title <title> --body-file <file>`. Claude Code Review runs when a PR opens and skips a draft, so what is unfinished goes under **Not done** rather than into draft status.
  2. Opening requests the review. After each later push, request it again with `gh pr comment <number> --body @review`, a comment whose whole body is `@review`.
  3. Watch it with `gh run list --repo ca77y/sloptimizer --workflow claude-code-review.yml --json databaseId,status,conclusion,createdAt,displayTitle --limit 20`: the newest run whose `displayTitle` is the PR title, created after the request, whose `conclusion` isn't `skipped`. It has finished at `status: completed`. Poll every 30 s; allow 5 min to start and 30 min to finish, then report a timeout.
  4. Read what it posted: its PR comment from `claude[bot]` (`gh pr view <number> --json comments`) and its line comments (`gh api repos/ca77y/sloptimizer/pulls/<number>/comments`). The review counts only when that comment shows the code was reviewed; a `success` run whose comment says it skipped the PR is no review, so request it again.
- Update the body with `gh pr edit <number> --body-file <file>`; read it with `gh pr view <number> --json title,body,url,comments,reviews` and `gh pr diff <number>`; comment with `gh pr comment <number> --body <text>`.
- Title: an imperative sentence naming the outcome.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.
- Required checks: the `Check` workflow's `lint` and `test` jobs.

## Restrictions

Agents never do these unless the user asks:

- Commit to or push `master`.
- Merge a PR, enable auto-merge, or close one.
- Force-push, amend or rebase pushed history, or delete a branch, tag or remote ref, apart from the cleanup after a merge.
- Remove a worktree, apart from the cleanup after a merge.
- Cut a release, add a remote, or touch another repository. A release is the plugin's `version` bump committed and pushed to `master`; the repo uses no git tags.
