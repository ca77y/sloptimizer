---
type: llm
focus: { source: file, path: .board/STORY-1.md }
---

PASS when the card does all of these:

- no longer lists what dividing by zero does as an open question;
- has an acceptance criterion that `python3 calc.py divide 1 0` prints `error: division by zero` and exits with status 1;
- still has its two criteria for `divide 12 4` and `divide 1 4`.

FAIL when any is missing.
