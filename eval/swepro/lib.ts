// The pure half of the SWE-bench Pro comparison: which tasks run, what each arm is given, how the task repository is
// set up for the skills, how an arm is graded, and how the report reads. main.ts does the I/O.

/** How a task goes through the plugin: a story card, a bug report, or a change small enough to hand over as text. */
type Kind = "story" | "bugfix" | "trivial";
export const PLUGIN = "slopmaxx";
/**
 * An arm of the comparison: `plain` Claude Code, `slopmaxx` as the working tree has it, or `slopmaxx@<git ref>`, the
 * plugin as that commit or tag has it.
 */
// eslint-disable-next-line sonarjs/redundant-type-aliases -- the name says which strings are meant
export type Arm = string;
const ARMS: readonly Arm[] = [PLUGIN, "plain"];
/** The git ref a `slopmaxx@<ref>` arm takes the plugin from, or undefined for the other arms. */
export const refOf = (arm: Arm): string | undefined => new RegExp(`^${PLUGIN}@(.+)$`).exec(arm)?.[1];
/** Whether an arm runs the plugin, at any version. Results are compared across reports by this, not by arm name. */
const role = (arm: Arm): "plugin" | "plain" => (arm === "plain" ? "plain" : "plugin");

export interface Task {
  id: string;
  kind: Kind;
  /** A story whose card shape writes from the problem statement and interface, before deliver runs on it. */
  shape: boolean;
  size: string;
  note: string;
}

export interface TaskList {
  harness: { repository: string; commit: string };
  dataset: { name: string; config: string; split: string };
  tasks: Task[];
}

/** The dataset fields the harness reads. The row also holds the reference and test patches, which no arm sees. */
export interface Row {
  instance_id: string;
  repo: string;
  problem_statement: string;
  requirements: string;
  interface: string;
  docker_image: string;
}

/** The model of both arms' main session unless a run names another; the plugin's agents use the models they name. */
export const DEFAULT_MODEL = "claude-opus-5-5";
/** Every lookup tool is off in both arms, so neither can find the upstream fix. */
const DISALLOWED_TOOLS = ["WebFetch", "WebSearch"];
/** The files the harness adds to the task repository; they never reach a graded patch. */
export const SETUP_FILES = ["TESTING.md", "docs/BOARD.md", "docs/GIT.md", "docs/templates/feature.md"];
/** Git-excluded paths the harness and the skills keep in the task repository. */
export const EXCLUDED = [".swepro/", ".board/", ".forge/", ".tmp/", ".worktrees/"];
export const BRANCH = "swepro";
export const ONE_RUN =
  "Each figure comes from one run of each task and arm, so the results are directional, not proof.";
const SEVERAL_RUNS = "A task and arm with several runs has one row per run below, and its mean in the comparison.";
/** The stub forge has no reviewer, so no review round after the PR opens is run or costed. */
const NO_REVIEW =
  "The local forge runs no review after the PR opens, so review rounds a real forge would trigger are neither run nor costed.";

/** A short, readable key for a task: its repository and the first seven characters of its commit. */
export function taskKey(id: string): string {
  const m = /^instance_[^_]+__([^-]+(?:-[a-z]+)*)-([0-9a-f]{7})/.exec(id);
  return m ? `${m[1] ?? ""}-${m[2] ?? ""}` : id;
}

/**
 * The tasks a run covers. Each term names a kind (`story`, `bugfix`, `trivial`), `shape` for the shape → story tasks,
 * or any part of an instance id; no terms means every task. A term that names nothing is an error, so a typo never
 * silently runs the wrong set.
 */
export function selectTasks(tasks: readonly Task[], terms: readonly string[]): Task[] {
  const words = terms.map((t) => t.trim()).filter(Boolean);
  if (words.length === 0) return [...tasks];
  const matches = (t: Task, w: string): boolean => w === t.kind || (w === "shape" && t.shape) || t.id.includes(w);
  const unknown = words.filter((w) => tasks.every((t) => !matches(t, w)));
  if (unknown.length > 0) throw new Error(`no task matches: ${unknown.join(", ")}`);
  return tasks.filter((t) => words.some((w) => matches(t, w)));
}

