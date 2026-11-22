// The smoke eval cases under plugins/<plugin>/evals/, checked without running a model: their shape, that every skill a
// model can start has one, and that each scaffold builds its project offline.
//
// The scaffolds run with the sh and git on the developer's or CI's own PATH, as `make test` does.
/* eslint-disable sonarjs/no-os-command-from-path */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { accessSync, constants, existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, test } from "node:test";

import { agents, evalCases, frontmatter, graders, list, plugins, read, ROOT, skills, text } from "./repo.ts";

const GRADER_TYPES = new Set(["file_exists", "regex", "tool_used", "llm"]);
/** A smoke case checks the first milestones only, so it must finish within ten minutes. */
const SMOKE_SECONDS = 600;

/** Whether a relative path, with `*` standing for any run of characters within one segment, exists under a folder. */
function globExists(dir: string, pattern: string): boolean {
  if (!existsSync(dir)) return false;
  const [head = "", ...rest] = pattern.split("/");
  const escaped = head.split("*").map((s) => s.replaceAll(/[.+?^${}()|[\]\\]/g, String.raw`\$&`));
  const re = new RegExp(`^${escaped.join(".*")}$`);
  return readdirSync(dir)
    .filter((f) => re.test(f))
    .some((f) => rest.length === 0 || globExists(path.join(dir, f), rest.join("/")));
}

const scratch: string[] = [];
after(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
});

for (const plugin of plugins()) {
  const cases = evalCases(plugin);
  const caseDir = (c: string): string => `plugins/${plugin}/evals/${c}`;
  const graderFront = (c: string, g: string) => frontmatter(read(`${caseDir(c)}/graders/${g}`)).front;
  const skillGraders = (c: string): string[] =>
    graders(plugin, c)
      .map((g) => graderFront(c, g))
      .filter((f) => text(f, "type") === "tool_used" && text(f, "tool") === "Skill")
      .map((f) => text(f, "input_match"));

  describe(`${plugin}'s eval cases`, () => {
    test("each case's name, prompt, limits and scaffold are in place", () => {
      for (const c of cases) {
        const yaml = read(`${caseDir(c)}/case.yaml`);
        assert.match(yaml, new RegExp(`^name: ${c}$`, "m"), `${c}: case.yaml name`);
        assert.match(yaml, /scaffold_script: scaffold\.sh/, `${c}: case.yaml scaffold`);
        accessSync(path.join(ROOT, caseDir(c), "scaffold.sh"), constants.X_OK);
        const { front, body } = frontmatter(read(`${caseDir(c)}/prompt.md`));
        assert.equal(text(front, "name"), c, `${c}: prompt name`);
        assert.ok(list(front, "tags").includes("smoke"), `${c}: tagged smoke`);
        assert.ok(Number(text(front, "timeout_seconds")) <= SMOKE_SECONDS, `${c}: timeout`);
        assert.ok(list(front, "allowed_tools").includes("Skill"), `${c}: may use the Skill tool`);
        assert.ok(body.trim().length > 0, `${c}: prompt text`);
      }
    });

    test("each case has graders of known types, and a tool_used grader that its skill fired", () => {
      for (const c of cases) {
        const gs = graders(plugin, c);
        assert.ok(gs.length > 0, `${c}: graders`);
        for (const g of gs) {
          const type = text(graderFront(c, g), "type");
          assert.ok(GRADER_TYPES.has(type), `${c}/${g}: type`);
        }
        assert.equal(skillGraders(c).length, 1, `${c}: one skill-fired grader`);
      }
    });

    test("every skill a model can start has a smoke case, and every case names a skill or agent that exists", () => {
      const named = cases.flatMap((c) => skillGraders(c).map((m) => /^slopmaxx:([a-z-]+)$/.exec(m)?.[1] ?? m));
      for (const s of skills(plugin)) {
        const manual = text(
          frontmatter(read(`plugins/${plugin}/skills/${s}/SKILL.md`)).front,
          "disable-model-invocation",
        );
        if (manual === "true") continue;
        assert.ok(named.includes(s), `the ${s} skill has a smoke case`);
      }
      for (const s of named) assert.ok(skills(plugin).includes(s), `the skill ${s} exists`);
      for (const c of cases) {
        for (const g of graders(plugin, c)) {
          const f = graderFront(c, g);
          if (text(f, "tool") !== "Agent") continue;
          const agent = /\(slopmaxx:\)\?([a-z-]+)/.exec(text(f, "input_match"))?.[1] ?? "";
          assert.ok(agents(plugin).includes(agent), `${c}/${g} names the agent ${agent}`);
        }
      }
    });

    test("each scaffold builds a clean repository with one seed commit on main, which no file grader already passes", () => {
      for (const c of cases) {
        const dir = mkdtempSync(path.join(os.tmpdir(), `smoke-${c}-`));
        scratch.push(dir);
        const run = spawnSync("sh", [path.join(ROOT, caseDir(c), "scaffold.sh")], { cwd: dir, encoding: "utf8" });
        assert.equal(run.status, 0, `${c}: scaffold failed: ${run.stderr}`);
        const git = (...args: string[]): string => spawnSync("git", args, { cwd: dir, encoding: "utf8" }).stdout.trim();
        assert.equal(git("branch", "--show-current"), "main", `${c}: on main`);
        assert.equal(git("rev-list", "--count", "HEAD"), "1", `${c}: one seed commit`);
        assert.equal(git("status", "--porcelain"), "", `${c}: clean`);
        for (const g of graders(plugin, c)) {
          const f = graderFront(c, g);
          if (text(f, "type") !== "file_exists") continue;
          assert.ok(!globExists(dir, text(f, "path")), `${c}/${g} passes before the skill runs`);
        }
      }
    });
  });
}

describe("running evals only on request", () => {
  const makefile = read("Makefile");
  const target = (name: string): string =>
    new RegExp(String.raw`^${name}:.*\n(?:\t.*\n?)*`, "m").exec(makefile)?.[0] ?? "";

  test("make check and make test run no model, and make smoke and make eval run the evals", () => {
    for (const name of ["check", "test"]) {
      assert.ok(target(name), name);
      assert.doesNotMatch(target(name), /plugin eval|swepro|\bsmoke\b|\beval\b/, name);
    }
    assert.match(target("smoke"), /claude plugin eval .*--tag smoke/);
    assert.match(target("eval"), /scripts\/swepro\/main\.ts run/);
  });

  test("no CI workflow runs an eval", () => {
    const workflows = readdirSync(path.join(ROOT, ".github/workflows"));
    for (const wf of workflows) {
      assert.doesNotMatch(read(`.github/workflows/${wf}`), /make (?:smoke|eval)|plugin eval|swepro/, wf);
    }
  });
});
