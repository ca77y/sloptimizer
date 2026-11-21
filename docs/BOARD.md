# Board declaration

Configuration does not authorize execution; the user's request does. An operation not bound here has no grant.

## Board

- Tracker, project, and team: Linear, project `Sloptimizer` in team `Smerfy` (`SMR`), <https://linear.app/ca77y/project/sloptimizer-cedec3bac3ac>. `SMR` is shared with other projects, so every search and create scopes by `project: "Sloptimizer"`.
- Access, without credentials: the Linear MCP server, authenticated as the user.

## Operations

- Locate, read, search: `get_issue` by identifier (`SMR-412`) or URL, with `includeRelations: true` when dependencies matter; `list_comments` for its discussion; `list_issues` with `project: "Sloptimizer"` plus `query` (title and description), `state`, `label` or `priority`.
- Create, with initial status: `save_issue` with `team: "Smerfy"`, `project: "Sloptimizer"`, `state: "Backlog"`, `labels: [<Type>]`, `title`, `description`, and `priority`.
- Transition: `save_issue` with the issue `id` and `state`.
- Update content and relations: `save_issue` with the issue `id` and `patch` (or `description`), `addLabels` / `removeLabels`, `blockedBy` / `blocks` / `removeBlockedBy` / `removeBlocks`. Never `labels`, which replaces the whole set.
- Attach a PR: `save_issue` with the issue `id` and `links: [{url: <PR URL>, title: <PR title>}]`.
- Comment: `save_comment` with the issue `id` and a Markdown `body`.

## Cards

- Identity and naming: the identifier names everything that belongs to the card: the spec `docs/specs/<lowercase identifier>-<slug>/`, the spike findings `docs/spikes/<lowercase identifier>-<slug>.md`, and the branch (`docs/GIT.md`).
- Type and priority: exactly one type label: `Feature` or `Improvement` for a story, `Bug` for a bug, `Spike` for a spike, `Research` for open-ended research that is split into stories before any spec or branch. Priority `1` Urgent · `2` High · `3` Medium · `4` Low; priority and blocking relations are the only delivery order, with no milestones or phases.
- Dependencies: `blockedBy` / `blocks` relations. No sub-issues: one card is one issue is one PR.
- Story format: the Linear title is the Title; the body follows `docs/_templates/story.md` with no `#` heading and empty optional sections dropped: the opening paragraph is the Summary, then `## Why`, `## Scope`, `## Out of scope`, `## Acceptance criteria` (one observable pass/fail behaviour per bullet), `## Assumptions`, `## Open questions`, `## References`.
- Bug format: the Linear title is the Title, stating the failure as a user meets it; the body holds `## Observed`, `## Expected`, `## Steps`, `## Assumptions`, `## Open questions`, `## References`, with no `#` heading and empty optional sections dropped.
- Spike format: the Linear title is the Title, the question short; the body holds `## Question`, `## What counts as an answer`, `## Conditions`, `## Assumptions`, `## Open questions`, `## References`, with no `#` heading and empty optional sections dropped.

Linear rewrites `-` bullets to `*` and wraps bare URLs in `<…>` on save; that is cosmetic.

## Statuses

- Statuses: `Backlog` · `Todo` · `In Progress` · `In Review` · `Done` · `Canceled` · `Duplicate`. A status lives only in Linear, never in the repo or a commit.
- User-owned decisions: `Backlog` → `Todo` (the card is refined and ready), `In Review` → `Done` (the work is verified), and any move to `Canceled` or `Duplicate`. Agents never make these transitions.

## Other conditions

- Filing a card: only when the user asks for one; it is created at `Backlog`.
- Editing card content: a stale relation, a wrong label, or an answered open question may be fixed on the card. Anything that could change the card's goal is reported instead of edited.
- Comments: progress, hazards, and the handoff summary go on the card as comments.

Never rewrite an acceptance criterion to match an implementation.
