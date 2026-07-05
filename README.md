# Open Agent Harness

Open Agent Harness is a growth-first framework for human and AI collaboration quality.

Works with Goose.

## What it optimizes for
- collaboration maturity
- developmental growth while building
- quality consistency and convention adherence
- cost-aware execution
- reasoning traceability and reflection

Open Agent Harness is not primarily a raw throughput optimizer.

## Install
Primary scaffold command:
- npx @dakotafabrodev/create-agent-harness my-harness

Optional create aliases:
- npm create @dakotafabrodev/agent-harness my-harness
- bun create @dakotafabrodev/agent-harness my-harness

## Documentation map
- docs/index.md
- docs/quickstart.md
- docs/concepts.md
- docs/architecture.md
- docs/maturity-model.md
- docs/cost-quality-strategy.md
- docs/cli-reference.md
- docs/team-adoption.md
- docs/evidence-pack.md
- docs/pilot-metrics-template.md
- docs/goose-integration.md
- docs/faq.md
- docs/troubleshooting.md
- docs/contributing.md
- docs/aaif-alignment.md
- docs/aaif-submission-draft.md
- docs/launch.md
- docs/publishing.md
- docs/demo-script.md

## Design boundary
The framework provides a reusable frame. It does not ship a personal workflow. Teams define their own profile, tools, and conventions.

## Package model
There are two npm packages and they are designed to work together.

- @dakotafabrodev/create-agent-harness
  - Purpose: scaffold a new harness project
  - Usage stage: one-time project setup

- @dakotafabrodev/agent-harness
  - Purpose: validate and run workflows inside an existing scaffold
  - Usage stage: ongoing daily use

Typical flow:
1. Scaffold once with create-agent-harness
2. Customize contracts
3. Run validate and run commands with agent-harness
