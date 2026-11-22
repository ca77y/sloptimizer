---
type: regex
# main's reflog holds one line per update, and the fixture's seed commit is the only one: a second means main moved.
target: { source: file, path: .git/logs/refs/heads/main }
pattern: "[0-9a-f]{40} [0-9a-f]{40} "
match: "count:1"
---
