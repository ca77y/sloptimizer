---
name: shape
description: Turns an idea, request, bug report or open question into a well-formed card on the project's board, of a type its board declares (a story, bug or spike by default), and files it. Use when the user asks to shape, write, file, draft or refine a card, issue or ticket, or to run shape again on a card whose open questions have been answered.
---

# Shape

A card says why and what; the how belongs to whoever delivers it. Your output is the card on the board. The project's `docs/BOARD.md` says how the board is reached, what you may write to it, and which types of card it has; read it first.

## Pick the type

`docs/BOARD.md` declares the types of card, each with its template, usually in `docs/templates/`. The user names the type; otherwise take the one whose template fits the request, or the default the board names. A named card keeps its type. Read the type's template for the card's layout, the bar before writing it, and its checklist.

When the project has no `docs/BOARD.md`, or no template for the type, report that and point the user to the `bootstrap` skill, which sets them up.

## Know before you write

Learn enough to say whether this card should exist and what it relates to:

- the board, for cards that duplicate, overlap or must come before or after it;
- the project library (`library/_meta/index.md`), for research on the topic;
- docs and code, to learn whether the product already does this.

For a named card, read it with its comments and apply the answers they give to its open questions.

When a card already holds the same outcome for the same people, return that card and stop. A partial overlap becomes a relation.

## Write it

- Settle anything that leaves what the card delivers, and for whom, unchanged, and state it so a reader can object: under Assumptions when the template has that section, in your report otherwise. Anything that would change the outcome is an open question, and the card is filed with them: under Open questions when the template has that section, as a comment on the card otherwise.
- Describe behaviour as users see it; the code moves while the card waits.
- Keep only sentences that earn their place.

## Review

Have the draft reviewed by someone who didn't write it: the `reviewer` agent when available, or any subagent you can spawn. Brief it with the draft, the checklist from the type's template, and the project root, and keep your reasoning out of the brief. With no subagent, set the draft aside and re-read it cold against the checklist.

Fix what holds up, preferring a cut to an addition. What can't be settled becomes an open question. One round.

## File it

Create or update the card through the bindings in `docs/BOARD.md`: the status it gives new cards, the label from the type's template frontmatter, its priority as the template sets it (the frontmatter default, adjusted by any rule the template gives), the template's filled block as the description, and a relation to each card it overlaps or depends on. Leave the transitions it reserves for the user to the user.

Report the card's link, its assumptions and its open questions. Open questions are answered on the card, and shape then runs on it again.
