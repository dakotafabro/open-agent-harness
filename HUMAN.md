# Open Agent Harness - what changes for you

Open Agent Harness is a frame for working with an agent, not a workflow someone else wrote for you. It scaffolds a project of "contracts" your agent can read, and ships a CLI that checks and runs them.

## What it does for you, and to the agent

- `npx @dakotafabrodev/create-agent-harness my-harness` scaffolds a new harness project, once.
- `npx @dakotafabrodev/agent-harness validate` checks the structure. `--strict` also checks that placeholders were replaced.
- `run <phase>` executes the commands in a workflow phase. `--dry-run` shows them first.

The agent reads the contracts you fill in, so its behavior follows them. The README says it optimizes for growth, quality and cost awareness, not raw throughput.

## When to use it

When you or a team want shared, checkable rules for how the agent works. Skip it if you already have a working AGENTS.md setup and don't want a second scaffold.

## Reserved for human judgment

The framework ships no personal workflow. Your profile, tools and conventions are yours to define, and the contracts only say what you put in them.

## What it reads, writes and sends

- Writes a new project directory when you scaffold.
- `run` executes the commands listed in your workflow phases, so it can do anything those commands do. Read a phase before running it, or use `--dry-run`.
- Network use beyond fetching the npm packages: not documented.

## Cost

About 450 tokens of context (`token_cost` in bpm.json).

## Check it's working

Run `npx @dakotafabrodev/agent-harness validate --strict` in your harness. It should pass once placeholders are filled in.

## Turn it off

`bpm remove open-agent-harness`. A scaffolded project stays where you created it.
