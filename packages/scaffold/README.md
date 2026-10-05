# @dakotafabrodev/agent-scaffold

Initialize any existing project repo with agent-first scaffolding.

## What it does

Scans your project's file tree and generates the files an AI agent needs to navigate and work effectively in your repo:

- **INDEX.md** (root + per-directory) - Machine-readable table of contents with tags and summaries
- **AGENTS.md** - Behavioral instructions with retrieval protocol
- **.spore.yaml** - Retrieval and memory configuration
- **.trust-state.yaml** - Graduated autonomy levels

## Usage

Run at the root of any existing project:

```bash
npx @dakotafabrodev/agent-scaffold
```

Or install globally:

```bash
npm install -g @dakotafabrodev/agent-scaffold
agent-scaffold
```

## Options

| Flag | Description |
|---|---|
| `--dry-run` | Show what would be created without writing files |
| `--force` | Overwrite existing INDEX.md and config files |
| `--index-only` | Only generate INDEX.md files (skip AGENTS.md, .spore.yaml, .trust-state.yaml) |
| `--depth=N` | Maximum directory depth for INDEX generation (default: 3) |

## How it works

1. Detects your project type from existing files (package.json, build.gradle, Cargo.toml, etc.)
2. Scans the directory tree (respects common ignore patterns)
3. Generates INDEX.md files with directory maps, file categories, and inferred tags
4. Generates AGENTS.md with the retrieval protocol that activates the INDEX system
5. Generates config files with sensible defaults

## The retrieval protocol

The generated AGENTS.md includes instructions that tell any AI agent to:

1. Read INDEX.md (root) first for the directory map
2. Scan relevant directory INDEX files based on task context
3. Open full documents only when the INDEX summary confirms relevance
4. Never skip INDEX files - they prevent unnecessary full-doc reads

This pattern reduces context window usage and improves agent navigation accuracy.

## Guardrails

All scaffolded files include a visible comment:

```
AGENT SCAFFOLD: Default instructions below ensure baseline agent behavior.
Adding your own rules and conventions is encouraged.
Removing or altering default instructions may cause unexpected agent behavior.
Rule: safe to add, not safe to remove.
```

You can extend the defaults with your own project-specific rules. Do not remove the defaults.

## Works with

- Goose
- Claude Code (AGENTS.md compatible)
- Codex (AGENTS.md compatible)
- Cursor
- Any agent that reads AGENTS.md or directory hint files

## Part of Open Agent Harness

This package is the scaffold module of the Open Agent Harness framework.
