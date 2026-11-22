.DEFAULT_GOAL := help
PLUGINS ?= $(wildcard plugins/*/)

.PHONY: help install lint format check discovery typecheck test smoke install-eval eval eval-grader

help: ## List targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-13s %s\n", $$1, $$2}'

install: ## Once per clone: the dev tools and the pre-commit hook
	npm ci
	git config core.hooksPath .githooks

# What the pre-commit hook runs. It leaves the tests out, so a delivery can commit a failing test before its fix.
lint: typecheck ## Every static check except the tests
	npm run --silent lint:format
	npm run --silent lint:md
	npm run --silent lint:ts
	npm run --silent lint:dead
	npm run --silent lint:dup
	npm run --silent lint:pins
	claude plugin validate .
	for p in $(PLUGINS); do claude plugin validate "$$p" || exit 1; done

format: ## Rewrite files to the formatter's style
	npx --no-install prettier --write .

check: lint discovery test ## Everything CI runs; no model is called

discovery: ## Check that npx skills finds every skill
	npx -y skills@latest add . --list

typecheck: ## Type-check scripts/ and test/
	npm run --silent typecheck

test: ## The unit tests: no model, no network
	npm run --silent test:unit

# Calls models: run only on request. Each case checks that its skill starts and reaches its first milestones within
# ten minutes, and all cases run at once, so the whole run takes about ten minutes. A headless session's wait for
# background agents is lifted, so a skill's subagents can finish. The terminal output is the result: the CLI's result
# file and HTML report go to a temporary folder deleted on exit, and nothing is published.
smoke: ## Smoke evals, about ten minutes; calls models
	@out=$$(mktemp -d); trap 'rm -rf "$$out"' EXIT; \
	for p in $(PLUGINS); do \
	  CLAUDE_CODE_PRINT_BG_WAIT_CEILING_MS=0 claude plugin eval "$$p" --tag smoke -j 7 --allow-tools Bash Write Edit Agent Skill WebFetch WebSearch --scaffold --ablation none --trust-plugin --no-publish --output-dir "$$out/results" --report "$$out/report.html" || exit 1; \
	done

# The SWE-bench Pro comparison of the more-slop skills with plain Claude Code (scripts/swepro/README.md). It calls
# models and runs Docker: run only on request. install-eval fetches the pinned task folders, dataset rows and task
# images into the ignored .eval/. TASKS limits a run to some tasks (a kind, `shape`, or part of an instance id), ARMS
# to one arm, JOBS sets how many arms run at once, and RUN=<run dir> resumes a stopped run.
install-eval: ## Fetch the SWE-bench Pro tasks and images, once
	node scripts/swepro/main.ts install

eval: ## Full SWE-bench Pro eval, hours; calls models and runs Docker
	node scripts/swepro/main.ts run

eval-grader: ## Check the eval's grader on every reference and empty patch
	node scripts/swepro/main.ts grader
