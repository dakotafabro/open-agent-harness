#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { reportOutcome } from '../lib/otel-reporter.js';

const cwd = process.cwd();
const args = process.argv.slice(2);
const cmd = args[0];

function hasFlag(flag) { return args.includes(flag); }
function getOption(name) { const i = args.indexOf(name); return i === -1 ? null : (args[i + 1] ?? null); }
function exists(rel) { return fs.existsSync(path.join(cwd, rel)); }
function read(rel) { return fs.readFileSync(path.join(cwd, rel), 'utf8'); }
async function fail(message, code = 1, meta = {}) {
  console.error(message);
  await reportOutcome({ status: 'fail', message, exitCode: code, ...meta });
  process.exit(code);
}

const requiredFiles = [
  'AGENTS.md',
  'harness.config.yaml',
  'harness/policies/model-routing.yaml',
  'harness/workflows/build.yaml',
  'harness/workflows/review.yaml',
  'harness/context/project-context.md',
  'harness/memory/reflection.md'
];

function expectContains(text, pattern, label, failures) {
  if (!pattern.test(text)) failures.push('- ' + label);
}

async function baselineValidation() {
  const missing = requiredFiles.filter((f) => !exists(f));
  if (missing.length > 0) {
    await fail('Validation failed. Missing required files:\n- ' + missing.join('\n- '), 1, { command: 'validate' });
  }

  const config = read('harness.config.yaml');
  const policy = read('harness/policies/model-routing.yaml');
  const build = read('harness/workflows/build.yaml');
  const review = read('harness/workflows/review.yaml');
  const agents = read('AGENTS.md');
  const failures = [];

  expectContains(config, /^version:\s*.+$/m, 'harness.config.yaml has version', failures);
  expectContains(config, /^runtime:\s*.+$/m, 'harness.config.yaml has runtime', failures);
  expectContains(config, /^profile:\s*.+$/m, 'harness.config.yaml has profile', failures);
  expectContains(config, /^default_workflow:\s*.+$/m, 'harness.config.yaml has default_workflow', failures);
  expectContains(config, /^required_validations:\s*$/m, 'harness.config.yaml has required_validations', failures);
  expectContains(config, /^artifacts:\s*$/m, 'harness.config.yaml has artifacts', failures);
  expectContains(config, /^\s*summary:\s*.+$/m, 'harness.config.yaml has artifacts.summary', failures);
  expectContains(config, /^\s*reflection:\s*.+$/m, 'harness.config.yaml has artifacts.reflection', failures);

  expectContains(policy, /^machine_policy:\s*$/m, 'model-routing.yaml has machine_policy', failures);
  expectContains(policy, /^\s*work:\s*.+$/m, 'model-routing.yaml has machine_policy.work', failures);
  expectContains(policy, /^\s*personal:\s*.+$/m, 'model-routing.yaml has machine_policy.personal', failures);
  expectContains(policy, /^\s*unknown:\s*.+$/m, 'model-routing.yaml has machine_policy.unknown', failures);
  expectContains(policy, /^task_defaults:\s*$/m, 'model-routing.yaml has task_defaults', failures);
  expectContains(policy, /^enforcement:\s*$/m, 'model-routing.yaml has enforcement', failures);

  expectContains(build, /^name:\s*build\s*$/m, 'build workflow has name: build', failures);
  expectContains(build, /^phases:\s*$/m, 'build workflow has phases', failures);
  expectContains(review, /^name:\s*review\s*$/m, 'review workflow has name: review', failures);
  expectContains(review, /^phases:\s*$/m, 'review workflow has phases', failures);

  if (!agents.toLowerCase().includes('machine')) failures.push('- AGENTS.md includes machine routing policy');

  if (failures.length > 0) await fail('Validation failed.\n' + failures.join('\n'), 1, { command: 'validate' });
}

