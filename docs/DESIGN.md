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
- **Cut before you add.** When a skill underperforms, first remove what distracts, then move up a model size, and only then add a sentence.

## Parallel by default

Any number of runs can work at once, on different cards, without stepping on each other.

- **Every run that changes the repo works in a worktree of its own**, branched from the latest default branch, and every command, file and subagent stays inside it. The root checkout is for work outside a delivery.
- **Each worktree runs the app on its own port, database and device**, as `TESTING.md` says.
- **Scratch work goes under the worktree's `.tmp/`**, never a shared path.
- **Shared files are append-friendly**: one line per entry, sorted, each run adding only its own lines, so parallel PRs merge cleanly. Git history is the log.
- **Each PR brings in the latest default branch before it's pushed.**
