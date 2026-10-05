# Site Publishing Plan

## Targets
- agent-harness.dakotafabro.dev: the project site
- aaif.dakotafabro.dev: the AAIF portfolio, which links to the project site

## Source
- The project site lives in its own repo: [`dakotafabro/agent-harness-site`](https://github.com/dakotafabro/agent-harness-site).
- The AAIF portfolio lives in [`dakotafabro/aaif-portfolio`](https://github.com/dakotafabro/aaif-portfolio).
- This repo holds the framework, packages and docs, not site source.

## Deploy flow
1. Change the site in `agent-harness-site` through a pull request.
2. Vercel builds each pull request as a preview and deploys `main` to production.
3. The production domain `agent-harness.dakotafabro.dev` is attached to the `agent-harness-site` Vercel project.

## Design system integration
Replace CSS variables in `agent-harness-site/src/styles.css` with your design system tokens.
