# Board

How this project's board is reached and what may be written to it. An operation not bound here isn't allowed.

## Board

- Tracker, project and team: <tracker, project, team, and a link>. <How every search and create is scoped, when the team is shared.>
- Access: <the connected tool or CLI, authenticated as whom>. Never a credential.

## Operations

- Find, read, search: <how a card is read by id or URL, with its comments and relations; how cards are searched>.
- Create: <the call and the fields every new card gets: team, project, initial status, type label, title, body, priority; how blocking and related relations are added at creation>.
- Update: <how the body, labels and relations change, without replacing the whole label set>.
- Move: <how a card's status changes>.
- Comment: <how a comment is added>.
- Link a PR: <how a PR is attached to its card, or "automatic" when the forge links it>.

## Cards

- Identity: <what the card id names: branches, spike findings `docs/spikes/<id>-<slug>.md`>.
- Types: <the label for a story (feature or improvement), a bug, a spike>. Priority: <the scale>.
- Dependencies: <blocking relations, or "none" when the tracker has none>.
- Story layout: the tracker's title is the title; the body opens with one summary paragraph, then `## Why`, `## Scope`, `## Out of scope`, `## Acceptance criteria`, `## Assumptions`, `## Open questions`, `## References`, empty optional sections dropped.
- Bug layout: the title states the failure as a user meets it; the body holds `## Observed`, `## Expected`, `## Steps`, `## Assumptions`, `## Open questions`, `## References`.
- Spike layout: the title is the question, short; the body holds `## Question`, `## What counts as an answer`, `## Conditions`, `## Assumptions`, `## Open questions`, `## References`.

## Statuses

- Statuses: <in order>.
- Moves agents make: <for example, to In Progress when work starts and to In Review when the PR opens>.
- Moves that belong to the user: <for example, ready for work, done, canceled, duplicate>.

## Other conditions

- Filing a card: <when an agent may create one>.
- Editing a card: an answered open question, a stale relation or a wrong label may be fixed; anything that changes the card's goal is reported instead.
