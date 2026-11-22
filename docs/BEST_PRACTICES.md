# Best practices

What the outside world says about writing Claude Code plugins, skills and subagents, gathered on 2026-11-22. [`DESIGN.md`](DESIGN.md) holds the principles this repo chose; this page holds the evidence they can be checked against.

## How to read this page

- Each rule has an id (`M3`, `D2`), so an audit can point at it. The tags in brackets name its sources, listed at the end.
- The rules in section 1 come from Anthropic's prompting pages for the Claude 5 generation and carry the most weight: these are the models the plugin runs on. When a later section disagrees with section 1, section 1 wins.
- After that, the order of trust is: Anthropic's documentation, then measurements published by people who ship skills, then stated practice, then opinion. A rule that rests on one source or one measurement says so.
- Anthropic scopes its own advice: "Where a technique names a specific model, treat it as measured on that model and re-check it against your own evals before applying it to another" [BP]. Each rule in section 1 therefore names the models its source names.
- Where sources disagree, the disagreement is in [Where the sources disagree](#where-the-sources-disagree), with the side this page takes.

## 1. Rules for the Claude 5 generation

Anthropic publishes one prompting page per model (Fable 5.2, Fable 5.1, Fable 5, Opus 5.5, Opus 5, Sonnet 5.5, Sonnet 5, Haiku 5.5) and a general page for all current models. No single page compares the generation with Claude 4; each compares a model with its predecessor.

- **M1. Mean every absolute.** "The model treats an instruction that contains 'never' as absolute." Where the model should keep responsibility for an action, write the approval step ("ask for approval before deleting files"); where the rule is absolute, give its scope and its reason. [F52]
- **M2. State the scope of an instruction.** These models read literally and don't carry an instruction from one item to the next: "Apply this formatting to every section, not just the first one." A rule that limits scope also loses to a broader framing elsewhere in the same prompt, so the two must agree. [S5, S55, F52]
- **M3. Remove what earlier models needed.** "Skills developed for prior models are often too prescriptive for Claude Fable 5 and can degrade output quality." Read every skill, agent file and note carried over, and remove or test each instruction; Anthropic removed over 80% of Claude Code's own system prompt for these models "with no measurable loss". [F5, F52, T-CTX]
- **M4. Write in a plain register.** Emphasis written to make older models act ("CRITICAL: You MUST…", "If in doubt, use…") makes responsive models over-trigger; "Use this tool when…" is enough. The docs measure this on Opus 4.5 and 4.6 and no Claude 5 page restates it by name, but the literal-reading rules above and the community's measurements point the same way. [BP, SC, T-CTX]
- **M5. Give the reason with the rule.** A reason lets the model generalise the rule to cases it doesn't name, and Fable 5 "tends to perform better when the prompt states the intent behind a request". Keep the reason to a clause. [BP, F5]
- **M6. State the behaviour you want.** Positive examples and recipes beat "don't" instructions on Opus 5 and Sonnet 5, and one measurement found a "don't restate" rule did worse than no guidance at all. A prohibition earns its place for a discrete action or a hard guardrail, paired with the target behaviour, or for one narrow, named default the model keeps falling into. [BP, O5, S5, O55, F51, SP, MP]
- **M7. Make delegation conditional.** Opus 5 "delegates to subagents more readily than prior models", Sonnet 5.5 at high effort launches reviewers of its own, and Fable 5.2 delegates as much as its prompts invite. Remove standing "delegate" lines; where a skill does delegate, it says what the subagent buys, when it is worth it, when it isn't, and how to brief it. [F52, O5, S55]
- **M8. Build verification in as a step, not as a reminder.** The models differ: on Opus 5, lines like "double-check" and "use a subagent to verify" cause over-verification and should go; Sonnet 5.5 and Haiku 5.5 at low effort report work done without a real check and need "run a real check that exercises the change"; on Fable 5, "separate, fresh-context verifier subagents tend to outperform self-critique". A named check with a named piece of evidence survives all three; a general urge to re-check does not. [O5, S55, H55, F5]
- **M9. Ask a reviewer for coverage, then filter.** "Only report high-severity issues" or "be conservative" is followed literally and lowers recall. Ask for every finding with its confidence and severity and filter in a second step; when one pass must filter itself, give it a concrete threshold. [O5, S5]
- **M10. Name the stops.** At low and medium effort these models sometimes end a turn early: listing what's left, offering to continue, or halting at an ordinary obstacle. Name the stops you don't want and the ones you do, tell ordinary obstacles (errors, timeouts) from deliberate blockers (a file marked hands-off), and keep a confirmation step for anything risky or irreversible. [F52, O55, S55, H55, F5]
- **M11. Say what to leave out.** These models add tests, docs, files and nearby fixes nobody asked for. Say that a problem found along the way is reported as a follow-up, and that an assessment or a plan is the deliverable when that is what was asked for. [S55, H55, F51, F5, O5]
- **M12. Leave thinking to the effort level.** "Think carefully" and "answer directly" lines no longer steer how much the model thinks; the `effort` setting does, and its levels mean different amounts on different models, so re-test it per model. Never ask for the model's reasoning to be written out in the response: that can be refused. Ask for a short explanation or a summary of actions. [F52, O55, O5, S55, H55]
- **M13. Make reports stand alone.** The reader "has not seen your tool calls, your reasoning or the files you opened": lead with the outcome, use no label invented during the work, and back each claim with a tool result from the session. This holds for a subagent's report to its caller and for a PR description. [F52, F5]
- **M14. Keep cautions few and specific.** Cautions pile up and make Fable 5.2 ask for approval it doesn't need, mostly when several agents work together. Delete the ones whose reason is gone, name the routine steps that need no approval, and make each approval rule narrow: a broad category blocked half of one test's routine requests. [F52]
- **M15. Show no token or context countdown.** It lowers quality or is mistaken for injected text. [F5, F52, S55]
- **M16. Keep long work in files.** These models find their place from the filesystem better than from a compacted conversation: keep progress in a file and in git, and say how a fresh window starts ("review the progress file, the git log, then run the tests"). [BP]
- **M17. Test on every model you ship to.** "What works perfectly for Opus might need more detail for Haiku." A skill that names a model per agent has to be run on each. [BP, SK]

## 2. Descriptions and invocation

- **D1. Say what the skill does, then when to use it.** Third person, verb first, the key use case first: "Reviews a pull request for style and test coverage. Use when asked to review code." The limit is 1,024 characters; Claude Code truncates the listing entry at 1,536 and gives all descriptions together 1% of the context window, dropping the least-used first. [SK, CC-SK, AS]
- **D2. Keep the workflow out of the description.** A description that summarises the steps gets followed in place of the body: one that mentioned a review made an agent run one review where the skill asked for two. One clause on the outcome is safe; steps, counts and order are not. Measured once, never contradicted. [SP, AO]
- **D3. Trigger on the words users say, one per branch.** Name the situations and the user's own vocabulary; collapse synonyms that rename one situation; keep each description distinct from its siblings so a near-miss request reaches the right skill. [SK, MP, SC, AO]
- **D4. Stay plain until an eval shows under-triggering.** The skill-creator asks for "a little bit pushy" descriptions because models under-trigger; the Claude 5 pages warn of over-triggering. A trigger eval settles it per skill (V2). [SC, BP]
- **D5. Decide who may start each skill.** `disable-model-invocation: true` is "for workflows with side effects or that you want to control timing". A skill the model can start costs listing space in every session; one only the user starts costs nothing. [CC-SK, MP]
- **D6. Name skills plainly and uniquely.** Lowercase letters, digits and hyphens, at most 64 characters, equal to the folder name, without `claude` or `anthropic`, in one pattern across the plugin. `npx skills` keeps only the first of two skills with one name. [SK, AS, NPX]
- **D7. Write an agent's description as its delegation rule.** It is "when Claude should delegate to this subagent", always in context, so keep it brief. "Use proactively" invites delegation without being asked: add it only when that is wanted (M7). [CC-SA]

## 3. Skill bodies

- **B1. Add only what the model doesn't already know.** "The context window is a public good." Test each sentence: does it change behaviour against the default? When it doesn't, delete the sentence. A loaded skill stays in context for the rest of the session, so every line is a recurring cost. [SK, CC-SK, MP, T-SKILLS]
- **B2. Match freedom to fragility.** State the goal and the constraints where several approaches work; give exact commands where the operation is fragile or the order matters, and number the steps then. [SK, BP, T-SKILLS]
- **B3. Write standing instructions, most important first.** Claude Code doesn't re-read a skill, so "run the tests after every edit" holds where "run the tests" fades; after compaction only the first 5,000 tokens of a skill survive. [CC-SK]
- **B4. End each step on a condition that can be checked.** "Every modified model accounted for" forces thorough work where "produce a change list" doesn't; "do I have URLs?" can't be answered yes by default the way "did I verify this?" can. [MP, AO, JV]
- **B5. Say each thing once, in one term.** One home per rule across `SKILL.md`, references, agent prompts and project files; one word per concept. Duplicates drift apart, and Anthropic found conflicting copies of a rule between its system prompt, skills and user requests. [SK, MP, AO, T-CTX]
- **B6. Change a skill on an observed failure.** Gotchas, red flags and rebuttal tables earn their place one row at a time, from a run where the model went wrong and a re-run where the row fixed it. One 2026 test found a banned-patterns list made no difference on a current Opus. [T-SKILLS, MP, SP, AO]
- **B7. Give fixed formats as a template.** A template with a line on what goes in each section, or a schema, carries a format better than several worked examples, which narrow what these models explore. Use one example where a technique isn't obvious. [SK, T-CTX, SP, MP]
- **B8. Keep time-bound facts out.** Version numbers, model names and dates go stale inside a skill; put them where they can be changed or looked up. [SK]

## 4. Structure

- **S1. Keep `SKILL.md` under 500 lines and about 5,000 tokens.** No source measured an optimum; all say shorter is better for whatever loads most often. Pocock's median skill is 75 lines, Osmani's 300. [SK, CC-SK, AS, MP, AO]
- **S2. Make `SKILL.md` the hub.** Point to each supporting file with what it holds and when to read it; keep references one level deep, because a file reached through another file may be read only in part; give a reference over 100 lines a table of contents. [SK, AS, T-SKILLS]
- **S3. Disclose by branch.** Inline what every run needs; move out what only some runs reach. [MP]
- **S4. Bundle a script for deterministic work.** Say whether to run it or read it, name what it needs, and call it through its interpreter. Only a script's output costs context. [SK, SP, AO]
- **S5. Use the path variables.** `${CLAUDE_SKILL_DIR}` for a skill's own files, `${CLAUDE_PLUGIN_ROOT}` for the plugin's, `${CLAUDE_PLUGIN_DATA}` for anything that must survive an update. They are substituted only in Claude Code. [CC-SK, CC-PL]
- **S6. Assume no tool is installed.** Name what the skill needs and say what happens without it. [SK]
- **S7. Keep project facts in project files.** A setup skill explores, proposes each answer with its reason, confirms with the user, and writes; it updates in place on a second run. Other skills point to those files and name the setup skill when a file they can't do without is missing. [MP, AO, HL]

## 5. Subagents

- **A1. Give a subagent a reason to exist.** It pays for itself when the work floods the main context, when independence is the point (a reviewer who didn't write the draft), when tracks are independent and parallel, or when its tools should be restricted. Otherwise the main session is faster and about half the cost. [CC-SA, BP, O5, JV, AO]
- **A2. Write the whole job into the agent file.** The body is the subagent's entire system prompt, and it starts with no conversation history: one role, its scope, its output format. [CC-SA, AO]
- **A3. Grant the fewest tools.** Reviewers and checkers get read-only tools. Plugin agents ignore `hooks`, `mcpServers` and `permissionMode`, and other harnesses drop `tools`, so a safety property also needs its sentence in the prompt. [CC-SA, CPO, WSH]
- **A4. Make the brief self-contained.** Objective, output format, boundaries, and pointers to files in place of pasted history. A rule the subagent must follow is restated in the brief. [CC-SA, SP, MP, AO]
- **A5. Keep a reviewer independent of the author.** Brief it with the requirement and the artefact, and keep the author's conclusion out: "if you hand over conclusions, you'll get back validation of your conclusions." Never tell a reviewer what to leave unflagged. A reviewer given the change without the requirement quietly redefines the requirement. [AO, SP, JV]
- **A6. Fix the report's shape.** A verdict or status, each finding with its `path:line` and what is wrong, what was checked and what couldn't be. Make "blocked" and "needs context" cheap to say. [SP, AO, F52]
- **A7. Choose a model and an effort per role.** Use the least powerful model that does the role, with a mid-tier floor for reviewers; the cheapest models take two to three times the turns on multi-step work and need shorter briefs. Subagents "can account for a large part of what a session costs". [SP, F52, CC-SA, HL]
- **A8. Keep delegation one level deep.** A subagent that spawns its own reviewer duplicates the one its caller dispatches. [SP, AO]
- **A9. Parallelise independent, read-mostly work.** Send the dispatches in one turn, let the lead keep working while they run, and keep writers in sequence. [SP, AO, F5, F51]

## 6. Workflow

- **W1. Hand work over through durable artefacts.** A card, a spec file, a PR: "what carries the work forward is the approved files, not the conversation." An artefact a later agent picks up describes behaviour, never file paths, which go stale. [AO, MP]
- **W2. Slice vertically, one context window each.** A narrow path through every layer, checkable on its own; a wide refactor runs expand, migrate, contract. [MP, AO]
- **W3. Write the failing test first, and reproduce a bug before fixing it.** "A test that passes immediately proves nothing." Have the reproduction written by someone who doesn't know the fix. [AO, MP]
- **W4. Require evidence.** "'Seems right' is never sufficient": each criterion has proof that would fail without the change, and what couldn't be verified is said outright. A PR carries what changed and why, the proof, the risk, and where to look. [AO, F5]
- **W5. Touch only what was asked for.** What is noticed along the way is listed, not fixed (M11). [AO]
- **W6. Bound every loop and list what stops the run.** One or a few review rounds, then the rest becomes an open item; decisions made alone are recorded where the user will see them. [SP, AO, JV]
- **W7. Ask the user for decisions, look up facts.** Offer each question with a recommended answer. Outside the things only the user can decide or authorise, carry on (M10); sources differ on how many checkpoints that leaves. [MP, AO, F5]
- **W8. Scale the ceremony to the task.** A small change needs acceptance criteria, not a spec document. [AO, SP]
- **W9. Name other skills, and say what happens without them.** There is no dependency management between skills: a hard dependency tells the user what to run. [MP, T-SKILLS, NPX]
- **W10. Put a rule with no exceptions in a hook.** Skill text is guidance: "there's no guarantee that it'll follow your instructions." A `command` hook, a permission rule or a test holds every time; a mechanical check belongs in a script or a linter. [CC-BP, AO, MP, JV]
- **W11. Treat a second model's review as data.** Give it the artefact and the contract, check each finding against the code, bound the rounds, and surface a failed or skipped review instead of falling back silently. [AO, JV]

## 7. Evals

- **V1. Compare against a baseline.** Run with and without the skill. "If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing." [SP, SC, SK, CC-EV]
- **V2. Test triggering on natural prompts, with near-misses.** Some that should start the skill and some that almost should; a prompt that names the skill tests nothing about its description. [SC, AO, CC-SK]
- **V3. Repeat runs and read the transcripts.** "Single samples lie": three to five runs per case, with variance read as a signal. `claude plugin eval` defaults to three. [SP, SC, CC-EV]
- **V4. Grade the substance.** "Seeing a skill trigger tells you Claude found it, not that it did what you intended." A grader that passes with or without the skill measures nothing. [CC-SK, SC]
- **V5. Press on the gates.** For a rule the skill must hold, write the case where the user asks to skip it. [SP, RDT]
- **V6. Keep at least three evals per skill and run them on each model.** [SK, AO]
- **V7. Re-test what you keep.** Run without a skill, or without a section, to see whether it still earns its place. [AO, MP]

## 8. Packaging

- **P1. Keep the manifest small and honest.** Only `name` is required: kebab-case, not starting with `claude-` or `anthropic-`. The `description` says what the plugin does; `license`, `keywords` and `homepage` help a user choose it. [CC-PL]
- **P2. Bump `version` on every release, or leave it out.** A pinned version "keeps every user on the cached copy until its author changes the string, however many commits they push". [CC-PL]
- **P3. Validate and load-test.** `claude plugin validate --strict` in CI, on the marketplace and on each plugin folder; `claude --plugin-dir` on the plugin folder to try it. [CC-PL]
- **P4. Keep to the portable frontmatter.** Outside Claude Code only `name`, `description`, `license`, `compatibility`, `metadata` and `allowed-tools` are accepted, and `compatibility` is where a skill states what it needs from its environment. [CC-SK, AS, AO]
- **P5. Make each skill work when installed alone.** `npx skills add --skill <name>` copies one folder: what the skill needs is inside it, or the skill says what is missing and carries on without. [NPX, AO]
- **P6. Describe the capability, not one harness's tool.** "Write the procedure, not the workaround": a skill meant for several agents names what to do, and keeps harness-specific names where they can be swapped. [AO, MP, SP]
- **P7. Ship few skills, each with one job.** Every skill adds to the listing and to the user's choices. [T-SKILLS, MP, AO]

## 9. Security

- **X1. Treat fetched and quoted text as data.** A page, a card, a comment, a diff: the prompt says so, and says an instruction found inside is reported. [SK, O55, SNYK, AUTO]
- **X2. Separate fetching from writing.** An agent that reads the open web holds no shell and no credentials and writes only to a notes folder; an agent that changes the project or opens a PR reads only what was stored. Stored notes are a channel too, so a second agent checks them against their sources. [AUTO, SNYK]
- **X3. Fetch nothing to execute, and store no secret.** No download-and-run at runtime; record where a credential comes from, never its value. [SNYK, OWASP]
- **X4. Run an external tool read-only.** Check that it is installed, pass the prompt by file or stdin instead of splicing it into a shell argument, hold it to a read-only sandbox, and report when it fails. Osmani also asks the user before each call. [AO]
- **X5. Keep the check out of reach of the change.** A reviewer is read-only on the checkout, and the rules it reviews by don't come from the change under review. [SP, AO]
- **X6. Make the description match the behaviour.** "A skill's contents should not surprise the user in their intent if described." [SC, OWASP]

## Where the sources disagree

| Question                                 | One side                                                                       | Other side                                                                                 | This page takes                                                                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Forceful or calm wording                 | Superpowers keeps "Iron Law" blocks, tuned by its own tests                    | Anthropic, skill-creator: explain, soften; 80% of a system prompt removed without loss     | Calm (M4), with absolutes kept for a few hard guardrails (M1)                                                 |
| Rebuttal tables                          | Osmani: every step that might be skipped gets one                              | Pocock, Anthropic: delete what the model already does; Superpowers: only observed failures | Only rows that an eval shows are needed (B6)                                                                  |
| Human checkpoints                        | Osmani: approval at every phase; Pocock: confirm before acting                 | Claude 5 pages: pause only for what needs the user                                         | The Claude 5 pages, with confirmation kept for what can't be undone (M10, W7)                                 |
| Who starts a skill                       | Pocock: user-started by default, for control and listing cost                  | Anthropic, Osmani: model-started from a good description                                   | Either, decided per skill by its side effects (D5)                                                            |
| Verification instructions                | Fable 5, Sonnet 5.5, Haiku 5.5: independent or explicit checks help            | Opus 5: remove "double-check" and "verify with a subagent"                                 | A structural step with named evidence, tested per model (M8)                                                  |
| Reviewer strictness                      | Claude Code's review plugin, Osmani: flag only what is certain                 | Opus 5, Sonnet 5: filters lower recall; report all, filter after                           | Coverage first, then a filter with a concrete bar (M9)                                                        |
| Model per agent                          | plugin-dev: `inherit`                                                          | Superpowers, wshobson: a tier per role, cheapest that fits                                 | A tier per role where cost matters, re-tested as models change (A7)                                           |
| Examples                                 | Anthropic's general page: three to five                                        | Anthropic's 2026 post: examples constrain these models                                     | A template or schema for formats, one example at most (B7)                                                    |
| Reason or no reason                      | Claude Code skills page: "state what to do rather than narrating how or why"   | Prompting page: give the reason behind a rule                                              | A reason in a clause where it changes a decision (M5)                                                         |
| What a reviewer is told about the author | Superpowers: requirement, the author's claim marked unverified, and the change | Osmani: artefact and contract, never the claim                                             | Requirement and artefact always; the author's reasoning never; a claim only when it is the thing checked (A5) |
| Description voice                        | Anthropic: third person                                                        | agentskills.io, skill-creator: imperative "Use this skill when"                            | "Does X. Use when Y." satisfies both (D1)                                                                     |

## Sources

Fetched live on 2026-11-22. Repositories were read at the commit given.

Anthropic:

- **BP**: [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices), for all current models.
- **F52, F51, F5, O55, O5, S55, S5, H55**: the model pages beside it, `prompting-claude-fable-5-2`, `-fable-5-1`, `-fable-5`, `-opus-5-5`, `-opus-5`, `-sonnet-5-5`, `-sonnet-5` and `-haiku-5-5`.
- **SK**: [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) and the Agent Skills overview.
- **CC-SK**: [Extend Claude with skills](https://code.claude.com/docs/en/skills). **CC-SA**: [Create custom subagents](https://code.claude.com/docs/en/sub-agents). **CC-PL**: the plugin pages under `code.claude.com/docs/en/plugins/` (manifest reference, components, loading, marketplace reference, CLI reference). **CC-EV**: [Plugin evals](https://code.claude.com/docs/en/plugin-evals). **CC-BP**: [Best practices](https://code.claude.com/docs/en/best-practices) and the memory page.
- **T-SKILLS**: Thariq Shihipar, [Lessons from building Claude Code: how we use skills](https://claude.dev/blog/lessons-from-building-claude-code-how-we-use-skills/). **T-CTX**: [The new rules of context engineering for Claude 5 generation models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models).
- **AUTO**: [Building effective agent automations](https://claude.dev/blog/building-effective-agent-automations/).
- **SC**: `anthropics/skills`, the `skill-creator` skill, at `e4bb5d9`. **CPO**: `anthropics/claude-plugins-official`, the `plugin-dev`, `feature-dev` and `code-review` plugins, at `73c8cf3`.

Matt Pocock:

- **MP**: `mattpocock/skills` at `abeeaf9` (v1.3.2), above all its `writing-for-agents` skill, `.agents/invocation.md` and `SCOPE.md`; and [aihero.dev/skills-writing-for-agents](https://www.aihero.dev/skills-writing-for-agents).

Addy Osmani:

- **AO**: `addyosmani/agent-skills` at `8c99fa3` (v0.6.17), above all `docs/skill-anatomy.md`, `references/orchestration-patterns.md` and the `doubt-driven-development` skill; and his posts on [agent skills](https://addyosmani.com/blog/agent-skills/), [specs](https://addyosmani.com/blog/good-spec/), [agentic code review](https://addyosmani.com/blog/agentic-code-review/), [auditing agent files](https://addyosmani.com/blog/audit-your-agent-files/) and [AGENTS.md](https://addyosmani.com/blog/agents-md/).

Community:

- **AS**: the [agentskills.io specification](https://agentskills.io/specification) and its guides.
- **SP**: `obra/superpowers` at `22f0b46`, its `writing-skills` and `subagent-driven-development` skills. **JV**: Jesse Vincent's posts [Superpowers 6](https://blog.fsck.com/2026/06/15/Superpowers-6/), [Superpowers 6.4](https://blog.fsck.com/2026/09/21/superpowers-6.4/) and [Rules and Gates](https://blog.fsck.com/2026/04/07/rules-and-gates/).
- **NPX**: `vercel-labs/skills` at `57217cf`. **WSH**: `wshobson/agents` at `12bcec7`.
- **HL**: HumanLayer, [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md).
- **SNYK**: Snyk's [ToxicSkills audit](https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/). **OWASP**: the [Agentic Skills Top 10](https://owasp.github.io/www-project-agentic-skills-top-10/).
- **RDT**: an r/ClaudeAI post on an eval harness for `SKILL.md` files, June 2026.

Not read: the migration guides and "what's new" pages on the Claude platform, Pocock's videos and newsletter, the body of Osmani's book, and Simon Willison's lethal-trifecta post. No Claude 5 page restates the advice on emphasis (M4), and no page gives a maximum length for a Claude Code skill `name`.
