# Publishing Plan

## Package to publish
- create-agent-harness

## Naming
Use package name: create-agent-harness

## npm publish
1. cd packages/create-agent-harness
2. npm login
3. npm version patch
4. npm publish --access public

## bun compatibility
Bun can consume npm packages directly.

Install:
- bun create @dakotafabrodev/agent-harness my-harness

If needed, also validate with:
- bunx @dakotafabrodev/create-agent-harness my-harness

## Release checklist
- update version
- run scaffold smoke test
- verify generated files contain no personal details
- verify README includes Works with Goose
- publish
