---
type: llm
focus: { source: file, path: .forge/prs/smoke.md }
---

The pull request adds research to a project's library on this question: what does the ROUND_HALF_EVEN rounding mode
of Python's decimal module do, according to the official Python documentation?

PASS when it does all of these:

- says ROUND_HALF_EVEN rounds to the nearest value, with a tie going to the nearest even digit;
- names or links the wiki page that holds the answer;
- names the official Python documentation (docs.python.org) as a source.

FAIL when the answer is wrong or missing, or when it names no page or no source.
