---
title: Rounding halves
type: wiki
summary: Python's round() sends halves to the even neighbour; calc.py's average follows it.
tags: [python, rounding]
confidence: high
status: active
---

# Rounding halves

Python's built-in `round()` rounds a value exactly halfway between two integers to the even one, so 2.5 becomes 2 and 3.5 becomes 4. calc.py's `average` rounds with the built-in, so it follows the same rule.

## Claims

- `round()` sends a value exactly halfway to the even choice. [[raw/2026-01-01-python-round#^e1]]

## Conflicts and gaps

- Nothing here covers rounding halves up, or the `decimal` module.

## Related
