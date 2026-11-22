---
name: shape
description: Turns an idea, request, bug report or open question into a well-formed card on the project's board, of a type its board declares (a story, bug or spike by default), and files it.
disable-model-invocation: true
---

# Shape

A card says why and what; the how belongs to whoever delivers it. Your output is the card on the board. The project's `docs/BOARD.md` says how the board is reached, what you may write to it, and which types of card it has; read it first. Carry the work through to the filed card in one go: work through an ordinary obstacle, such as a failing tool call, file a choice only the user can make as an open question and carry on, and stop early only when you can't go on without the user.

## Pick the type

`docs/BOARD.md` declares the types of card, each with its template, usually in `docs/templates/`. The user names the type; otherwise take the one whose template fits the request, or the default the board names. A named card keeps its type. Read the type's template for the card's layout, the bar before writing it, and its checklist.

## Know before you write

Learn enough to say whether this card should exist and what it relates to:

- the board, for cards that duplicate, overlap or must come before or after it;
- the project library (`library/_meta/index.md`), for research on the topic;
- docs and code, to learn whether the product already does this.

For a named card, read it with its comments and apply the answers they give to its open questions.

When a card already holds the same outcome for the same people, return that card and stop. A partial overlap becomes a relation.

When the request holds more than one outcome that could ship on its own, one card is the wrong shape for it: call the Skill tool with `slopmaxx:split` on the request, and the cards the `split` skill files are your output.

## Write it

- Settle anything that leaves what the card delivers, and for whom, unchanged, and state it so a reader can object: under Assumptions when the template has that section, in your report otherwise. Anything that would change the outcome is an open question, and the card is filed with them: under Open questions when the template has that section, as a comment on the card otherwise.
- Describe behaviour as users see it; the code moves while the card waits.
- Keep only sentences that earn their place.

## Review

Have the draft reviewed by someone who didn't write it: the `reviewer` agent. Brief it with the draft, the checklist from the type's template, and the project root, and keep your reasoning out of the brief.

Fix what holds up, preferring a cut to an addition. What can't be settled becomes an open question. One round.

## File it

Create or update the card through the bindings in `docs/BOARD.md`: the status it gives new cards, the label from the type's template frontmatter, its priority as the template sets it (the frontmatter default, adjusted by any rule the template gives), the template's filled block as the description, and a relation to each card it overlaps or depends on. Leave the transitions it reserves for the user to the user.

Report the card's link, its assumptions and its open questions. Open questions are answered on the card, and shape then runs on it again.
