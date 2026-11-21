---
name: shape
description: Turns an idea, request, bug report or open question into a well-formed card on the project's board — a story, bug or spike — and files it. Use when the user asks to shape, write, file, draft or refine a card, issue or ticket, or to run shape again on a card whose open questions have been answered.
---

# Shape

A card says why and what; the how belongs to whoever delivers it. Your output is the card on the board. The project's `docs/BOARD.md` says how the board is reached and what you may write to it; read it first. Without one, show the draft in chat instead of filing.

## Pick the type

The user names it; otherwise it is a story. A **bug** is behaviour that fails as a user meets it. A **spike** is a question that must be answered before anything can be built. A named card keeps its type. Read `references/<type>.md` for the template and the bar the card must clear. A format `docs/BOARD.md` declares for the type wins over the template.

## Know before you write

Learn enough to say whether this card should exist and what it relates to:

- the board, for cards that duplicate, overlap or must come before or after it;
- the project library (`library/_meta/index.md`), for research on the topic;
- docs and code, to learn whether the product already does this.

For a named card, read it with its comments and apply the answers they give to its open questions.

When a card already holds the same outcome for the same people, return that card and stop. A partial overlap becomes a relation.

## Write it

- Settle anything that leaves what the card delivers, and for whom, unchanged, and state it under Assumptions so a reader can object. Anything that would change the outcome goes under Open questions, and the card is filed with them.
- Describe behaviour as users see it; the code moves while the card waits.
- Keep only sentences that earn their place.

## Review

Have the draft reviewed by someone who didn't write it: the `reviewer` agent when available, or any subagent you can spawn. Brief it with the draft, the checklist from the type's reference, and the project root, and keep your reasoning out of the brief. With no subagent, set the draft aside and re-read it cold against the checklist.

Fix what holds up, preferring a cut to an addition. What can't be settled becomes an open question. One round.

## File it

Create or update the card through the bindings in `docs/BOARD.md`: the status it gives new cards, the labels it requires, and a relation to each card it overlaps or depends on. Leave the transitions it reserves for the user to the user.

Report the card's link, its assumptions and its open questions. Open questions are answered on the card, and shape then runs on it again.
