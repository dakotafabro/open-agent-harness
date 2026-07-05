# Architecture

## Layers
Application
-> Team Profile
-> Harness Contracts
-> Runtime Adapter
-> Runtime (Goose)
-> Model Provider

## Contracts in v0.1
- AGENTS.md for routing and safety defaults
- harness.config.yaml for runtime and validation profile
- policies/model-routing.yaml for machine-aware model selection
- workflows/*.yaml for phase structure and gates
- memory/*.md for reflection and longitudinal learning

## Execution lifecycle
1. load profile
2. resolve machine policy
3. select workflow
4. execute phase-by-phase
5. validate gates
6. capture reflection

## Portability model
The framework remains stable while profiles vary by repo, team, and domain.
