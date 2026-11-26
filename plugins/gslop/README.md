# gslop

One skill, `agy-review`: Google's Antigravity CLI (`agy`), on Gemini 4 Neon, reviews the current branch before it is
pushed, and Claude then checks each finding against the code and fixes what holds up.

Installing the plugin is not enough. The skill runs `agy` headless on your machine, so it needs the CLI, a signed-in
account on a plan that includes Gemini 4 Neon, and the agent-skills plugin installed in agy.

## Setup

1. **Install the plugin** in Claude Code:

   ```sh
   /plugin marketplace add ca77y/sloptimizer
   /plugin install gslop@sloptimizer
   ```

2. **Install the Antigravity CLI** ([quickstart](https://antigravity.google/docs/getting-started)):

   ```sh
   curl -fsSL https://antigravity.google/cli/install.sh | bash   # macOS, Linux
   ```

   ```powershell
   irm https://antigravity.google/cli/install.ps1 | iex           # Windows
   ```

   It installs to `~/.local/bin/agy`; check that `agy --version` runs from a new shell.

3. **Sign in, with an account that has Gemini 4 Neon.** Neon comes with Google AI Pro, Google AI Ultra and Gemini
   Enterprise, not with the Free or Plus plans ([models](https://antigravity.google/docs/models)). Sign in one of these
   ways ([authenticate](https://antigravity.google/docs/install)):
   - **Google account:** run `agy` once in a terminal and finish the browser sign-in. The CLI keeps the session in the
     OS keyring and reuses it in headless runs.
   - **Gemini API key:** set `"modelProvider": "gemini"` in `~/.gemini/antigravity-cli/settings.json` and export
     `GEMINI_API_KEY`. The key alone, without the setting, does nothing.
   - **Google Cloud ADC:** run `gcloud auth application-default login --project <project>` and export
     `AGY_ADC_AUTH=true`.

4. **Install Addy Osmani's [agent-skills](https://github.com/addyosmani/agent-skills) plugin in agy.** The review runs
   its `code-reviewer` agent, and its `security-auditor` alongside when the change crosses a trust boundary:

   ```sh
   agy plugin install https://github.com/addyosmani/agent-skills.git
   ```

5. **Check the model and the agents are there:**

   ```sh
   agy models | grep gemini-4-neon-high
   agy agents | grep -E "code-reviewer|security-auditor"
   ```

   When the model is missing, the review fails at the first call: the account has no Neon. Fix the plan or sign-in, or
   name another model from that list when you ask for the review. When the agents are missing, repeat step 4.

6. **Run `agy` once in each project** you'll review, and trust the folder when it asks, so the headless run isn't
   stopped by a prompt it can't answer.

## Use

Ask Claude for an agy, Antigravity or Gemini review, or a second-model review of the branch. A slopmaxx delivery runs it
before opening its pull request.

The skill reads the project's `docs/GIT.md` for its scratch folder and `docs/TESTING.md` for the checks to run after a
fix; slopmaxx's `bootstrap` writes both. `agy` also loads the project's own rules, `AGENTS.md` and `GEMINI.md`, like any
session it starts there.

A review takes a few minutes. `agy` has no read-only mode, so the skill compares the checkout before and after and shows
you anything the reviewer changed.
