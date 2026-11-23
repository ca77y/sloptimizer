# sloptimizer

A **Claude Code plugin marketplace** called `sloptimizer`. Its plugins are written for Claude Code and installed
through it.

## Install

```sh
/plugin marketplace add ca77y/sloptimizer
/plugin install slopmaxx@sloptimizer
/plugin install gslop@sloptimizer   # optional: the agy (Gemini) branch review
```

Or from the shell:

```sh
claude plugin marketplace add ca77y/sloptimizer
claude plugin install slopmaxx@sloptimizer
claude plugin install gslop@sloptimizer
```

## Layout

```text
.claude-plugin/marketplace.json      # marketplace "sloptimizer", lists every plugin
plugins/
  slopmaxx/
    .claude-plugin/plugin.json       # plugin manifest
    skills/
      <skill-name>/SKILL.md          # one folder per skill
    agents/<agent-name>.md           # one file per agent
  gslop/                             # the agy-review skill
eval/
  smoke/                             # one smoke case per skill, and the project they run in
  swepro/                            # the SWE-bench Pro comparison
  results/                           # the eval report released for each plugin version
docs/                                # architecture, design, git, board, card templates, spikes
library/                             # research wiki (Obsidian-compatible)
```

## Adding things

**A skill:** create `plugins/<plugin>/skills/<skill-name>/SKILL.md` with
`name` (must match the folder) and `description` in the frontmatter.

**A plugin:**

1. Create `plugins/<plugin>/.claude-plugin/plugin.json` and `plugins/<plugin>/skills/`.
2. Add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<plugin>"`.

## Test

```sh
make install   # once: the dev tools
make check     # what CI runs: plugin validation, typecheck, static tests
make smoke     # every skill run to the end in a small project; calls models
make eval      # the full SWE-bench Pro eval, hours; calls models and runs Docker
```

`TESTING.md` says what each level covers and how to add an eval case.
