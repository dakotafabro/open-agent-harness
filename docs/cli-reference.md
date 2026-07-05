# CLI Reference

## @dakotafabrodev/create-agent-harness
Scaffold a new harness project.

### Usage
- npx @dakotafabrodev/create-agent-harness my-harness

### Output
Creates:
- AGENTS.md
- harness.config.yaml
- harness/policies/model-routing.yaml
- harness/workflows/build.yaml
- harness/workflows/review.yaml
- harness/context/project-context.md
- harness/memory/session-log.md
- harness/memory/reflection.md

## @dakotafabrodev/agent-harness
Run and validate workflows in an initialized project.

### Usage
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness run build
- npx @dakotafabrodev/agent-harness run review

### Exit behavior
- non-zero exit on invalid config or unknown workflow
- zero exit on valid config and successful command execution

### Evidence guidance
For submission-quality artifacts, pair CLI output with:
- one run summary
- one prevented rework example
- one metrics snapshot from docs/pilot-metrics-template.md
