// Reads the repo's own files for the static tests: plugins, their skills, agents and eval cases.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..");
/** Sorts names the same way on every machine. */
const byName = (a: string, b: string): number => a.localeCompare(b, "en");

export const read = (rel: string): string => readFileSync(path.join(ROOT, rel), "utf8");
export const exists = (rel: string): boolean => existsSync(path.join(ROOT, rel));
const dirs = (rel: string): string[] =>
  exists(rel)
    ? readdirSync(path.join(ROOT, rel))
        .filter((d) => statSync(path.join(ROOT, rel, d)).isDirectory())
        .toSorted(byName)
    : [];

export type Front = Record<string, string | string[]>;

/**
 * The YAML frontmatter of a Markdown file, for the flat shapes this repo uses: `key: value`, `key: [a, b]`, and quoted
 * strings. Comment lines are skipped. Anything else is kept as its raw text.
 */
export function frontmatter(md: string): { front: Front; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(md);
  if (!m) return { front: {}, body: md };
  const front: Front = {};
  const lines = (m[1] ?? "").split("\n");
  for (const line of lines) {
    const kv = /^([\w-]+):(.*)$/.exec(line);
    if (!kv) continue;
    const [, key = "", rest = ""] = kv;
    const raw = rest.trim();
    const list = /^\[(.*)\]$/.exec(raw);
    front[key] = list
      ? (list[1] ?? "")
          .split(",")
          .map((s) => unquote(s.trim()))
          .filter(Boolean)
      : unquote(raw.trim());
  }
  return { front, body: m[2] ?? "" };
}

const unquote = (s: string): string => (/^(["']).*\1$/.test(s) ? s.slice(1, -1) : s);
export const text = (f: Front, key: string): string => {
  const v = f[key];
  return typeof v === "string" ? v : "";
};
export const list = (f: Front, key: string): string[] => {
  const v = f[key];
  return Array.isArray(v) ? v : [];
};

export const plugins = (): string[] => dirs("plugins");
export const skills = (plugin: string): string[] => dirs(`plugins/${plugin}/skills`);
export const agents = (plugin: string): string[] =>
  exists(`plugins/${plugin}/agents`)
    ? readdirSync(path.join(ROOT, `plugins/${plugin}/agents`))
        .filter((f) => f.endsWith(".md"))
        .map((f) => f.slice(0, -3))
        .toSorted(byName)
    : [];
export const evalCases = (plugin: string): string[] =>
  dirs(`plugins/${plugin}/evals`).filter((d) => exists(`plugins/${plugin}/evals/${d}/prompt.md`));
export const graders = (plugin: string, c: string): string[] => {
  const dir = `plugins/${plugin}/evals/${c}/graders`;
  return exists(dir)
    ? readdirSync(path.join(ROOT, dir))
        .filter((f) => f.endsWith(".md"))
        .toSorted(byName)
    : [];
};