export function selectArms(terms: readonly string[]): Arm[] {
  const words = terms.map((t) => t.trim()).filter(Boolean);
  if (words.length === 0) return [...ARMS];
  const unknown = words.filter((w) => !ARMS.includes(w) && refOf(w) === undefined);
  if (unknown.length > 0) {
    throw new Error(`unknown arm: ${unknown.join(", ")}; the arms are ${ARMS.join(", ")} and ${PLUGIN}@<git ref>`);
  }
  return [...ARMS.filter((a) => words.includes(a)), ...words.filter((w) => refOf(w) !== undefined)];
}

const section = (heading: string, body: string): string => `## ${heading}\n\n${body.trim()}`;

/**
 * The task text an arm is given: the problem statement, then the requirements, then the interface. A shape → story
 * task withholds the requirements, so shape and the delivery decide them.
 */
export function workItem(row: Row, opts: { requirements: boolean }): string {
  return [
    row.problem_statement.trim(),
    ...(opts.requirements ? [section("Requirements", row.requirements)] : []),
    section("New Interfaces", row.interface || "None."),
  ].join("\n\n");
}

/** The problem statement's own title, without its heading marks or a `Title:` label. */
const cleanTitle = (l: string): string =>
  l
    .replace(/^#+\s*/, "")
    .replaceAll("**", "")
    .replace(/^(?:title|summary)\s*:?\s*/i, "")
    .trim();

export function titleOf(problem: string): string {
  const line = problem
    .split("\n")
    .map((l) => cleanTitle(l))
    .find(Boolean);
  return (line ?? "Untitled task").slice(0, 120);
}

/** The story card deliver runs on, in the local board's layout. */
export function storyCard(row: Row): string {
  return [
    `# ${titleOf(row.problem_statement)}`,
    "Status: Todo\nLabels: Feature",
    "Implement the change the problem statement below asks for.",
    section("Why", row.problem_statement),
    section("Scope", `The change above, with these new interfaces:\n\n${row.interface || "None."}`),
    section("Acceptance criteria", row.requirements),
    "",
  ].join("\n\n");
}

/** What each Claude Code invocation of a task and arm is told, in order. A shape → story task has two phases. */
export interface Phase {
  name: string;
  prompt: string;
}

export function phases(task: Task, row: Row, arm: Arm, storyId = "STORY-1"): Phase[] {
  const text = workItem(row, { requirements: !task.shape });
  if (arm === "plain") return [{ name: "plain", prompt: `${text}\n\nTESTING.md says how to run code and the checks.` }];
  if (task.kind === "bugfix") return [{ name: "bugfix", prompt: `/${PLUGIN}:bugfix ${text}` }];
  if (task.kind === "trivial") return [{ name: "deliver", prompt: `/${PLUGIN}:deliver ${text}` }];
  const story = { name: "deliver", prompt: `/${PLUGIN}:deliver ${storyId}` };
  return task.shape ? [{ name: "shape", prompt: `/${PLUGIN}:shape ${text}` }, story] : [story];
}

/** Claude Code variables a run keeps from the caller: its login, provider, and config folder. */
const KEPT_CLAUDE_VARS = /^(?:CLAUDE_CONFIG_DIR|CLAUDE_CODE_OAUTH_TOKEN|CLAUDE_CODE_USE_\w+)$/;

/**
 * The environment of one invocation. A caller that is itself a Claude Code session would otherwise hand down its
 * session, effort, and agent settings, so every other CLAUDE variable is dropped. A headless session waits for the
 * background work it started, and its Bash tool runs in bash, so a run behaves the same on every machine.
 */
export function childEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const kept = Object.entries(env).filter(([k]) => !k.startsWith("CLAUDE") || KEPT_CLAUDE_VARS.test(k));
  return { ...Object.fromEntries(kept), CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS: "0", SHELL: "/bin/bash" };
}

