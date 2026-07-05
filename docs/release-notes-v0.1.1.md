# Release Notes - v0.1.1

## Highlights
- Added guided scaffold onboarding for user customization.
- Added SETUP.md to generated projects.
- Added README guidance in harness folders:
  - harness/README.md
  - harness/policies/README.md
  - harness/workflows/README.md
  - harness/context/README.md
  - harness/memory/README.md

## Why this release
This update improves first-run clarity and helps teams customize contracts correctly without embedding personal workflow details.

## Packages
- @dakotafabrodev/create-agent-harness@0.1.1
- @dakotafabrodev/agent-harness@0.1.1

## Publish commands
cd packages/create-agent-harness
npm publish --access public

cd ../agent-harness
npm publish --access public
