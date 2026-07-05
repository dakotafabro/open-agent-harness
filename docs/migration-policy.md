# Migration Policy

- Patch: docs or non-breaking fixes
- Minor: additive features
- Major: breaking scaffold/contract changes

Upgrade flow:
1. Update packages
2. Run validate
3. Run validate --strict
4. Update placeholders and workflow commands if needed