/** The command line flags of one invocation; the plugin arm adds the plugin, and nothing else differs. */
export function claudeArgs(
  arm: Arm,
  opts: { prompt: string; sessionId: string; pluginDir: string; model: string },
): string[] {
  return [
    "-p",
    opts.prompt,
    "--session-id",
    opts.sessionId,
    "--output-format",
    "stream-json",
    "--verbose",
    // Only the project's settings: the user's own plugins, hooks, and MCP servers stay out of both arms.
    "--setting-sources",
    "project,local",
    "--strict-mcp-config",
    "--dangerously-skip-permissions",
    "--disallowedTools",
    DISALLOWED_TOOLS.join(","),
    "--model",
    opts.model,
    ...(arm === "plain" ? [] : ["--plugin-dir", opts.pluginDir]),
  ];
}

/** How each repository's code runs inside its task container. Generic per repository, so it reveals no hidden test. */
const CHECKS: Record<string, string> = {
  "ansible/ansible": "- Tests: `.swepro/run 'PYTHONPATH=/app pytest test/units/<path> -v'`",
  "internetarchive/openlibrary":
    "- Tests: `.swepro/run 'PYTHONPATH=/app OL_CONFIG=/app/conf/openlibrary.yml pytest <path> -v'`",
  "qutebrowser/qutebrowser":
    "- Tests: `.swepro/run 'QT_QPA_PLATFORM=offscreen PYTEST_QT_API=pyqt5 python -m pytest -p no:xvfb <path> -v'`",
  "flipt-io/flipt": "- Build: `.swepro/run 'go build ./...'`\n- Tests: `.swepro/run 'go test ./<package>/...'`",
  "future-architect/vuls": "- Build: `.swepro/run 'go build ./...'`\n- Tests: `.swepro/run 'go test ./<package>/...'`",
  "gravitational/teleport":
    "- Build: `.swepro/run 'go build ./tool/tsh/...'`\n- Tests: `.swepro/run 'go test ./<package>'`",
  "element-hq/element-web":
    "- Tests: `.swepro/run 'npx jest <test file>'`\n- Typecheck: `.swepro/run 'npx tsc --noEmit'`",
  "protonmail/webclients":
    "- Tests, from the package or application that holds the file: `.swepro/run 'cd packages/<name> && yarn test <test file>'` or `.swepro/run 'cd applications/<name> && yarn test <test file>'`",
};

function checksOf(repo: string): string {
  const checks = CHECKS[repo];
  if (checks === undefined) throw new Error(`no checks declared for ${repo}`);
  return checks;
}

