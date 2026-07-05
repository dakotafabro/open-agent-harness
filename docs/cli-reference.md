# CLI Reference

## @dakotafabrodev/create-agent-harness
- npx @dakotafabrodev/create-agent-harness my-harness

## @dakotafabrodev/agent-harness
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness validate --strict
- npx @dakotafabrodev/agent-harness run build
- npx @dakotafabrodev/agent-harness run build --dry-run
- npx @dakotafabrodev/agent-harness run review --phase quality-check

Validate checks structure. Strict checks placeholder replacement. Run executes commands in workflow phases.

## Two-package model
- @dakotafabrodev/create-agent-harness is the scaffold package.
- @dakotafabrodev/agent-harness is the operations package.

They work together in sequence: scaffold first, then validate and run.
