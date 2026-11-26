# Review brief

Review the change in this checkout against the base named above: committed, uncommitted and untracked work alike, from `git diff --merge-base <base>` and, for untracked files, `git status --porcelain`. The request file named above says what was asked for; a part of it the change doesn't deliver is a finding.

- Run the `code-reviewer` agent on the change. When the change crosses a trust boundary (authentication, authorization, input from outside, secrets, a third-party integration, or an LLM's tools), run the `security-auditor` agent on that part at the same time. Give each the base and the request file.
- Answer in the schema, merging their findings, most important first. Keep a finding only when the code shows it, with its evidence; what is suspected but unconfirmed goes under doubts. No findings is a valid review.
- Leave the checkout and its git state as you found them.
