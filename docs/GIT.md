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

- Opening: `gh pr create --repo ca77y/sloptimizer --base master --head <branch> --title <title> --body-file <file>`, adding `--draft` for a draft; `gh pr ready <number>` marks it ready. Update the body with `gh pr edit <number> --body-file <file>`; read it with `gh pr view <number> --json title,body,url,comments,reviews` and `gh pr diff <number>`; comment with `gh pr comment <number> --body <text>`.
- Title: an imperative sentence naming the outcome.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.
- Required checks: the `Check` workflow's `lint` and `test` jobs.

## Restrictions

Agents never do these unless the user asks:

- Commit to or push `master`.
- Merge a PR, enable auto-merge, or close one.
- Force-push, amend or rebase pushed history, or delete a branch, tag or remote ref, apart from the cleanup after a merge.
- Remove a worktree, apart from the cleanup after a merge.
- Cut a release or tag, add a remote, or touch another repository.
