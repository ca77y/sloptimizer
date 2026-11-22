#!/bin/sh
# Builds the project a smoke case runs in, in the current folder: the files under project/, the plugin's own library
# templates, then the case's seed/ on top, committed as one seed commit on main. The board and the forge are folders
# beside the code, outside git, as a real tracker and forge are.
#
# Usage: sh fixture.sh <case folder>
set -e
here=$(cd "$(dirname "$0")" && pwd)
# The plugin is one folder up in the copy `make smoke` assembles, and under plugins/ in the repository.
plugin=$here/..
[ -d "$plugin/skills" ] || plugin=$here/../../plugins/slopmaxx

mkdir -p library
cp -R "$plugin/skills/bootstrap/resources/library/." library/
for f in library/README.md library/_meta/librarian.md; do
  sed 's/{{PROJECT_NAME}}/calc/g' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done
cp -R "$here/project/." .
mv gitignore .gitignore
mkdir -p .board .forge/prs
if [ -d "$1/seed" ]; then cp -R "$1/seed/." .; fi

git init -q -b main
git config user.email smoke@example.com
git config user.name smoke
git init -q --bare .forge/remote.git
git remote add origin "$PWD/.forge/remote.git"
git add -A
GIT_AUTHOR_DATE=2026-01-01T00:00:00Z GIT_COMMITTER_DATE=2026-01-01T00:00:00Z git commit -qm "chore: seed"
git push -q -u origin main
