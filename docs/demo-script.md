# 5-Minute Demo Script

Use this script for a short live walkthrough.

## Goal
Show that Open Agent Harness gives teams a reusable quality frame that works with Goose and improves collaboration maturity over time.

## Minute 0 to 1 - Positioning
Say:
- Open Agent Harness is growth-first.
- It optimizes for collaboration maturity, quality consistency, and cost-aware execution.
- It works with Goose.

Show:
- README.md
- docs/index.md

## Minute 1 to 2 - Scaffold
Run:
- npx @dakotafabrodev/create-agent-harness demo-harness
- cd demo-harness

Show generated files:
- AGENTS.md
- harness.config.yaml
- harness/policies/model-routing.yaml
- harness/workflows/build.yaml

## Minute 2 to 3 - Validate and run
Run:
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness run build

Narrate:
- validation catches drift early
- workflows enforce phase and gate structure
- reflection supports learning loops

## Minute 3 to 4 - Team adaptation
Open and explain where teams customize:
- AGENTS.md for routing policy
- workflows for team gates and output contracts
- context and memory files for reusable learning

Message:
- framework stays stable
- profile is team-owned

## Minute 4 to 5 - Outcome and close
Close with:
- fewer avoidable CI failures through early checks
- stronger convention adherence
- improved quality and cost over time
- growth in collaboration maturity, not only output volume

Call to action:
- pilot in one repo for two weeks
- track quality and cost signals
- promote stable patterns into contracts
