---
name: bugfix-smoke
tags: [smoke]
allowed_tools: [Read, Write, Edit, Bash, Glob, Grep, Agent, Skill]
max_turns: 80
timeout_seconds: 600
runs: 1
---

Use the slopmaxx:bugfix skill to fix this bug: `add` in `calc.py` subtracts instead of adding.
