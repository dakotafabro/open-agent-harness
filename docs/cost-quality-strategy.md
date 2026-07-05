# Cost and Quality Strategy

## Principle
Lower cost should come from better structure and fewer retries, not weaker quality standards.

## Cost controls
- pre-run validation to catch misconfiguration early
- scoped workflows to avoid broad generation passes
- profile defaults to reduce routing uncertainty
- reusable contracts to reduce repeated prompt overhead

## Quality controls
- explicit gates for lint, tests, and conventions
- phase outputs that improve traceability
- reflection artifacts that feed convention updates

## Practical operating rule
Run smaller, validated steps with clear gates. This usually improves both quality and cost over time.
