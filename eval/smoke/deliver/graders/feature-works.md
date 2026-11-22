---
type: llm
focus: { source: file, path: calc.py }
---

PASS when this file makes `python3 calc.py multiply 3 4` print 12: it has a multiply command, reachable from the
command line the same way `add` is, that returns the product of its two numbers.

FAIL when there is no such command, when it is not reachable from the command line, or when it returns anything but
the product.
