---
type: llm
focus: { source: file, path: .forge/prs/smoke.md }
---

The pull request fixes a bug: `python3 calc.py subtract 5 3` printed -2 where 2 was expected.

PASS when its "Why trust it" part shows the reproduction failing before the fix and passing after it, each with
the command and its output.

FAIL when either the before or the after is missing, or when the part only asserts that the bug is fixed.
