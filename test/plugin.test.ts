// The plugins as they ship: the marketplace that lists them, and the skills and agents they hold.

import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { agents, exists, frontmatter, list, plugins, read, skills, text } from "./repo.ts";

interface Marketplace {
  name: string;
  plugins: { name: string; source: string }[];
}

const marketplace = JSON.parse(read(".claude-plugin/marketplace.json")) as Marketplace;
const manifest = (p: string): { name: string; version: string } =>
  JSON.parse(read(`plugins/${p}/.claude-plugin/plugin.json`)) as { name: string; version: string };

describe("the marketplace", () => {
  test("lists every plugin folder once, by the name its manifest gives", () => {
    const listed = marketplace.plugins.map((p) => p.source.replace(/^\.\//, "").replace(/\/$/, ""));
    assert.deepEqual(
      listed.toSorted((a, b) => a.localeCompare(b, "en")),
      plugins().map((p) => `plugins/${p}`),
    );
    for (const entry of marketplace.plugins) {
      const folder = entry.source.replace(/^\.\/plugins\//, "").replace(/\/$/, "");
      assert.equal(entry.name, manifest(folder).name, entry.source);
    }
  });

  test("gives every plugin a semantic version", () => {
    for (const p of plugins()) assert.match(manifest(p).version, /^\d+\.\d+\.\d+$/, p);
  });
});

for (const plugin of plugins()) {
  const skillNames = skills(plugin);
  const agentNames = agents(plugin);
  const skillText = (s: string): string => read(`plugins/${plugin}/skills/${s}/SKILL.md`);

  describe(`${plugin}'s skills`, () => {
    test("each has a name equal to its folder and a description of at most 1,024 characters", () => {
      assert.ok(skillNames.length > 0);
      for (const s of skillNames) {
        const { front, body } = frontmatter(skillText(s));
        assert.equal(text(front, "name"), s, `${s}: name`);
        const description = text(front, "description");
        assert.ok(description.length > 0 && description.length <= 1024, `${s}: description length`);
        assert.ok(body.trim().length > 0, `${s}: body`);
      }
    });

    test("no two skills share a name across the marketplace", () => {
      const all = plugins().flatMap((p) => skills(p));
      assert.equal(new Set(all).size, all.length);
    });

    test("every file a skill names under references/ or resources/ exists in its folder", () => {
      for (const s of skillNames) {
        for (const [, rel = ""] of skillText(s).matchAll(/`((?:references|resources)\/[^`<>*]+)`/g)) {
          assert.ok(exists(`plugins/${plugin}/skills/${s}/${rel}`), `${s} names ${rel}`);
        }
      }
    });

    test("every agent and skill a skill names exists in the plugin", () => {
      for (const s of skillNames) {
        const body = skillText(s);
        for (const [, name = ""] of body.matchAll(/`([a-z][a-z-]*)` agent/g)) {
          assert.ok(agentNames.includes(name), `${s} names the agent ${name}`);
        }
        for (const [, name = ""] of body.matchAll(/`([a-z][a-z-]*)` skill/g)) {
          assert.ok(skillNames.includes(name), `${s} names the skill ${name}`);
        }
      }
    });

    test("every skill that opens a PR describes it in the four parts, in order", () => {
      // A part opens bold, as `**What changes**` or `**What changes:**`.
      const parts = ["**What changes", "**Needs you", "**Why trust it", "**Not done"];
      const opensPr = skillNames.filter((s) => /open the PR/i.test(skillText(s)));
      assert.ok(opensPr.length > 0);
      for (const s of opensPr) {
        // Read from where the skill introduces the four parts; a part may be named earlier, as where a gap goes.
        const body = skillText(s);
        const from = body.indexOf("four parts");
        assert.ok(from !== -1, `${s} introduces the four parts`);
        const at = parts.map((part) => body.indexOf(part, from));
        for (const [i, part] of parts.entries()) assert.ok((at[i] ?? -1) >= 0, `${s} names ${part}`);
        assert.deepEqual(
          at.toSorted((a, b) => a - b),
          at,
          `${s} names the four parts in order`,
        );
      }
    });
  });

  describe(`${plugin}'s agents`, () => {
    test("each has a name equal to its file, a description, its tools and a model", () => {
      for (const a of agentNames) {
        const { front, body } = frontmatter(read(`plugins/${plugin}/agents/${a}.md`));
        assert.equal(text(front, "name"), a, `${a}: name`);
        assert.ok(text(front, "description").length > 0, `${a}: description`);
        assert.ok(text(front, "tools").length > 0 || list(front, "tools").length > 0, `${a}: tools`);
        assert.match(text(front, "model"), /^(?:opus|sonnet|haiku|inherit)$/, `${a}: model`);
        assert.ok(body.trim().length > 0, `${a}: body`);
      }
    });
  });
}
