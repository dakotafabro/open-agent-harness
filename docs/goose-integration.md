# Goose Integration

Open Agent Harness works with Goose as a first runtime target.

## Integration model
- Harness manages contracts, policy, validation gates, and reflection artifacts
- Goose executes tasks with model and tool access
- Teams can keep existing AGENTS.md and evolve it into policy contracts

## Why Goose first
- practical runtime ergonomics
- repo-level execution flow
- extensible tool surface

## Migration path
1. keep current AGENTS.md
2. add harness contracts incrementally
3. run validate in local workflow
4. add harness checks into CI
