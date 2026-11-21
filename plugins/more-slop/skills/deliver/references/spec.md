# Spec

The plan for one delivery and where it stands, in one file in the scratch folder, never committed. Write it before the first test, keep it current as the work moves, and read it first when a session restarts. Keep it at the level of behaviour, structure and decisions; the code holds the details.

## Template

```markdown
# <card id>: <card title>

Card: <link> · Branch: <branch> · Status: <planning | building | validating | in review | done>

## Approach

<A few sentences: the shape of the change, which parts of the product it touches and how they fit together, and why this way.>

## Decisions

- <A choice the card left open: the option taken, the one that lost, and why.>

## Criteria

- [ ] <Each acceptance criterion as the card words it>: proven by <the test, and the validation `TESTING.md` gives its kind>.

## Slices

- [ ] <One vertical slice, in build order: the behaviour it adds.>

## Progress

- <date> <What was done, what comes next, anything blocking.>

## Open

- <Risks, unknowns, and questions still standing.>
```

## Keeping it current

- Tick a slice when its tests pass and it is committed; tick a criterion only once its proof exists.
- Add a Progress line at each commit and before a session ends; the newest line says what comes next.
- When a decision changes, rewrite it under Decisions and record why under Progress.
- Every entry under Decisions goes under **Needs you** in the PR, and every unticked criterion under **Not done**.
