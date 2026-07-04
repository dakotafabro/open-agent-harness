#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const nameArg = args.find((a) => !a.startsWith('--')) || 'agent-harness-project';
const projectDir = path.resolve(process.cwd(), nameArg);

const files = {
  'package.json': [
    '{',
    '  "name": "agent-harness-project",',
    '  "private": true,',
    '  "scripts": {',
    '    "harness:validate": "npx agent-harness validate",',
    '    "harness:run": "npx agent-harness run build"',
    '  }',
    '}',
  ].join('\n'),
  'README.md': [
    '# Agent Harness Project',
    '',
    'Growth-first collaboration harness project scaffold.',
    '',
    'Works with Goose.',
    '',
    '## Start',
    '- review AGENTS.md',
    '- review harness.config.yaml',
    '- adapt policies and workflows to your team profile',
    '',
    '## Commands',
    '- validate: npx agent-harness validate',
    '- run build: npx agent-harness run build'
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
    '## Constraint',
    'This file should stay generic and team-owned. Do not encode personal workflow details.'
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
console.log('2) Review AGENTS.md and harness config');
console.log('3) Tailor workflows and policies to your team profile');
