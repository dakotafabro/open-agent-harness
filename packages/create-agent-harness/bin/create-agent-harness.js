#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const nameArg = args.find((a) => !a.startsWith('--')) || 'agent-harness-project';
const projectDir = path.resolve(process.cwd(), nameArg);

const files = {
  'README.md': [
    '# Agent Harness Project',
    '',
    'Growth-first collaboration harness project scaffold.',
    '',
    'Works with Goose.',
    '',
    '## Start',
    '- read SETUP.md',
    '- review AGENTS.md',
    '- review harness.config.yaml',
    '- adapt policies and workflows to your team profile',
    '',
    '## Commands',
    '- validate: npx @dakotafabrodev/agent-harness validate',
    '- run build: npx @dakotafabrodev/agent-harness run build'
  ].join('\n'),
  'SETUP.md': [
    '# Setup Guide',
    '',
    'Use this order to customize the scaffold for your team.',
    '',
    '1. Edit AGENTS.md',
    '- set machine routing defaults',
    '- confirm safe fallback behavior',
    '',
    '2. Edit harness/policies/model-routing.yaml',
    '- map environments to preferred model providers',
    '- keep unknown fallback strict and safe',
    '',
    '3. Edit harness/workflows/build.yaml and review.yaml',
    '- update phases to match your delivery flow',
    '- define gates that reflect your quality standards',
    '',
    '4. Edit harness/context/project-context.md',
    '- define architecture boundaries and release requirements',
    '',
    '5. Run commands',
    '- npx @dakotafabrodev/agent-harness validate',
    '- npx @dakotafabrodev/agent-harness run build',
    '',
    '6. Capture reflection',
    '- record what improved quality and what should be promoted to conventions'
  ].join('\n'),
  'AGENTS.md': [
    '# AGENTS.md',
    '',
    '## Purpose',
    'Define machine-aware model routing and safety defaults.',
    '',
    '## Machine policy',
    '- work: claude',
    '- personal: codex',
    '- unknown: claude',
    '',
    '## Routing policy',
    '- use repo defaults for implementation, docs, and review',
    '- validate before deep generation',
    '- fail safe to work policy on ambiguity',
    '',
    '## Customize this file',
    '- replace defaults with your team routing policy',
    '- keep this file generic and team-owned',
    '- do not encode personal workflow details'
  ].join('\n'),
  'harness.config.yaml': [
    'version: 0.1',
    'runtime: goose',
    'profile: team-default',
    'default_workflow: build',
    'required_validations:',
    '  - workflow-schema',
    '  - model-routing-policy',
    '  - required-artifacts',
    'artifacts:',
    '  summary: harness/memory/run-summary.md',
    '  reflection: harness/memory/reflection.md'
  ].join('\n'),
  'harness/README.md': [
    '# Harness Folder',
    '',
    'This directory holds contracts your team customizes.',
    '',
    '## What to edit first',
    '- policies/model-routing.yaml',
    '- workflows/build.yaml',
    '- workflows/review.yaml',
    '- context/project-context.md',
    '',
    '## Validation flow',
    '- run validate after changes',
    '- run a workflow after validation passes',
    '',
    '## Goal',
    'Keep behavior explicit, reviewable, and reusable.'
  ].join('\n'),
  'harness/policies/README.md': [
    '# Policies',
    '',
    'Define safe, explicit model routing behavior.',
    '',
    '## model-routing.yaml guidance',
    '- set machine policies for work, personal, and unknown',
    '- set task defaults that match your team operating model',
    '- keep ambiguous cases safe by default',
    '',
    '## Validation checks',
    '- values are valid and intentional',
    '- fallback behavior is defined',
    '- policy reflects team environment constraints'
  ].join('\n'),
  'harness/workflows/README.md': [
    '# Workflows',
    '',
    'Define phase-based execution and quality gates.',
    '',
    '## Editing guidance',
    '- each phase should have clear outputs',
    '- verify phase should include quality gates',
    '- keep workflows scoped and readable',
    '',
    '## Recommended minimum gates',
    '- lint',
    '- tests',
    '- conventions'
  ].join('\n'),
  'harness/context/README.md': [
    '# Context',
    '',
    'Store high-signal context for reliable execution.',
    '',
    '## Include',
    '- architecture boundaries',
    '- domain constraints',
    '- team conventions',
    '- release expectations',
    '',
    '## Keep out',
    '- temporary notes that should live in memory logs',
    '- personal workflow details that are not team standards'
  ].join('\n'),
  'harness/memory/README.md': [
    '# Memory',
    '',
    'Capture execution outcomes and reflection signals.',
    '',
    '## session-log.md',
    '- track date, task, and outcome',
    '',
    '## reflection.md',
    '- record what improved quality',
    '- record what prevented rework',
    '- record what should be promoted into conventions'
  ].join('\n'),
  'harness/policies/model-routing.yaml': [
    'version: 0.1',
    'machine_policy:',
    '  work: claude',
    '  personal: codex',
    '  unknown: claude',
    'task_defaults:',
    '  implementation: repo-default',
    '  review: repo-default',
    '  docs: repo-default',
    'enforcement:',
    '  allow_only_machine_default: true',
    '  fail_on_ambiguous_machine: false'
  ].join('\n'),
  'harness/workflows/build.yaml': [
    'name: build',
    'phases:',
    '  - name: orient',
    '    outputs: [task-intent, scope]',
    '  - name: design',
    '    outputs: [plan, risk-check]',
    '  - name: implement',
    '    outputs: [changeset]',
    '  - name: verify',
    '    gates: [lint, tests, conventions]',
    '    outputs: [verification-result]',
    '  - name: ship-ready',
    '    outputs: [pr-summary, testing-strategy]'
  ].join('\n'),
  'harness/workflows/review.yaml': [
    'name: review',
    'phases:',
    '  - name: intent-check',
    '    outputs: [design-intent-summary]',
    '  - name: quality-check',
    '    gates: [tests, conventions, readability]',
    '    outputs: [review-findings]',
    '  - name: decision',
    '    outputs: [ready-for-rerun-or-ship]'
  ].join('\n'),
  'harness/context/project-context.md': [
    '# Project Context',
    '',
    'Capture high-signal context needed for consistent execution.',
    '',
    '- domain constraints',
    '- architecture boundaries',
    '- team conventions',
    '- release expectations'
  ].join('\n'),
  'harness/memory/session-log.md': [
    '# Session Log',
    '',
    '| Date | Task | Outcome |',
    '|---|---|---|'
  ].join('\n'),
  'harness/memory/reflection.md': [
    '# Reflection',
    '',
    '- What improved collaboration quality',
    '- What gate prevented rework',
    '- What should be promoted into conventions'
  ].join('\n')
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
console.log('Next steps:');
console.log('1) cd', projectDir);
console.log('2) Read SETUP.md');
console.log('3) Tailor AGENTS and harness contracts to your team profile');
console.log('4) Run: npx @dakotafabrodev/agent-harness validate');