/** The project setup the skills read: how to run the code, a local Markdown board, and a local stub forge. */
export function setupFiles(row: Row): Record<string, string> {
  return {
    "TESTING.md": `# Testing

How a change in this project is checked, validated, proven and reviewed.

## Checks

The code's toolchain and dependencies exist only inside the task container. Run every command there through
\`.swepro/run '<command>'\` from the repository root: it runs the command in the container, in the same directory.
Running the code or its tests directly on this machine doesn't work.

${checksOf(row.repo)}

## Running the app

${row.repo} is validated through its tests; there is no app to start.

## Validating a change

- Code: validate by running the tests that cover the change through \`.swepro/run\`; proof: the command and its output, inline in the PR description.

A criterion no kind covers, or one that couldn't be checked, is listed under **Not done** in the PR.

## Review

- Who reviews: an independent QA agent before the PR opens; no person.
- What a review checks: every criterion met with its proof, and tests that would catch a regression.
- How a review is requested and its findings read: the QA agent reports back directly.
- Ready for review when: the tests that cover the change pass, and every criterion has its proof or is listed under Not done.

## Blind spots

None.
`,
    "docs/BOARD.md": `# Board

How this project's board is reached and what may be written to it. An operation not bound here isn't allowed.

## Board

- Tracker, project and team: local Markdown cards, one file per card under \`.board/\` in this checkout. There is no team.
- Access: read and write the files directly.

## Operations

- Find, read, search: read \`.board/<id>.md\`, or search \`.board/*.md\` with grep.
- Create: write \`.board/<TYPE>-<n>.md\`, where TYPE is \`STORY\`, \`BUG\` or \`SPIKE\` and \`n\` is one more than the highest existing number of that type (starting at 1): \`# <title>\`, then a \`Status: Backlog\` line and a \`Labels:\` line, then the body. Relations are \`Blocks: <id>\`, \`Blocked by: <id>\` or \`Related: <id>\` lines under the labels line.
- Update: rewrite the card's body, its \`Labels:\` line or its relation lines.
- Move: rewrite the card's \`Status:\` line.
- Comment: append \`## Comment\` and the comment's text to the end of the card.
- Link a PR: add a \`PR: <path>\` line under the status line.

## Cards

- Identity: the file name without \`.md\` (\`STORY-1\`); spike findings are \`docs/spikes/<id lowercased>-<slug>.md\`.
- Types: Feature, \`docs/templates/feature.md\`, whose frontmatter gives its label. Every card is a Feature.
- Priority: none.
- Dependencies: the \`Blocks:\` and \`Blocked by:\` lines.
- Layout: \`# <title>\`, the status and labels lines, then the template's fenced block, filled.

## Statuses

- Statuses: Backlog, Todo, In Progress, In Review, Done, Canceled.
- Moves agents make: to In Progress when work starts, and to In Review when the PR opens.
- Moves that belong to the user: Todo, Done and Canceled.

## Other conditions

- Filing a card: whenever a skill the user started calls for one.
- Editing a card: an answered open question, a stale relation or a wrong label may be fixed; anything that changes the card's goal is reported instead.
`,
    "docs/templates/feature.md": `---
type: Feature
label: Feature
summary: A change in behaviour for users of the code, small enough for one PR.
---

# Feature

## Template

\`\`\`markdown
<One paragraph: what changes, and for whom.>

## Why

<Who needs it, and the evidence.>

## Scope

<What the change covers, as behaviour, with any new public interfaces.>

## Out of scope

<What a reader would assume is included but isn't.>

## Acceptance criteria

- <One observable pass/fail behaviour per bullet.>

## Assumptions

## Open questions

## References
\`\`\`

## Before writing

- Every part of the scope is needed for the outcome.

## Checklist

- Each criterion names one outcome visible from outside the implementation, and passes or fails with nothing in between.
- No implementation beyond the public names users see, and no code locations.
- Nothing extra.
`,
    "docs/GIT.md": `# Git

How work moves through git and the forge in this project.

## Repository

- Remote and forge: \`origin\`, the local bare repository \`.forge/remote.git\`; a local stub forge, where a pull request is the file \`.forge/prs/${BRANCH}.md\`.
- Default branch: \`main\`. Automated work never commits to it.

## Workspace

How each delivery's work is isolated. Nothing else runs in this checkout, and the task container mounts only it.

- Branch name: \`${BRANCH}\`, from \`main\`.
- Where the work happens: this checkout, on the branch, switched to with \`git switch -c ${BRANCH} main\`, or \`git switch ${BRANCH}\` when it exists; no worktree.
- Preparing it: none.
- Removing it: none.
- Scratch folder: \`.tmp/\`, ignored by git.
- Spike prototypes: under \`.tmp/\`, never committed.

## Commits and push

- Commit convention: Conventional Commits.
- Commit hooks: none.
- Before each push: \`git merge --no-edit main\`; then \`git push -u origin ${BRANCH}\` the first time and \`git push\` after.

## Pull request

- Opening: write \`.forge/prs/${BRANCH}.md\` with \`# <title>\` and the description, under a \`Draft: yes\` line while it's a draft; marking it ready removes that line. Target branch: \`main\`.
- Description: four parts in this order: **What changes**, **Needs you**, **Why trust it**, **Not done**.
- Required checks: the checks in \`TESTING.md\`.

## Restrictions

- Never merge into \`main\`, force-push, or rewrite history.
`,
  };
}

/**
 * The script at `.swepro/run`: it runs a command in the task's container, in the directory that mirrors the caller's.
 * One argument runs through bash; several run as they are.
 */
