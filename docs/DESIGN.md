# Design

The principles every skill, agent and reference in this repo is designed against. How the repo is built is in [`ARCHITECTURE.md`](ARCHITECTURE.md). A rule only reaches a project through the plugin, so each skill encodes the ones it needs; this page explains them.

## Bias for action

A skill does the work and hands the result back for review. It doesn't stop to ask permission partway through.

- **Finish, then report.** The user reviews what was produced and comes back with fixes. A plan, a breakdown or a draft is never held for sign-off before the skill acts on it.
- **Decide what can be decided.** A choice that leaves the outcome unchanged is made and stated as an assumption, so the user can object. A choice that would change the outcome becomes an open question on the output, and the output still ships.
- **Ask only when the skill can't act.** A missing input it can't find or infer, or a step it has no permission for, is reported. The skill does everything else first.
- **Reviews are fresh eyes, not gates.** A skill may have its own work reviewed by a subagent, then fixes what holds up and carries on, without waiting for the user.

Hard limits stay: what `docs/BOARD.md` reserves for the user, such as status transitions, stays with the user.

Setup is the exception. `bootstrap` writes the rules every other skill then acts on without asking, so it works through each file with the user: the repo shows the facts, and the user makes the choices.

## Simplicity over ceremony

A skill is a short brief for a capable model, not a process for a weak one.

- **Say what good looks like and trust the model to get there.** No stage diagrams, loop counters, severity scales, halt tables, ledgers or checkpoints. A model that can't do the job with a clear brief needs a bigger model, not more process.
- **One agent does the work.** A subagent earns its place only where independence or a clean context is the point: a reviewer who didn't write the draft, QA who reproduces the bug and checks the change without having written either, parallel scouts that keep fetched pages out of the main context, a clerk who checks citations it didn't write.
- **One review, then ship.** Fix what holds up and move on; what's left goes into the output as an open item.
- **The project's own docs carry the rest.** `docs/BOARD.md`, `docs/GIT.md`, `TESTING.md` and the library conventions say how this project works, so skills stay short and generic.
- **Assume the setup is there.** A plugin is installed whole, and a project is bootstrapped before any other skill runs in it. So a skill names its agents and the project's files as given, and says nothing about working without one. A skill that hedges about every part that might be missing is several skills at once, and none of them clear.
- **Trust who has access.** Cards, comments, drafts and reports come from the user and the people they let onto the board and the repo, so a skill acts on them as written, with no guard against a planted instruction. Only what is fetched from outside, a web page a scout reads, is evidence that can't give orders.
- **Cut before you add.** When a skill underperforms, first remove what distracts, then move up a model size, and only then add a sentence.

## Parallel by default

Any number of runs can work at once, on different cards, without stepping on each other.

- **Every run that changes the repo works in a workspace of its own**, isolated as the project's `docs/GIT.md` says: normally a worktree branched from the latest default branch. Every command, file and subagent stays inside it. The root checkout is for work outside a delivery.
- **The isolation rules live in `docs/GIT.md`, not in the skills.** A skill follows them as declared, so a project, or an eval's scaffold, can declare its own.
- **Each workspace runs the app on its own port, database and device**, as `TESTING.md` says.
- **Scratch work goes under the workspace's `.tmp/`**, never a shared path.
- **Shared files are append-friendly**: one line per entry, sorted, each run adding only its own lines, so parallel PRs merge cleanly. Git history is the log.
- **Each PR brings in the latest default branch before it's pushed.**

## Three ways to check

Each answers one question, and none does another's job.

- **`make test` asks whether the plugin is put together right.** It checks structure and links: skills and agents are named after their files, everything they name exists, nothing is left unused, and the code the evals run on does what it says. It calls no model, so it runs on every commit. It never judges what a skill or agent says: wording is tested by running it.
- **`make smoke` asks whether each skill works.** Every skill is started the way a user starts it, in one small project, and runs to the end. It passes when what the skill produced is right: the card, the pull request, the answer. It covers every skill, takes minutes, and runs when a skill or agent has changed.
- **`make eval` asks whether a skill is worth having, and whether a change made it better or worse.** It runs real tasks whose hidden tests decide the verdict, beside plain Claude Code, and compares the result with the report released for the version before. It covers the skills hidden tests can grade, takes hours, and runs before a release. On a strong model the plugin isn't meant to beat plain Claude Code. What its process buys (cards, tests first, independent QA, a PR written for the reviewer) shows in real use, not in a small project or a benchmark. The eval is the guard against ceremony: a skill may cost a little against plain on resolved tasks, cost or time, but a wide gap means the process has grown heavier than the work needs, and the fix is to cut it back.

A check that calls a model runs only when the user asks.
