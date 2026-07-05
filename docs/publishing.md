# Publishing Plan

## Published packages
- @dakotafabrodev/create-agent-harness
- @dakotafabrodev/agent-harness

## Install
Scaffold with:
- npx @dakotafabrodev/create-agent-harness my-harness

Optional create aliases:
- npm create @dakotafabrodev/agent-harness my-harness
- bun create @dakotafabrodev/agent-harness my-harness

## Release checklist
1. bump version in package.json
2. run scaffold smoke test
3. verify generated files contain no personal details
4. verify docs include Works with Goose
5. publish to npm with public access

## Publish commands
From each package directory:
- npm publish --access public
