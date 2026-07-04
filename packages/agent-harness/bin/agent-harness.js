#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const cwd = process.cwd();
const args = process.argv.slice(2);
const cmd = args[0];
const sub = args[1];

const requiredFiles = [
  'AGENTS.md',
  'harness.config.yaml',
  'harness/policies/model-routing.yaml'
];

function exists(rel) {
  return fs.existsSync(path.join(cwd, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(cwd, rel), 'utf8');
}

function fail(message, code = 1) {
  console.error(message);
  process.exit(code);
}

function validate() {
  const missing = requiredFiles.filter((f) => !exists(f));
  if (missing.length > 0) {
    fail('Validation failed. Missing required files:\n- ' + missing.join('\n- '));
  }

  const config = read('harness.config.yaml');
  const policy = read('harness/policies/model-routing.yaml');
  const agents = read('AGENTS.md');

  const checks = [
    { ok: config.includes('runtime:'), label: 'harness.config.yaml has runtime' },
    { ok: config.includes('default_workflow:'), label: 'harness.config.yaml has default_workflow' },
    { ok: policy.includes('machine_policy:'), label: 'model-routing.yaml has machine_policy' },
    { ok: agents.toLowerCase().includes('machine'), label: 'AGENTS.md includes machine routing policy' }
  ];

  const failed = checks.filter((c) => !c.ok);
  if (failed.length > 0) {
    fail('Validation failed.\n' + failed.map((f) => '- ' + f.label).join('\n'));
  }

  console.log('Validation passed.');
  console.log('Contracts present and baseline checks complete.');
}

function runWorkflow(name) {
  if (!name) fail('Usage: agent-harness run <workflow>');
  const workflowPath = path.join(cwd, 'harness', 'workflows', name + '.yaml');
  if (!fs.existsSync(workflowPath)) {
    fail('Workflow not found: harness/workflows/' + name + '.yaml');
  }

  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const phaseMatches = Array.from(workflow.matchAll(/^\s*-\s*name:\s*(.+)$/gm)).map((m) => m[1].trim());

  console.log('Running workflow: ' + name);
  if (phaseMatches.length === 0) {
    console.log('No explicit phases found.');
  } else {
    for (const phase of phaseMatches) {
      console.log('- phase: ' + phase);
    }
  }

  console.log('Run complete.');
  console.log('Capture reflection in harness/memory/reflection.md');
}

if (cmd === 'validate') {
  validate();
  process.exit(0);
}

if (cmd === 'run') {
  runWorkflow(sub);
  process.exit(0);
}

console.log('agent-harness commands:');
console.log('- validate');
console.log('- run <workflow>');
process.exit(0);
