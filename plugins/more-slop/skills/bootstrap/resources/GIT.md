# Git

How work moves through git and the forge in this project.

## Repository

- Remote and forge: <for example, GitHub `owner/repo`, reached through `gh`>.
- Default branch: <name>. Work outside a delivery happens here, in the root checkout, committed only when the user asks.

## Workspace

Every delivery runs in a worktree of its own, branched from the latest default branch, so deliveries run in parallel.

- Branch name: <pattern, for example `<card id lowercased>-<slug>`>.
- Worktree path: <pattern, for example `.worktrees/<branch>` in the root checkout, ignored by git>.
- Removing a worktree: <when, for example after its PR merges; by whom>.
- Preparing a fresh worktree: <the commands run from its root, for example the dependency install and copying the env file, or "none">.
- Spike prototypes: <local branch and worktree pattern, never pushed and deleted when done, or "none">.

## Commits and push

- Commit convention: <for example, Conventional Commits, naming the card id>.
- Commit hooks: <what they run>. A failing test is committed before its fix, so hooks don't run the unit tests.
- Before each push: <for example, merge the default branch into the story branch>.

## Pull request

- Opening: <the command; target branch; ready or draft>.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.
- Required checks: <names, or "none">.

## Restrictions

- <What agents never do without the user asking: for example, merge, force-push, rewrite pushed history, tag, release, delete remote branches.>
