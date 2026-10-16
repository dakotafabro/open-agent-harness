# @dakotafabrodev/agent-scaffold

Initialize any existing project repo with agent-first scaffolding.

## What it does

Scans your project and writes the files an AI agent needs to work effectively in your repo.

By default it writes one file:

- **AGENTS.md** - Agent instructions with placeholders for your conventions and working style

Optional files, added with `--with`:

- **INDEX.md** (root + per-directory, `--with=index`) - Machine-readable table of contents with tags and summaries. Including it also adds the retrieval protocol to AGENTS.md
- **.spore.yaml** (`--with=spore`) - Retrieval and memory configuration
- **.trust-state.yaml** (`--with=trust`) - Graduated autonomy levels

After a default run, the scaffold lists the optional files and the flag that adds each one.

## Usage

Run at the root of any existing project:

```bash
npx @dakotafabrodev/agent-scaffold
```

Add optional files with a comma list, or all of them:

```bash
npx @dakotafabrodev/agent-scaffold --with=index,trust
npx @dakotafabrodev/agent-scaffold --with=all
```

Or install globally:

```bash
npm install -g @dakotafabrodev/agent-scaffold
agent-scaffold
```

## Options

| Flag | Description |
|---|---|
| `--with=LIST` | Add optional files: a comma list of `index`, `spore`, `trust`, or `all` |
| `--dry-run` | Show what would be created without writing files |
| `--force` | Overwrite existing INDEX.md and config files (AGENTS.md is never overwritten) |
| `--index-only` | Only generate INDEX.md files (skip AGENTS.md, .spore.yaml, .trust-state.yaml) |
| `--depth=N` | Maximum directory depth for INDEX generation (default: 3) |

## Files created

| Run | Files |
|---|---|
| no flags | AGENTS.md |
| `--with=index` | AGENTS.md with the retrieval protocol, INDEX.md (root + per-directory) |
| `--with=spore` | AGENTS.md, .spore.yaml |
| `--with=trust` | AGENTS.md, .trust-state.yaml |
| `--with=all` | AGENTS.md with the retrieval protocol, INDEX.md files, .spore.yaml, .trust-state.yaml |
| `--index-only` | INDEX.md files only |

An existing AGENTS.md is kept as is. When index is included and the existing file has no retrieval protocol, the protocol is appended.

## How it works

1. Detects your project type from existing files (package.json, build.gradle, Cargo.toml, etc.)
2. Generates AGENTS.md with sections for project conventions and working style
3. With `--with=index`: scans the directory tree (respects common ignore patterns), generates INDEX.md files with directory maps, file categories, and inferred tags, and adds the retrieval protocol to AGENTS.md
4. With `--with=spore` or `--with=trust`: generates those config files with sensible defaults

## The retrieval protocol

When index is included, the generated AGENTS.md includes instructions that tell any AI agent to:

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
