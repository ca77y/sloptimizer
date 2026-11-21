---
type: Bug
label: Bug
summary: Behaviour that fails as a user meets it.
priority: 2
---

# Bug

## Template

The Linear title is the card's title: the failure, in the user's terms. The description holds:

```markdown
## Observed

<What happens, as the user meets it.>

## Expected

<What should happen instead.>

## Steps to reproduce

1. <From a clean start to the failure.>

## Environment

<Where it happens: version or commit, OS, runtime, browser or device, configuration.>

## Evidence

<The exact error text, log lines or screenshots, quoted or attached as they are.>

## Assumptions

## Open questions

## References

<Related cards, reports and docs, as links.>
```

## Priority

The default is 2. Set it from the impact the card describes: 1 when it blocks users with no way around it, 3 or 4 when it is cosmetic or has an easy way around it.

## Before writing

- One failure: a card that describes two failures is two cards.
- Not a feature: behaviour that works as built but should change is an Improvement.

## Checklist

- Every required section is there, and nothing outside the template is.
- Observed and Expected describe different behaviour, each specific enough to tell them apart.
- Someone else could follow the Steps in the stated Environment and see the failure; unknown steps are open questions, not guesses.
- Evidence is quoted exactly, never paraphrased.
- No diagnosis or fix, no code locations, no description of how the code works now.
- Nothing extra.
