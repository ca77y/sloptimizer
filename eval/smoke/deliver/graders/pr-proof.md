---
type: llm
focus: { source: file, path: .forge/prs/smoke.md }
---

The pull request delivers a card with three acceptance criteria: `python3 calc.py multiply 3 4` prints 12,
`python3 calc.py multiply -2 5` prints -10, and `python3 calc.py multiply 2.5 2` prints 5.

PASS when its "Why trust it" part shows, for each of the three criteria, the command that was run and the output it
gave, and says the tests pass.

FAIL when a criterion has no command and output, or when the part only asserts that the change works.
