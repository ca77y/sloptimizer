#!/usr/bin/env bash
# Validate the marketplace, every plugin, and npx-skills discovery.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> claude plugin validate (marketplace)"
claude plugin validate .

for p in plugins/*/; do
  echo "==> claude plugin validate ($p)"
  claude plugin validate "$p"
done

echo "==> skill names are unique and match their folders"
fail=0
names=""
for f in plugins/*/skills/*/SKILL.md; do
  dir=$(basename "$(dirname "$f")")
  name=$(sed -n 's/^name:[[:space:]]*//p' "$f" | head -1 | tr -d "\"'")
  if [[ "$name" != "$dir" ]]; then
    echo "  $f: name '$name' != folder '$dir'"; fail=1
  fi
  names+="$name"$'\n'
done
dupes=$(printf '%s' "$names" | sort | uniq -d)
if [[ -n "$dupes" ]]; then
  echo "  duplicate skill names:"; echo "$dupes" | sed 's/^/    /'; fail=1
fi
[[ $fail -eq 0 ]] || exit 1

echo "==> npx skills discovery"
npx -y skills@latest add . --list
