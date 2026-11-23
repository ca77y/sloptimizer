---
type: llm
focus: { source: file, path: .board/STORY-2.md }
---

The card was split from a larger ticket that asked for three things in calc.py: unit conversions, a saved history,
and an HTTP service.

PASS when the card does all of these:

- delivers one outcome a user can check on its own, not the whole ticket; a card that only prepares the code for the
  others counts when it adds no new behaviour and its criteria check only that the existing behaviour holds;
- says why the work matters, so a reader who never saw the ticket understands it;
- has acceptance criteria that are behaviours seen from outside the code;
- says nothing about how to write the code.

FAIL when any is missing, or when a section still holds the template's placeholder text in angle brackets.
