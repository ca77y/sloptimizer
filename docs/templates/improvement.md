---
type: Improvement
label: Improvement
summary: A change to how something users already have behaves, small enough for one PR.
priority: 3
---

# Improvement

## Template

The Linear title is the card's title: the change, as an action. The description holds:

```markdown
<One paragraph: what changes, and for whom.>

## Today

<How it behaves for users now, as they meet it.>

## Why

<What is wrong with today's behaviour, and the evidence: reports, numbers, friction.>

## Scope

<What the change covers, as behaviour.>

## Acceptance criteria

- <One observable pass/fail behaviour per bullet, different from Today.>
```

## Before writing

- Worth it: evidence shows today's behaviour costs users something, and nothing already covers the change.
- An improvement, not a bug: today's behaviour works as built. Behaviour that fails is a Bug.
- Smallest scope: every part is needed for the change; parts that deliver value alone are their own cards.

## Checklist

- Every section is there, and nothing outside the template is.
- Today describes behaviour users meet, never how the code works.
- Each criterion names one outcome visible from outside the code, differs from Today, passes or fails with nothing in between, and a `TESTING.md` kind can check it.
- No implementation and no code locations; names users see (commands, flags, public functions) are fine.
- Nothing extra.
