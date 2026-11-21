# sloptimizer

One repo, two installers:

- a **Claude Code plugin marketplace** called `sloptimizer`
- a **skills repo** for [`npx skills`](https://github.com/vercel-labs/skills), usable from Claude Code, Cursor, Codex, and the rest

## Install

### Claude Code (plugin marketplace)

```sh
/plugin marketplace add ca77y/sloptimizer
/plugin install more-slop@sloptimizer
```

Or from the shell:

```sh
claude plugin marketplace add ca77y/sloptimizer
claude plugin install more-slop@sloptimizer
```

### npx skills (any agent)

```sh
# Everything in the repo
npx skills add ca77y/sloptimizer

# One plugin only: point at its folder
npx skills add https://github.com/ca77y/sloptimizer/tree/master/plugins/more-slop

# One skill only
npx skills add ca77y/sloptimizer --skill shape

# See what's available
npx skills add ca77y/sloptimizer --list
```

## Layout

```
.claude-plugin/marketplace.json      # marketplace "sloptimizer", lists every plugin
plugins/
  more-slop/
    .claude-plugin/plugin.json       # plugin manifest
    skills/
      <skill-name>/SKILL.md          # one folder per skill
docs/                                # architecture, design, git, board, specs
library/                             # research wiki (Obsidian-compatible)
```

`npx skills` reads `.claude-plugin/marketplace.json` and scans each plugin's
`skills/` folder, so there's nothing extra to keep in sync.

## Adding things

**A skill:** create `plugins/<plugin>/skills/<skill-name>/SKILL.md` with
`name` (must match the folder) and `description` in the frontmatter.

**A plugin:**
1. Create `plugins/<plugin>/.claude-plugin/plugin.json` and `plugins/<plugin>/skills/`.
2. Add an entry to `.claude-plugin/marketplace.json` with `"source": "./plugins/<plugin>"`.

Skill names must be unique across the whole repo, because `npx skills`
installs them into one flat folder.

## Validate

```sh
./scripts/validate.sh
```

This runs `claude plugin validate` on the marketplace and every plugin,
then `npx skills add . --list`. CI runs the same script.
