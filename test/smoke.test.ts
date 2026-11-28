// The smoke cases' projects, built without running a model: each case's scaffold makes the same clean repository
// every time, so a run starts from a known state.
//
// The scaffolds run with the sh and git on the developer's or CI's own PATH, as `make test` does.
/* eslint-disable sonarjs/no-os-command-from-path */

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, test } from "node:test";

import { read, ROOT, smokeCases } from "./repo.ts";

const scratch: string[] = [];
after(() => {
  for (const dir of scratch) rmSync(dir, { recursive: true, force: true });
});

/** Builds a case's project in a fresh folder, and returns the folder. */
function build(name: string): string {
  const dir = mkdtempSync(path.join(os.tmpdir(), `smoke-${name}-`));
  scratch.push(dir);
  const run = spawnSync("sh", [path.join(ROOT, "eval/smoke", name, "scaffold.sh")], { cwd: dir, encoding: "utf8" });
  assert.equal(run.status, 0, `${name}: scaffold failed: ${run.stderr}`);
  return dir;
}

const git = (dir: string, ...args: string[]): string =>
  spawnSync("git", args, { cwd: dir, encoding: "utf8" }).stdout.trim();

describe("a smoke case's project", () => {
  test("is a clean repository with one seed commit on main, pushed to its local forge", () => {
    assert.ok(smokeCases().length > 0);
    for (const name of smokeCases()) {
      const dir = build(name);
      assert.equal(git(dir, "branch", "--show-current"), "main", `${name}: on main`);
      assert.equal(git(dir, "rev-list", "--count", "HEAD"), "1", `${name}: one seed commit`);
      assert.equal(git(dir, "status", "--porcelain"), "", `${name}: clean`);
      assert.equal(git(dir, "rev-parse", "origin/main"), git(dir, "rev-parse", "main"), `${name}: pushed`);
      const reflog = readFileSync(path.join(dir, ".git/logs/refs/heads/main"), "utf8").trim().split("\n");
      assert.equal(reflog.length, 1, `${name}: main has moved once`);
    }
  });

  test("is the same commit on every build", () => {
    const [name = ""] = smokeCases();
    assert.equal(git(build(name), "rev-parse", "HEAD"), git(build(name), "rev-parse", "HEAD"));
  });

  test("holds the shared project, the plugin's library templates and the case's own seed", () => {
    const dir = build("deliver");
    for (const rel of ["calc.py", "docs/GIT.md", "library/_meta/librarian.md", ".board/STORY-1.md", ".gitignore"]) {
      assert.ok(existsSync(path.join(dir, rel)), rel);
    }
    assert.doesNotMatch(readFileSync(path.join(dir, "library/_meta/librarian.md"), "utf8"), /\{\{/);
  });
});

describe("a smoke case asked in plain words", () => {
  test("has a grader that checks the model started the skill itself", () => {
    for (const name of smokeCases()) {
      if (/^\/slopmaxx:/m.test(read(`eval/smoke/${name}/prompt.md`))) continue;
      const graders = readdirSync(path.join(ROOT, "eval/smoke", name, "graders"));
      const checked = graders.some((g) => /^tool: Skill$/m.test(read(`eval/smoke/${name}/graders/${g}`)));
      assert.ok(checked, `${name}: no grader checks which skill the model started`);
    }
  });
});
