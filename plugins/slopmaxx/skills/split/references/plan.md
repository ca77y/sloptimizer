# Planning the parts

Cut the ticket into the fewest parts that together cover all of it. Every requirement, fact and citation in the ticket lands in some part or in the list of what was left out.

## Each part

- **Its own outcome:** what a user or the system can do once it ships, stated as what is wanted, never how to build it.
- **A vertical slice:** a narrow path through every layer the outcome needs, so it can be demoed or checked once merged. A layer on its own (all the schema, then all the API) is a slice of the build, not of the outcome.
- **One PR:** small enough for one PR and one fresh context window.
- **Checkable on its own:** deliverable and checkable without another part's code merged first, unless the work makes an order unavoidable.
- **A key and its blockers:** a short key, unique in the plan, and the keys of the parts that must merge before it can start. A part with no blockers can start at once.

## Order

- **Prefactors first, when they stand apart.** A change to the existing code that makes the rest easy is its own part only when two or more parts need it and it changes nothing a user sees: its outcome is that the existing behaviour holds, its criteria check exactly that, and the parts it helps are blocked by it. Every new behaviour, such as a help listing or a new error, belongs to the part whose outcome needs it. A prefactor that only one part needs, or that can't land without new behaviour, goes into the first part that needs it.
- **Wide refactors run expand, migrate, contract.** One mechanical change that breaks callers across the codebase (a rename, a retyped shared symbol) can't land as one green slice. Expand: add the new form beside the old. Migrate: move callers over in batches sized by their reach, each a part blocked by the expand. Contract: remove the old form, blocked by every batch.
- **Blockers are real gates.** A part is blocked only by work it can't start without. Wanting one to land first is a priority, not a blocker.

## The set

- **Constraints that hold for every part** are listed once with the plan and copied into every card.
- **Left out, with a reason:** a part an existing card already holds (name the card), or a part the ticket rules out. A part that waits on a decision only the user can make still gets its card, with the decision under its Open questions.
- **No overlap:** no two parts deliver the same outcome, and no part repeats an existing card.

## Checklist

- Every requirement in the ticket is covered by a part, or is left out with its reason.
- Each part has one outcome, stated as behaviour a user or the system shows, with no implementation in it.
- Each part is a vertical slice that can be checked once merged, and fits one PR.
- Each blocker is a true gate; no blocker cycle; prefactors and expands come before the parts they enable.
- A prefactor part is needed by two or more parts and its criteria only check that existing behaviour holds.
- No two parts overlap, and no part duplicates an existing card.
- Constraints that hold for the whole set are named once and reach every card.
- Nothing extra: no part that could merge into another and still be one PR, and no part or behaviour the ticket doesn't ask for.
