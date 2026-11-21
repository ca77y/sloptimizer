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
declare -A seen
for f in plugins/*/skills/*/SKILL.md; do
  dir=$(basename "$(dirname "$f")")
  name=$(sed -n 's/^name:[[:space:]]*//p' "$f" | head -1 | tr -d '"'\''')
  if [[ "$name" != "$dir" ]]; then
    echo "  $f: name '$name' != folder '$dir'"; fail=1
  fi
  if [[ -n "${seen[$name]:-}" ]]; then
    echo "  duplicate skill name '$name': ${seen[$name]} and $f"; fail=1
  fi
  seen[$name]=$f
done
[[ $fail -eq 0 ]] || exit 1

echo "==> npx skills discovery"
npx -y skills@latest add . --list
