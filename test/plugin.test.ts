// The structure of each plugin as it ships: its skills and agents are named after their files, everything they name
// exists, and nothing is left unused. What a skill or agent says is judged by running it, never here.

import assert from "node:assert/strict";
import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, test } from "node:test";

import { agents, exists, frontmatter, list, plugins, read, ROOT, skills, text } from "./repo.ts";

/** The skills Claude Code itself ships, which a plugin's skill may name without holding them. */
const BUNDLED_SKILLS = new Set(["simplify"]);

/** Every file below a folder, as paths relative to it. */
const files = (rel: string): string[] =>
  readdirSync(path.join(ROOT, rel), { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile())
    .map((f) => path.relative(path.join(ROOT, rel), path.join(f.parentPath, f.name)));

/** The paths under `references/` or `resources/` that a text names, in prose or inside a command. */
const namedPaths = (md: string): string[] =>
  md
    .matchAll(/\b((?:references|resources)\/[\w./-]*\w)/g)
    .map((m) => m[1] ?? "")
    .toArray();

/** The names a text gives in backticks just before a word, as in "the `qa` agent". */
const namedBefore = (md: string, word: string): string[] =>
  md
    .matchAll(new RegExp(String.raw`\`([a-z][a-z-]*)\` ${word}\b`, "g"))
    .map((m) => m[1] ?? "")
    .toArray();

/** The `name` a skill or agent file gives in its frontmatter. */
const nameIn = (md: string): string => text(frontmatter(md).front, "name");

for (const plugin of plugins()) {
  const root = `plugins/${plugin}`;
  const skillNames = skills(plugin);
  const agentNames = agents(plugin);
  const skillFile = (s: string): string => read(`${root}/skills/${s}/SKILL.md`);
  const agentFile = (a: string): string => read(`${root}/agents/${a}.md`);

  describe(`${plugin}'s skills and agents`, () => {
    test("each is named after its folder or file", () => {
      assert.ok(skillNames.length > 0);
      for (const s of skillNames) assert.equal(nameIn(skillFile(s)), s, s);
      for (const a of agentNames) assert.equal(nameIn(agentFile(a)), a, a);
    });

    test("every file, skill and agent a skill names exists", () => {
      for (const s of skillNames) {
        const body = skillFile(s);
        for (const rel of namedPaths(body)) assert.ok(exists(`${root}/skills/${s}/${rel}`), `${s} names ${rel}`);
        for (const a of namedBefore(body, "agent")) assert.ok(agentNames.includes(a), `${s} names the agent ${a}`);
        for (const n of namedBefore(body, "skill"))
          assert.ok(skillNames.includes(n) || BUNDLED_SKILLS.has(n), `${s} names the skill ${n}`);
      }
    });

    test("every file in a skill's folder is named by its SKILL.md, alone or through its folder", () => {
      for (const s of skillNames) {
        const named = namedPaths(skillFile(s));
        for (const file of files(`${root}/skills/${s}`)) {
          if (file === "SKILL.md") continue;
          assert.ok(
            named.some((n) => file === n || file.startsWith(`${n}/`)),
            `${s}/${file} is named nowhere in its SKILL.md`,
          );
        }
      }
    });

    test("every agent is named by a skill", () => {
      const all = skillNames.map((s) => skillFile(s)).join("\n");
      for (const a of agentNames) assert.ok(all.includes(`\`${a}\``), `no skill names the agent ${a}`);
    });

    test("each agent names the tools it has or the ones it lacks, never holds Agent or Skill, and runs on a known model tier", () => {
      for (const a of agentNames) {
        const { front } = frontmatter(agentFile(a));
        const named = (key: string): string[] =>
          [...list(front, key), ...text(front, key).split(",")].map((t) => t.trim()).filter(Boolean);
        const tools = named("tools");
        const withheld = named("disallowedTools");
        assert.ok(tools.length > 0 || withheld.length > 0, `${a}: tools or disallowedTools`);
        // A list of tools grants only those; without one, the agent has every tool the session has but the withheld.
        for (const tool of ["Agent", "Skill"]) {
          assert.ok(tools.length > 0 ? !tools.includes(tool) : withheld.includes(tool), `${a} holds ${tool}`);
        }
        assert.match(text(front, "model"), /^(?:fable|opus|sonnet|haiku|inherit)$/, `${a}: model`);
      }
    });
  });
}
