# Git

How work moves through git and the forge in this project.

## Repository

- Remote and forge: `origin`, the local bare repository `.forge/remote.git`. The forge is local too: a pull request is a Markdown file under `.forge/prs/`.
- Default branch: `main`.

## Workspace

Nothing else runs in this checkout, so a delivery works in it directly.

- Branch name: `smoke`, from `main`.
- Where the work happens: this checkout, on the branch, switched to with `git switch -c smoke main`; no worktree.
- Preparing it: none.
- Removing it: `git switch main` and `git branch -D smoke`, only for a branch that was never pushed.
- Scratch folder: `.tmp/` in the checkout, ignored by git.
- Spike prototypes: under `.tmp/spike/`, never committed.

## Commits and push

- Commit convention: Conventional Commits, `feat`, `fix`, `docs`, `test` or `chore`.
- Commit hooks: none.
- Before each push: `git merge --no-edit main`. Push with `git push -u origin smoke`.

## Pull request

- Opening and review, step by step: write `.forge/prs/smoke.md`: a `# <title>` heading, a `Draft: no` line, a `Card: <id>` line when there is a card, then the description. No review is requested; the PR file is the end of the run.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.
- Required checks: none.

## Restrictions

Agents never do these:

- Commit to `main`, merge into it or push it.
- Force-push or rewrite pushed history.
