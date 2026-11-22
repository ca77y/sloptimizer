---
type: llm
focus: { source: file, path: .forge/prs/smoke.md }
---

The pull request delivers the findings of a spike that asked: does Python's built-in round() turn 2.5 into 2 or 3,
and can calc.py's average round halves up using only the standard library?

PASS when it does all of these:

- says round(2.5) gives 2, because a half goes to the even neighbour;
- says the standard library can round halves up, naming at least one way, such as the decimal module's
  ROUND_HALF_UP or math.floor(x + 0.5);
- backs the answer with evidence: a command and its output, or a cited source.

FAIL when it says round(2.5) gives 3, when either half of the question goes unanswered, or when it gives no
evidence.