export function runScript(container: string, repoInContainer: string): string {
  return `#!/bin/sh
# Runs a command in this task's container, in the directory that mirrors the current one.
root=$(cd "$(dirname "$0")/.." && pwd -P)
here=$(pwd -P)
case "$here" in "$root"*) rel=\${here#"$root"} ;; *) rel= ;; esac
if [ "$#" -eq 1 ]; then
  exec docker exec -w "${repoInContainer}$rel" ${container} bash -c "$1"
fi
exec docker exec -w "${repoInContainer}$rel" ${container} "$@"
`;
}

/**
 * What the grading container runs: apply the arm's patch to the pristine repository, then the task's own verifier,
 * which resets the test files, applies the hidden tests, runs them, and checks every fail-to-pass and pass-to-pass
 * test. The fallbacks are the ones SWE-bench Pro's patch replay uses.
 */
const GRADE_SCRIPT = `cd /app 2>/dev/null || cd /testbed
if [ -s /tmp/model.patch ]; then
  git apply --verbose /tmp/model.patch || git apply --3way /tmp/model.patch || patch --fuzz=3 -p1 -i /tmp/model.patch
fi
bash /tests/test.sh`;

/**
 * The docker command that grades one arm: a fresh container of the task's published image, removed when it exits,
 * that sees only that task's verifier, the arm's patch, and a log folder. No container a run used is reused.
 */
export function gradeArgs(opts: {
  name: string;
  image: string;
  testsDir: string;
  patchFile: string;
  logsDir: string;
}): string[] {
  return [
    "run",
    "--rm",
    "--name",
    opts.name,
    "--platform",
    "linux/amd64",
    "-v",
    `${opts.testsDir}:/tests:ro`,
    "-v",
    `${opts.patchFile}:/tmp/model.patch:ro`,
    "-v",
    `${opts.logsDir}:/logs`,
    "--entrypoint",
    "/bin/bash",
    opts.image,
    "-c",
    GRADE_SCRIPT,
  ];
}

/** A git patch without its binary sections, which `git apply` can't take from a text diff. */
export function stripBinary(patch: string): string {
  return patch
    .split(/(?=^diff --git )/m)
    .filter((s) => s.trim() && !/^Binary files .* differ$/m.test(s) && !/^GIT binary patch$/m.test(s))
    .join("");
}

/** The pathspecs that leave the harness's own files out of an arm's patch. */
export const DIFF_EXCLUDES = SETUP_FILES.map((f) => `:(exclude)${f}`);

/** Dollars per million tokens. Cache writes cost 1.25 times the input price for 5 minutes and 2 times for an hour. */
interface Price {
  input: number;
  output: number;
  cacheRead: number;
}

// Haiku 5.5 charges more once a prompt passes 100K tokens.
const HAIKU_TIER_TOKENS = 100_000;
const PRICES: readonly { prefix: string; price: Price; above?: Price }[] = [
  { prefix: "claude-opus-5-5", price: { input: 4, output: 20, cacheRead: 0.2 } },
  { prefix: "claude-sonnet-5-5", price: { input: 2, output: 10, cacheRead: 0.1 } },
  {
    prefix: "claude-haiku-5-5",
    price: { input: 0.1, output: 0.5, cacheRead: 0.01 },
    above: { input: 0.5, output: 2.5, cacheRead: 0.05 },
  },
];

type Json = Record<string, unknown>;
const isRecord = (v: unknown): v is Json => typeof v === "object" && v !== null;
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number => (typeof v === "number" ? v : 0);

