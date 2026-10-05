# Goose Context and CLI Enforcement Model

The two-package model is intentional and paired.

- @dakotafabrodev/create-agent-harness scaffolds files Goose can use as context.
- @dakotafabrodev/agent-harness validates and runs those files as enforceable contracts.

Scaffolded files improve context quality. CLI enforcement improves operational quality.

Typical flow:
1. Scaffold once with create-agent-harness
2. Customize contracts
3. Run validate then validate --strict
4. Run workflows with agent-harness run <workflow>
5. Let Goose use the same contracts while implementing and reviewing
