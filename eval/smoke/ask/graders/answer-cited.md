---
type: llm
---

PASS when the answer does both of these, in any wording and any format:

- says a value exactly halfway is rounded to the even neighbour, so 2.5 becomes 2;
- names the library page `wiki/rounding.md` (by path or by its title, "Rounding halves") or the raw note
  `raw/2026-01-01-python-round.md` as where that comes from.

FAIL when either is missing, or when the answer says 2.5 becomes 3.
