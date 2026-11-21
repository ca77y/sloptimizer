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
- Types: one line per type of card: its name and its template `docs/templates/<type>.md`, whose frontmatter gives the type's label, summary and default priority, and whose body gives the card's layout, the bar before writing it, and its checklist. <for example: Feature, `docs/templates/feature.md`>. A request names its type; otherwise it is <the default type>.
- Priority: <the scale>.
- Dependencies: <blocking relations, or "none" when the tracker has none>.
- Layout: the tracker's title is the card's title; the description is the template's fenced block, filled, with empty optional sections dropped. The frontmatter goes into tracker fields, never into the description.

## Statuses

- Statuses: <in order>.
- Moves agents make: <for example, to In Progress when work starts and to In Review when the PR opens>.
- Moves that belong to the user: <for example, ready for work, done, canceled, duplicate>.

## Other conditions

- Filing a card: <when an agent may create one>.
- Editing a card: an answered open question, a stale relation or a wrong label may be fixed; anything that changes the card's goal is reported instead.
