# Docs

```text
docs/
|-- ARCHITECTURE.md   # How the repo and its plugins are built
|-- AUDIT.md          # How the slopmaxx plugin follows BEST_PRACTICES.md, rule by rule
|-- BEST_PRACTICES.md # What Anthropic and the community say about plugins, skills and subagents
|-- DESIGN.md         # Principles skills, agents and references are designed against
|-- GIT.md            # Branches, worktrees, commits, PRs, workspace and scratch folder
|-- BOARD.md          # How work is tracked (Linear)
|-- spikes/           # Spike findings, one per answered question
`-- templates/        # Card templates, one per card type
```

- Docs explain a rule; the skill, agent or reference under `plugins/` enforces it.
- Update a doc in the same change that alters what it describes.
