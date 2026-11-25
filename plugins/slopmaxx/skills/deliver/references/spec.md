# Spec

The plan for one delivery and where it stands, in one file in the scratch folder, never committed. Write it before the first test, keep it current as the work moves, and read it first when a session restarts. Keep it at the level of behaviour, structure and decisions; the code holds the details.

## Template

```markdown
# <card id>: <card title>

Card: <link> · Branch: <branch> · Status: <planning | building | validating | in review | done>

## Approach

<A few sentences: the shape of the change, the parts of the product it touches and how they fit, and why this way.>

Out of scope: <what a reader might expect here but this delivery leaves out.>

## Decisions

- <A choice the card left open: the option taken, the one that lost, and why.>
- ~~<A superseded choice>~~ → <what replaced it, and why>.

## Criteria

- [ ] <Each acceptance criterion as the card words it>: proven by <the test or check, per `docs/TESTING.md`>.

## Slices

- [ ] <One vertical slice, in build order: the behaviour it adds, and the criteria it proves.>

## Now

<Where the work stands, the next step, and anything blocking.>

## Open

- <Risks, unknowns and questions, written as questions rather than guesses.>
```

## Keeping it current

- On restart, read this file, then the branch's git log, then run the tests before new work.
- Build one slice at a time. Tick it when its tests pass and it's committed, then rewrite Now.
- Every criterion starts unticked. Tick it only after you've seen its proof. If a criterion is wrong, raise it under Open; its wording stays as the card gives it.
- When a decision changes, strike the old one through and add the new one with the reason.
- Name behaviour and parts of the product; leave code, file lists and schemas to the code. Keep it to a page or two.
- At the end, every entry under Decisions goes under **Needs you** in the PR, and every unticked criterion under **Not done**.