/** One transcript entry's response id and cost, or undefined for an entry that isn't a model response. */
function responseOf(e: unknown): { id: string; cost: number } | undefined {
  if (!isRecord(e) || e["type"] !== "assistant" || !isRecord(e["message"])) return undefined;
  const m = e["message"];
  const u = isRecord(m["usage"]) ? m["usage"] : {};
  const split = isRecord(u["cache_creation"]) ? u["cache_creation"] : undefined;
  const input = num(u["input_tokens"]);
  const write5m = num(split ? split["ephemeral_5m_input_tokens"] : u["cache_creation_input_tokens"]);
  const write1h = split ? num(split["ephemeral_1h_input_tokens"]) : 0;
  const read = num(u["cache_read_input_tokens"]);
  const output = num(u["output_tokens"]);
  const row = PRICES.find((p) => str(m["model"]).startsWith(p.prefix));
  if (!row) return { id: str(m["id"]), cost: NaN };
  const p = row.above && input + write5m + write1h + read > HAIKU_TIER_TOKENS ? row.above : row.price;
  const cost =
    (input * p.input + write5m * p.input * 1.25 + write1h * p.input * 2 + read * p.cacheRead + output * p.output) / 1e6;
  return { id: str(m["id"]), cost };
}

export interface Usage {
  cost: number;
  agents: number;
}

/**
 * The cost and agent count of one session, from its transcripts: the session's own, and one per agent it started. A
 * transcript repeats an entry for each content block of the same response, so each message id counts once.
 */
export function usageOf(transcripts: readonly { agent: boolean; lines: readonly unknown[] }[]): Usage {
  const seen = new Set<string>();
  let cost = 0;
  for (const t of transcripts) {
    for (const e of t.lines) {
      const r = responseOf(e);
      if (!r || seen.has(r.id)) continue;
      seen.add(r.id);
      cost += r.cost;
    }
  }
  return { cost, agents: transcripts.filter((t) => t.agent).length };
}

/** How one invocation ended: a timeout, or how the session stopped. */
export function endingOf(opts: { timedOut: boolean; exitCode: number | null; result: unknown }): string {
  if (opts.timedOut) return "timed out";
  const r = isRecord(opts.result) ? opts.result : undefined;
  if (r) return r["is_error"] === true ? `error: ${str(r["subtype"])}` : str(r["subtype"]) || "ended";
  return `exited ${String(opts.exitCode)}`;
}

export interface PhaseResult {
  name: string;
  cost: number;
  agents: number;
  wallSeconds: number;
  ending: string;
  /** Claude Code's own figure for the session, kept beside the transcript total as a cross-check. */
  reportedCost: number | null;
}

export interface Counts {
  passed: number;
  total: number;
}

/** The size of an arm's patch: how many files it touches, how many of them are tests, and the lines it adds and removes. */
export interface PatchStats {
  files: number;
  testFiles: number;
  added: number;
  removed: number;
}

export interface ArmResult {
  task: string;
  kind: Kind;
  shape: boolean;
  arm: Arm;
  /** Which run of this task and arm this is, from 1. Results from before repeated runs have none. */
  run?: number;
  /** The model of the arm's main session. Results from before the model was a choice ran on the default. */
  model?: string;
  /** True or false once graded; null when the arm never produced code to grade. */
  resolved: boolean | null;
  failToPass: Counts | null;
  /** The tests that passed before the change and must still pass: one that no longer does is a regression. */
  passToPass?: Counts | null;
  patch?: PatchStats | null;
  phases: PhaseResult[];
  error?: string;
}

/** The results released for one version of a plugin: every run that counts for it, kept in the repository. */
export interface Release {
  plugin: string;
  version: string;
  released: string;
  note?: string;
  results: ArmResult[];
}

/** A file under a tests folder, or named as a test: `test_x.py`, `x_test.go`, `x.test.ts`, `x.spec.ts`. */
const TEST_FOLDER = /(?:^|\/)(?:tests?|__tests__|spec|testdata)\//i;
const TEST_NAME = /(?:^|\/)test_[^/]*$|[._-](?:test|spec)\.[^/]*$/i;

/** What a patch touches, read from its text. */
export function patchStats(patch: string): PatchStats {
  const files = patch
    .matchAll(/^diff --git a\/.* b\/(.*)$/gm)
    .map((m) => m[1] ?? "")
    .toArray();
  const lines = patch.split("\n");
  return {
    files: files.length,
    testFiles: files.filter((f) => TEST_FOLDER.test(f) || TEST_NAME.test(f)).length,
    added: lines.filter((l) => l.startsWith("+") && !l.startsWith("+++")).length,
    removed: lines.filter((l) => l.startsWith("-") && !l.startsWith("---")).length,
  };
}

