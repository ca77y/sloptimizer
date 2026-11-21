# Story

A change in behaviour, small enough for one PR.

## Template

No `#` heading; the card title is the title. Drop empty optional sections.

```markdown
<One paragraph: what changes, and for whom.>

## Why
<Who benefits and the evidence they need it. Drop if the summary already says it.>

## Scope
<What the change covers, as behaviour.>

## Out of scope
<What a reader would assume is included but isn't, and where it goes instead.>

## Acceptance criteria
- <One observable pass/fail behaviour per bullet.>

## Assumptions
## Open questions
## References
<Docs, library pages, upstream docs, related cards — as links.>
```

## Before writing

- **Worth it:** the evidence shows who needs this. An existing feature, a setting, or not building it doesn't already cover the outcome.
- **Smallest scope:** every part of the scope is needed for the outcome. Parts that deliver value on their own are separate cards; parts that can wait go to Out of scope.

## Checklist

- Every required section is there, and nothing outside the template is.
- Each criterion names one outcome visible from outside the implementation and passes or fails with nothing in between. When the project has a `TESTING.md`, a category it declares can check it.
- No criterion is an unmeasured quality ("fast", "robust"), restates the goal, or depends on internal structure.
- At most 20 criteria. More means more than one PR: keep the core and move the rest to Out of scope.
- No implementation: no algorithms, libraries, internal modules, file layout or build steps. Names users see — commands, flags, endpoints, public functions — are fine.
- No code locations and no description of how the code works now.
- Nothing extra: no duplicate criteria, no assumption that only records how the card was reasoned out, no qualifier no stated risk needs.
