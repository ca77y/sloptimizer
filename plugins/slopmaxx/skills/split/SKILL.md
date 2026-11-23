---
name: split
description: Splits one ticket, card or larger request into the fewest small, independent story cards, each one PR, with the order between them, and files them on the project's board. Use when the user asks for a split, or when the shape skill finds a request holds more than one outcome.
---

# Split

One ticket goes in; several small cards come out, each a story that one PR delivers, together covering everything the ticket asks for. Your output is those cards on the board. The project's `docs/BOARD.md` says how the board is reached, what you may write to it, and which types of card it has; read it first. Carry the work through to the filed cards in one go: work through an ordinary obstacle, such as a failing tool call, file a choice only the user can make as an open question and carry on, and stop early only when you can't go on without the user.

## Know the ticket

The user names a card, or gives the request in chat. Read a named card with its comments and relations. Then learn enough to cut it well:

- the board, for cards that already hold part of it, including cards an earlier split of this ticket filed;
- the project library (`library/_meta/index.md`), for research on the topic;
- docs and code, to learn what the product already does and where a prefactor would make the rest easy.

When the ticket is already small enough for one PR, it is one part: a card stands as it is, and a request from chat becomes one card.

## Plan the parts

Read `references/plan.md` for how to cut and the bar the plan must clear. In short: the fewest parts; each a vertical slice with its own outcome, checkable on its own; blocked only by the parts that truly gate it; prefactors first. A part an existing card already holds gets no card; name that card instead.

## Review

Have the plan reviewed by someone who didn't write it: the `reviewer` agent. Brief it with the ticket, the plan, the checklist from `references/plan.md`, and the project root, and keep your reasoning out of the brief. Fix what holds up, preferring a merge or a cut to a new part. One round.

## Write the cards

Write each part as a story card, of the type `docs/BOARD.md` declares that fits it, such as a feature or an improvement, by that type's template. Give every card the constraints that hold for the whole set, each written as behaviour a user or caller sees, the way its acceptance criteria are; how the code or its tests are written is left to whoever delivers the card. Each card stands on its own: a reader who never saw the ticket learns from it why the work matters. Anything that would change a part's outcome goes under its Open questions.

## File them

Create the cards through the bindings in `docs/BOARD.md`, blockers first, so each dependent card can name the cards that block it. Use the status it gives new cards, the label from each card's template frontmatter, its priority as the template sets it (the frontmatter default, adjusted by any rule the template gives), and its blocking relation for each blocker; relate each card to the source ticket where the board binds a relation for that. When a relation has no binding, list it on the card under References instead.

Leave the source ticket as it is, except for a comment that lists the cards it was split into. Closing it, or moving it to any status, is the user's call.

Report the cards as a numbered list in dependency order: link, title, what it delivers, and what blocks it. Then the parts left out with their reasons, and the open questions. The user reviews the cards and comes back with fixes; apply them to the cards already filed. A card with open questions goes to `shape` once they are answered.
