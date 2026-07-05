# Quickstart

## 1) Scaffold a project
- npx @dakotafabrodev/create-agent-harness my-harness
- cd my-harness

## 2) Review generated contracts
- AGENTS.md
- harness.config.yaml
- harness/policies/model-routing.yaml
- harness/workflows/build.yaml

## 3) Adapt profile to your team
Update these first:
- model routing policy
- workflow phases and gates
- validation checks
- reflection artifact format

## 4) Validate and run
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness run build

## 5) Capture evidence from first run
Record a short run log:
- what validation caught
- what changed before review
- which convention checks passed

Use:
- docs/pilot-metrics-template.md
- docs/evidence-pack.md

## 6) Keep costs low and quality high
- run validation before deep generation
- keep each run scoped to one clear goal
- reuse stable patterns through contracts, not prompt history

## Package sequence
Use the packages in this order:

1. Create a project scaffold
- npx @dakotafabrodev/create-agent-harness my-harness

2. Move into the project
- cd my-harness

3. Validate and run workflows
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness validate --strict
- npx @dakotafabrodev/agent-harness run build