const totalOf = (r: ArmResult, key: "cost" | "agents" | "wallSeconds"): number =>
  r.phases.reduce((s, p) => s + p[key], 0);

const money = (n: number): string => `$${n.toFixed(2)}`;
const minutes = (s: number): string => `${(s / 60).toFixed(1)} min`;
const verdict = (r: ArmResult): string => (r.resolved === null ? "not graded" : r.resolved ? "resolved" : "unresolved");
const cell = (s: string): string => s.replaceAll("|", String.raw`\|`).replaceAll("\n", " ");
const kindOf = (r: ArmResult): string => (r.shape ? "shape → story" : r.kind);
const counts = (c: Counts | null | undefined): string => (c ? `${c.passed}/${c.total}` : "–");
const regressions = (r: ArmResult): string => (r.passToPass ? String(r.passToPass.total - r.passToPass.passed) : "–");
const patchOf = (r: ArmResult): string =>
  r.patch ? `+${r.patch.added} −${r.patch.removed} in ${r.patch.files} files, ${r.patch.testFiles} of them tests` : "–";
const table = (head: readonly string[], rows: readonly string[]): string =>
  `| ${head.join(" | ")} |\n| ${head.map(() => "--").join(" | ")} |\n${rows.join("\n")}`;

/** One task and arm's runs as one line: how many resolved, and the mean cost and time of a run. */
function summary(rs: readonly ArmResult[]): { resolved: string; cost: number; seconds: number } {
  const mean = (key: "cost" | "wallSeconds"): number => rs.reduce((s, r) => s + totalOf(r, key), 0) / rs.length;
  return {
    resolved: `${rs.filter((r) => r.resolved === true).length}/${rs.length}`,
    cost: mean("cost"),
    seconds: mean("wallSeconds"),
  };
}

function groupBy(results: readonly ArmResult[], key: (r: ArmResult) => string): Map<string, ArmResult[]> {
  const groups = new Map<string, ArmResult[]>();
  for (const r of results) groups.set(key(r), [...(groups.get(key(r)) ?? []), r]);
  return groups;
}

/**
 * How these results compare with a release's: one row per task and arm that both hold, the plugin's arm matched with
 * the plugin's and plain with plain, whatever the plugin was called then.
 */
function against(results: readonly ArmResult[], then: Release): string[] {
  const key = (r: ArmResult): string => `${taskKey(r.task)} | ${role(r.arm)}`;
  const before = groupBy(
    then.results.filter((r) => refOf(r.arm) === undefined),
    key,
  );
  const now = groupBy(
    results.filter((r) => refOf(r.arm) === undefined),
    key,
  );
  const rows = [...now]
    .filter(([k]) => before.has(k))
    .map(([k, rs]) => {
      const a = summary(before.get(k) ?? []);
      const b = summary(rs);
      return `| ${k} | ${a.resolved} → ${b.resolved} | ${money(a.cost)} → ${money(b.cost)} | ${minutes(a.seconds)} → ${minutes(b.seconds)} |`;
    });
  const label = `${then.plugin} ${then.version}`;
  return [
    `## Against ${label}`,
    rows.length > 0
      ? `Each cell reads ${label} → this report: the runs resolved, then the mean cost and wall time of a run.`
      : `${label} holds no result for a task and arm in this report.`,
    ...(rows.length > 0 ? [table(["Task", "Arm", "Resolved", "Cost", "Wall time"], rows)] : []),
  ];
}

/** What a report says about itself: when it started, the plugin's name and version, and the release it is compared with. */
export interface ReportMeta {
  started: string;
  plugin: string;
  note?: string;
  against?: Release;
}

/**
 * The report: totals per kind and arm, the comparison with the release before, then one row per run, with the shape →
 * story phases apart.
 */
