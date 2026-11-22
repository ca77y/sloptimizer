---
name: agy-review-smoke
tags: [smoke]
allowed_tools: [Read, Write, Edit, Bash, Glob, Grep, Skill]
max_turns: 80
timeout_seconds: 600
runs: 1
---

On a new branch `divide`, add a `divide(a, b)` function to calc.py and commit it. Then, before it is pushed, use the slopmaxx:agy-review skill to review the branch.
