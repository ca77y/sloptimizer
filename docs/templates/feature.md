---
type: Feature
label: Feature
summary: A new capability for users, small enough for one PR.
priority: 3
---

# Feature

## Template

The Linear title is the card's title: the outcome, as an action. The description holds:

```markdown
<One paragraph: what changes, and for whom.>

## Why

<Who benefits, and the evidence they need it.>

## Scope

<What the change covers, as behaviour.>

## Out of scope

<What a reader would assume is included but isn't, and where it goes instead.>

## Acceptance criteria

- <One observable pass/fail behaviour per bullet.>

## Open questions

## References

<Docs, library pages, related cards, as links.>
```

## Before writing

- Worth it: evidence shows who needs it, and nothing already covers the outcome.
- Smallest scope: every part is needed for the outcome; parts that deliver value alone are their own cards.

## Checklist

- Every required section is there, and nothing outside the template is.
- Each criterion names one outcome visible from outside the code, passes or fails with nothing in between, and a `docs/TESTING.md` kind can check it.
- No implementation and no code locations; names users see (commands, flags, public functions) are fine.
- Nothing extra.
