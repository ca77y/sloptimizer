---
title: "Python docs: round()"
type: raw
summary: round() rounds a half to the even choice.
tags: [python, rounding]
source: https://docs.python.org/3/library/functions.html#round
accessed: 2026-01-01
published: unknown
---

# Python docs: round()

Source: <https://docs.python.org/3/library/functions.html#round>, accessed 2026-01-01. Version or date it applies to: Python 3.

## Summary

The built-in `round()` rounds to the nearest multiple, and sends a value exactly halfway to the even choice.

## Key evidence

- Values are rounded to the closest multiple of 10 to the power minus ndigits; if two multiples are equally close, rounding is done toward the even choice, so `round(0.5)` and `round(-0.5)` are 0 and `round(1.5)` is 2. ^e1

## Limits

Says nothing about the `decimal` module's rounding modes.
