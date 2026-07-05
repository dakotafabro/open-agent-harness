#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const nameArg = args.find((a) => !a.startsWith('--')) || 'agent-harness-project';
const projectDir = path.resolve(process.cwd(), nameArg);

const files = {
  'README.md': '# Agent Harness Project\n\nGrowth-first collaboration harness project scaffold.\n\nWorks with Goose.\n\n## Start\n- read SETUP.md\n- optionally use AI_PROMPT.md with your agent, then review all generated changes\n- customize AGENTS.md and harness contracts\n\n## Commands\n- baseline validate: npx @dakotafabrodev/agent-harness validate\n- strict validate: npx @dakotafabrodev/agent-harness validate --strict\n- dry-run build: npx @dakotafabrodev/agent-harness run build --dry-run\n- run build: npx @dakotafabrodev/agent-harness run build\n',
  'SETUP.md': '# Setup Guide\n\n1. Edit AGENTS.md and replace routing placeholders\n2. Edit harness/policies/model-routing.yaml and set model values\n3. Edit workflows and replace command placeholders\n4. Edit context and reflection placeholders\n5. Optional: use AI_PROMPT.md with your agent\n6. Run validate, then validate --strict, then run build\n',
  'AI_PROMPT.md': '# AI Assisted Setup Prompt\n\nUse your coding agent to replace placeholders with team values.\nHuman review is required before production use.\n',
  'AGENTS.md': '# AGENTS.md\n\n## Machine policy\n- work: replace-with-your-machine-routing-policy\n- personal: replace-with-your-machine-routing-policy\n- unknown: replace-with-your-machine-routing-policy\n',
  'harness.config.yaml': 'version: 0.1\nruntime: goose\nprofile: replace-with-team-profile\ndefault_workflow: build\nrequired_validations:\n  - workflow-schema\n  - model-routing-policy\n  - required-artifacts\nartifacts:\n  summary: harness/memory/run-summary.md\n  reflection: harness/memory/reflection.md\n',
  'harness/policies/model-routing.yaml': 'version: 0.1\nmachine_policy:\n  work: replace-with-work-model\n  personal: replace-with-personal-model\n  unknown: replace-with-unknown-fallback-model\ntask_defaults:\n  implementation: repo-default\n  review: repo-default\n  docs: repo-default\nenforcement:\n  allow_only_machine_default: true\n  fail_on_ambiguous_machine: false\n',
  'harness/workflows/build.yaml': 'name: build\nphases:\n  - name: orient\n    outputs: [task-intent, scope]\n  - name: design\n    outputs: [plan, risk-check]\n  - name: implement\n    outputs: [changeset]\n  - name: verify\n    gates: [replace-with-build-gate]\n    commands: [replace-with-build-command]\n    outputs: [verification-result]\n  - name: ship-ready\n    outputs: [pr-summary, testing-strategy]\n',
  'harness/workflows/review.yaml': 'name: review\nphases:\n  - name: intent-check\n    outputs: [design-intent-summary]\n  - name: quality-check\n    gates: [replace-with-review-gate]\n    commands: [replace-with-review-command]\n    outputs: [review-findings]\n  - name: decision\n    outputs: [ready-for-rerun-or-ship]\n',
  'harness/context/project-context.md': '# Project Context\n\n- replace-with-your-domain-constraints\n- replace-with-your-architecture-boundaries\n- replace-with-your-team-conventions\n- replace-with-your-release-expectations\n',
  'harness/memory/session-log.md': '# Session Log\n\n| Date | Task | Outcome |\n|---|---|---|\n',
  'harness/memory/reflection.md': '# Reflection\n\n- replace-with-a-specific-quality-pattern-you-observed\n- replace-with-a-gate-that-prevented-rework\n- replace-with-a-pattern-to-promote-into-conventions\n'
};

if (fs.existsSync(projectDir) && fs.readdirSync(projectDir).length > 0 && !flags.has('--yes')) {
  console.error('Target directory exists and is not empty. Use --yes to continue.');
  process.exit(1);
}

fs.mkdirSync(projectDir, { recursive: true });
for (const [rel, content] of Object.entries(files)) {
  const abs = path.join(projectDir, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
}

console.log('Created project at:', projectDir);
