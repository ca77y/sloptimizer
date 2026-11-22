---
type: llm
focus: { source: file, path: .board/STORY-1.md }
---

PASS when the card does all of these:

- says in its opening paragraph what changes for users of calc.py: they can divide one number by another;
- has an "Acceptance criteria" section with at least two bullets, each a behaviour seen from the command line, such
  as a command and what it prints;
- deals with dividing by zero: as a criterion, an assumption or an open question;
- says nothing about how to write the code.

FAIL when any is missing, or when a section still holds the template's placeholder text in angle brackets.
