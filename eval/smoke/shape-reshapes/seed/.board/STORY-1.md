# Divide two numbers

Status: Backlog
Labels: Feature
Priority: Medium

Users of calc.py can divide one number by another from the command line.

## Why

Users already add and subtract with calc.py, and work out quotients by hand.

## Scope

A `divide` command beside `add`, `subtract` and `average`.

## Acceptance criteria

- `python3 calc.py divide 12 4` prints 3.
- `python3 calc.py divide 1 4` prints 0.25.

## Open questions

- What should `python3 calc.py divide 1 0` do?

## Comments

Dividing by zero prints `error: division by zero` and exits with status 1.
