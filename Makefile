.DEFAULT_GOAL := help
.PHONY: help check validate

help: ## List targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  %-10s %s\n", $$1, $$2}'

check: validate ## Everything CI runs

validate: ## Validate the marketplace, plugins and skill discovery
	./scripts/validate.sh
