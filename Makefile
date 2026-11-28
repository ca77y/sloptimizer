.DEFAULT_GOAL := help
PLUGINS ?= $(wildcard plugins/*/)
# The model that judges a smoke case's llm graders. The default small judge fails correct answers on their format.
JUDGE ?= opus

.PHONY: help install telemetry lint format check typecheck test smoke install-eval eval eval-grader eval-release

help: ## List targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-13s %s\n", $$1, $$2}'

install: ## Once per clone: the dev tools and the pre-commit hook
	npm ci
	git config core.hooksPath .githooks

telemetry: ## Install or restart the telemetry collector and GCS sync (docs/TELEMETRY.md)
	telemetry/install.sh

# What the pre-commit hook runs. It leaves the tests out, so a delivery can commit a failing test before its fix.
lint: typecheck ## Every static check except the tests
	npm run --silent lint:format
	npm run --silent lint:md
	npm run --silent lint:ts
	npm run --silent lint:dead
	npm run --silent lint:dup
	npm run --silent lint:pins
	claude plugin validate . --strict
	for p in $(PLUGINS); do claude plugin validate "$$p" --strict || exit 1; done

format: ## Rewrite files to the formatter's style
	npx --no-install prettier --write .

check: lint test ## Everything CI runs; no model is called

typecheck: ## Type-check scripts/, eval/ and test/
	npm run --silent typecheck

test: ## The unit tests: no model, no network
	npm run --silent test:unit

# Calls models: run only on request. Each case under eval/smoke/ starts one skill the way a user does, in a small
# project of its own, and runs it to the end; its graders judge what the skill produced. The cases are copied into a
# temporary copy of the plugin, because `claude plugin eval` reads them from inside the plugin and the plugin ships
# none. A headless session's wait for background agents is lifted, so a skill's subagents can finish. CASE runs the
# cases whose names match a glob, MODEL another model, RUNS more than one run per case, and JUDGE another judge. The results and the HTML
# report go under the ignored .eval/smoke/, and nothing is published.
smoke: ## Smoke eval of every skill, run to the end; calls models
	@work=$$(mktemp -d); trap 'rm -rf "$$work"' EXIT; \
	out=$(CURDIR)/.eval/smoke/$$(date -u +%Y%m%dT%H%M%SZ); mkdir -p "$$out"; \
	cp -R plugins/slopmaxx "$$work/slopmaxx" && cp -R eval/smoke "$$work/slopmaxx/evals" || exit 1; \
	CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0 claude plugin eval "$$work/slopmaxx" --tag smoke \
	  $(if $(CASE),--case '$(CASE)') $(if $(MODEL),--model $(MODEL)) $(if $(RUNS),--runs $(RUNS)) -j 7 \
	  --allow-tools Bash Write Edit Agent Skill WebFetch WebSearch --scaffold --ablation none --trust-plugin \
	  --judge-model $(JUDGE) --no-publish --output-dir "$$out" --report "$$out/report.html"; \
	status=$$?; echo "Results: $$out"; exit $$status

# The SWE-bench Pro comparison of the slopmaxx skills with plain Claude Code (eval/swepro/README.md). It calls
# models and runs Docker: run only on request. install-eval fetches the pinned task folders, dataset rows and task
# images into the ignored .eval/. TASKS limits a run to some tasks (a kind, `shape`, or part of an instance id), and
# ARMS to some arms; `slopmaxx@<git ref>` adds the plugin as a commit or tag has it. MODEL runs another model, RUNS runs each
# task and arm several times, JOBS sets how many arms run at once, and RUN=<run dir> resumes a stopped run.
# eval-release writes the newest run, or the runs RUN names, to eval/results/<plugin>-<version>/, which is committed.
install-eval: ## Fetch the SWE-bench Pro tasks and images, once
	node eval/swepro/main.ts install

eval: ## Full SWE-bench Pro eval, hours; calls models and runs Docker
	node eval/swepro/main.ts run

eval-grader: ## Check the eval's grader on every reference and empty patch
	node eval/swepro/main.ts grader

eval-release: ## Release the newest eval run as this version's report, in eval/results/
	node eval/swepro/main.ts release
