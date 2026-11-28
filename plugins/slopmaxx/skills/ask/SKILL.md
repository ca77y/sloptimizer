---
name: ask
description: Answers a question, comparison or synthesis from the project's existing research library, citing its pages and naming gaps and stale evidence, without new research or writes. Use when asked what the library says about a topic.
---

# Ask

Answer from the project library alone: no new sources, and no writes.

1. Read `library/_meta/librarian.md`, then `library/_meta/index.md`, the wiki pages on the topic, and the raw notes behind them. For a broad question, have the `librarian` agent do the reading.
2. Answer directly. Cite each claim that matters to its page and heading, keep what the library says apart from your own inference, and name conflicts, stale evidence and gaps.
3. When the library can't support a good answer, say so plainly and suggest the `research` skill for the missing part. A search that finds nothing shows what the library lacks, not that the thing doesn't exist.
4. When the user asks for a checked answer, have a `clerk` check the draft against its citations, and give its verdict with the answer.