export function renderReport(results: readonly ArmResult[], meta: ReportMeta): string {
  const several = groupBy(results, (r) => `${r.task} ${r.arm}`)
    .values()
    .some((rs) => rs.length > 1);
  const models = [...new Set(results.map((r) => r.model ?? DEFAULT_MODEL))].join(" and ");
  const rows = results.map((r) => {
    const ending = r.error ? `error: ${r.error}` : r.phases.map((p) => p.ending).join(" → ");
    return `| ${taskKey(r.task)} | ${kindOf(r)} | ${r.arm} | ${r.run ?? 1} | ${verdict(r)} | ${counts(r.failToPass)} | ${regressions(r)} | ${money(totalOf(r, "cost"))} | ${minutes(totalOf(r, "wallSeconds"))} | ${totalOf(r, "agents")} | ${patchOf(r)} | ${cell(ending)} |`;
  });
  const split = results
    .filter((r) => r.phases.length > 1)
    .flatMap((r) =>
      r.phases.map(
        (p) =>
          `| ${taskKey(r.task)} | ${r.arm} | ${r.run ?? 1} | ${p.name} | ${money(p.cost)} | ${minutes(p.wallSeconds)} | ${p.agents} | ${cell(p.ending)} |`,
      ),
    );
  const totals = [...groupBy(results, (r) => `${kindOf(r)} | ${r.arm}`)].map(([k, rs]) => {
    const sum = (key: "cost" | "wallSeconds"): number => rs.reduce((s, r) => s + totalOf(r, key), 0);
    return `| ${k} | ${summary(rs).resolved} | ${money(sum("cost"))} | ${minutes(sum("wallSeconds"))} |`;
  });
  return [
    `# SWE-bench Pro: ${meta.plugin} and plain Claude Code`,
    ...(meta.note ? [meta.note] : []),
    `Started ${meta.started}. Plugin: ${meta.plugin}. Every arm runs Claude Code on ${models} at its default effort, without ${DISALLOWED_TOOLS.join(" or ")}; the plain arm loads no plugin.`,
    several ? SEVERAL_RUNS : ONE_RUN,
    NO_REVIEW,
    "## Totals",
    table(["Kind", "Arm", "Resolved", "Cost", "Wall time"], totals),
    ...(meta.against ? against(results, meta.against) : []),
    "## Per task, arm and run",
    "Regressions are the tests that passed before the change and no longer do.",
    table(
      [
        "Task",
        "Kind",
        "Arm",
        "Run",
        "Verdict",
        "Fail-to-pass",
        "Regressions",
        "Cost",
        "Wall time",
        "Agents",
        "Patch",
        "How it ended",
      ],
      rows,
    ),
    ...(split.length > 0
      ? [
          "## Shape → story phases",
          table(["Task", "Arm", "Run", "Phase", "Cost", "Wall time", "Agents", "How it ended"], split),
        ]
      : []),
    "",
  ].join("\n\n");
}

export interface GraderVerdict {
  task: string;
  patch: "reference" | "empty";
  resolved: boolean;
}

/** The grader check's report: each task's verdict with its reference and with an empty patch, and whether all hold. */
export function renderGraderReport(verdicts: readonly GraderVerdict[]): string {
  const expected = (v: GraderVerdict): boolean => v.resolved === (v.patch === "reference");
  const bad = verdicts.filter((v) => !expected(v));
  return [
    "# SWE-bench Pro grader check",
    bad.length === 0
      ? `Every task resolved with its reference patch and stayed unresolved with an empty patch (${verdicts.length} gradings).`
      : `${bad.length} of ${verdicts.length} gradings went the wrong way.`,
    "| Task | Patch | Verdict | As expected |\n| -- | -- | -- | -- |\n" +
      verdicts
        .map(
          (v) =>
            `| ${taskKey(v.task)} | ${v.patch} | ${v.resolved ? "resolved" : "unresolved"} | ${expected(v) ? "yes" : "no"} |`,
        )
        .join("\n"),
    "",
  ].join("\n\n");
}
