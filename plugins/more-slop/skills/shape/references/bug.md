# Bug

Behaviour that fails as a user meets it. The title states the failure in the user's terms.

## Template

No `#` heading; the card title is the title. Drop empty optional sections.

```markdown
## Observed
<What happens.>

## Expected
<What should happen instead.>

## Steps
1. <From a clean start to the failure.>

## Assumptions
## Open questions
## References
<Error reports, logs, related cards — as links.>
```

## Checklist

- Every required section is there, and nothing outside the template is.
- Observed and Expected describe different behaviour, each specific enough to tell them apart.
- Someone else could follow the Steps and see the failure; unknown steps are named as open questions, not guessed.
- One failure per card.
- No diagnosis or fix, no code locations, no description of how the code works now.
- Nothing extra.
