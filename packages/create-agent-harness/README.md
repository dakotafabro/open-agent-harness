# @dakotafabrodev/create-agent-harness

Scaffold a growth-first, Goose-compatible agent harness project.

What this package gives you:
- opinionated project scaffold with team-owned contracts
- SETUP.md with a clear customization sequence
- AI_PROMPT.md for optional agent-assisted setup
- placeholder markers that pair with strict validation

Install and scaffold:
- npx @dakotafabrodev/create-agent-harness my-harness
- npm create @dakotafabrodev/agent-harness my-harness
- bun create @dakotafabrodev/agent-harness my-harness

Generated contracts:
- AGENTS.md
- harness.config.yaml
- harness/policies/model-routing.yaml
- harness/workflows/build.yaml
- harness/workflows/review.yaml
- harness/context/project-context.md
- harness/memory/session-log.md
- harness/memory/reflection.md

Works with Goose.

Important: AI-assisted setup should always be reviewed by a human before production use.
