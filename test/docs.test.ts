// This repo's own project files, as the skills read them.

import assert from "node:assert/strict";
import { test } from "node:test";

import { exists, frontmatter, read, text } from "./repo.ts";

const templates = read("docs/BOARD.md")
  .matchAll(/`(docs\/templates\/[\w-]+\.md)`/g)
  .map((m) => m[1] ?? "")
  .toArray();

test("every card template docs/BOARD.md names exists, with its type, label and summary in frontmatter", () => {
  assert.ok(templates.length > 0, "docs/BOARD.md names its templates");
  for (const path of templates) {
    assert.ok(exists(path), path);
    const { front, body } = frontmatter(read(path));
    for (const key of ["type", "label", "summary"]) assert.ok(text(front, key), `${path}: ${key}`);
    assert.match(body, /```markdown\n[\s\S]+?\n```/, `${path}: a fenced block for the description`);
  }
});
