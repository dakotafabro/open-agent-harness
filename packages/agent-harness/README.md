# @dakotafabrodev/agent-harness

CLI for validating and running growth-first harness workflows.

Commands:
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness validate --strict
- npx @dakotafabrodev/agent-harness run build
- npx @dakotafabrodev/agent-harness run build --dry-run
- npx @dakotafabrodev/agent-harness run review --phase quality-check

Validation modes:
- validate checks baseline scaffold and contract structure
- validate --strict fails until placeholders are replaced with team-specific values

Run behavior:
- parses workflow phases
- executes inline commands arrays in each phase
- fails fast on command errors with non-zero exit

Works with Goose.
