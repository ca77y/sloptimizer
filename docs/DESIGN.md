# Design

The principles every skill, agent and reference in this repo is designed against. How the repo is built is in [`ARCHITECTURE.md`](ARCHITECTURE.md). A rule only reaches a project through the plugin, so each skill encodes the ones it needs; this page explains them.

## Bias for action

A skill does the work and hands the result back for review. It doesn't stop to ask permission partway through.

- **Finish, then report.** The user reviews what was produced and comes back with fixes. A plan, a breakdown or a draft is never held for sign-off before the skill acts on it.
- **Decide what can be decided.** A choice that leaves the outcome unchanged is made and stated as an assumption, so the user can object. A choice that would change the outcome becomes an open question on the output, and the output still ships.
- **Ask only when the skill can't act.** A missing input it can't find or infer, or a step it has no permission for, is reported. The skill does everything else first.
- **Reviews are fresh eyes, not gates.** A skill may have its own work reviewed by a subagent, then fixes what holds up and carries on, without waiting for the user.

Hard limits stay: what `docs/BOARD.md` reserves for the user, such as status transitions, stays with the user.