async function strictValidation() {
  const markers = [
    ['harness.config.yaml', 'replace-with-team-profile'],
    ['harness/policies/model-routing.yaml', 'replace-with-work-model'],
    ['harness/policies/model-routing.yaml', 'replace-with-personal-model'],
    ['harness/policies/model-routing.yaml', 'replace-with-unknown-fallback-model'],
    ['harness/workflows/build.yaml', 'replace-with-build-command'],
    ['harness/workflows/review.yaml', 'replace-with-review-command'],
    ['harness/context/project-context.md', 'replace-with-your-domain-constraints'],
    ['AGENTS.md', 'replace-with-your-machine-routing-policy'],
    ['harness/memory/reflection.md', 'replace-with-a-specific-quality-pattern-you-observed']
  ];

  const unresolved = [];
  for (const [file, marker] of markers) {
    if (exists(file) && read(file).includes(marker)) unresolved.push('- ' + file + ': ' + marker);
  }
  if (!exists('AI_PROMPT.md')) unresolved.push('- AI_PROMPT.md missing');

  if (unresolved.length > 0) {
    await fail('Strict validation failed.\nTemplate markers still present:\n' + unresolved.join('\n') + '\n\nAction: replace template markers with team-specific values and rerun validate --strict.', 1, { command: 'validate', strict: true });
  }
}

function parseInlineArray(value) {
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '').trim();
  if (!inner) return [];
  return inner.split(',').map((s) => s.trim()).map((s) => s.replace(/^"|"$/g, '').replace(/^'|'$/g, '')).filter(Boolean);
}

function parseWorkflow(text) {
  const lines = text.split(/\r?\n/);
  const phases = [];
  let current = null;
  for (const line of lines) {
    const p = line.match(/^\s*-\s*name:\s*(.+)$/);
    if (p) { current = { name: p[1].trim(), commands: [], gates: [] }; phases.push(current); continue; }
    if (!current) continue;
    const c = line.match(/^\s*commands:\s*(\[.*\])\s*$/);
    if (c) { current.commands = parseInlineArray(c[1]); continue; }
    const g = line.match(/^\s*gates:\s*(\[.*\])\s*$/);
    if (g) { current.gates = parseInlineArray(g[1]); continue; }
  }
  return phases;
}

async function runWorkflow(name) {
  if (!name) await fail('Usage: agent-harness run <workflow> [--phase <name>] [--dry-run]', 1, { command: 'run' });
  const p = path.join(cwd, 'harness', 'workflows', name + '.yaml');
  if (!fs.existsSync(p)) await fail('Workflow not found: harness/workflows/' + name + '.yaml', 1, { command: 'run', workflow: name });

  const phaseFilter = getOption('--phase');
  const dryRun = hasFlag('--dry-run');
  const phases = parseWorkflow(read(path.join('harness', 'workflows', name + '.yaml')));
  if (phases.length === 0) await fail('Workflow parse failed. No phases found in ' + name + '.yaml', 1, { command: 'run', workflow: name });

  const selected = phaseFilter ? phases.filter((x) => x.name === phaseFilter) : phases;
  if (selected.length === 0) await fail('Requested phase not found: ' + phaseFilter, 1, { command: 'run', workflow: name });

  console.log('Running workflow: ' + name + (dryRun ? ' (dry-run)' : ''));
  for (const phase of selected) {
    console.log('- phase: ' + phase.name);
    if (phase.gates.length > 0) console.log('  gates: ' + phase.gates.join(', '));
    if (phase.commands.length > 0) {
      for (const command of phase.commands) {
        console.log('  command: ' + command);
        if (!dryRun) {
          try { execSync(command, { stdio: 'inherit', cwd }); }
          catch { await fail('Command failed in phase "' + phase.name + '": ' + command, 1, { command: 'run', workflow: name, phase: phase.name }); }
        }
      }
    }
  }
  console.log('Run complete.');
  console.log('Capture reflection in harness/memory/reflection.md');
}

if (cmd === 'validate') {
  await baselineValidation();
  const strict = hasFlag('--strict');
  if (strict) {
    await strictValidation();
    console.log('Strict validation passed.');
    console.log('Contracts are customized and ready for team use.');
  } else {
    console.log('Validation passed.');
    console.log('Contracts present and schema checks complete.');
    console.log('Tip: run agent-harness validate --strict before production use.');
  }
  await reportOutcome({ command: 'validate', status: 'pass', strict });
  process.exit(0);
}

if (cmd === 'run') {
  await runWorkflow(args[1]);
  await reportOutcome({ command: 'run', status: 'pass', workflow: args[1] });
  process.exit(0);
}

console.log('agent-harness commands:');
console.log('- validate [--strict]');
console.log('- run <workflow> [--phase <name>] [--dry-run]');
process.exit(0);
