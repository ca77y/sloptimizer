#!/bin/sh
# Builds the throwaway project this case runs in: a git repository on main, with the project files the skill reads.
set -e
git init -q -b main
git config user.email eval@example.com
git config user.name eval
cat > calc.py <<'PY'
def add(a, b):
    return a + b
PY
cat > test_calc.py <<'PY'
import unittest
from calc import add


class AddTest(unittest.TestCase):
    def test_small(self):
        self.assertEqual(add(2, 2), 4)


if __name__ == "__main__":
    unittest.main()
PY
cat > TESTING.md <<'MD'
# Testing

## Checks

- Tests: `python3 -m unittest`
MD
printf '/.tmp/\n' > .gitignore
git add -A
git commit -q -m "chore: seed"
