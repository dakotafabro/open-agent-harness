#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const temp = path.join(root, '.tmp-harness-test');
const run = (c, cwd = root) => execSync(c, { cwd, stdio: 'pipe' });

if (fs.existsSync(temp)) fs.rmSync(temp, { recursive: true, force: true });
run('node packages/create-agent-harness/bin/create-agent-harness.js .tmp-harness-test --yes');

run('node ../packages/agent-harness/bin/agent-harness.js validate', temp);
let strictFailed = false;
try { run('node ../packages/agent-harness/bin/agent-harness.js validate --strict', temp); } catch { strictFailed = true; }
if (!strictFailed) throw new Error('strict should fail on fresh scaffold');

const repl = (file, from, to) => {
  const p = path.join(temp, file);
  fs.writeFileSync(p, fs.readFileSync(p, 'utf8').split(from).join(to), 'utf8');
};

repl('harness.config.yaml', 'replace-with-team-profile', 'mobile-team');
repl('harness/policies/model-routing.yaml', 'replace-with-your-default-model', 'claude');
repl('harness/workflows/build.yaml', 'replace-with-build-gate', 'lint');
repl('harness/workflows/build.yaml', 'replace-with-build-command', 'echo build-check');
repl('harness/workflows/review.yaml', 'replace-with-review-gate', 'tests');
repl('harness/workflows/review.yaml', 'replace-with-review-command', 'echo review-check');
repl('harness/context/project-context.md', 'replace-with-your-domain-constraints', 'consumer app constraints');
repl('harness/context/project-context.md', 'replace-with-your-architecture-boundaries', 'ui-domain-data layering');
repl('harness/context/project-context.md', 'replace-with-your-team-conventions', 'naming and PR standards');
repl('harness/context/project-context.md', 'replace-with-your-release-expectations', 'green CI before merge');
repl('AGENTS.md', 'replace-with-your-default-model', 'claude');
repl('harness/memory/reflection.md', 'replace-with-a-specific-quality-pattern-you-observed', 'lint gate prevented style drift');
repl('harness/memory/reflection.md', 'replace-with-a-gate-that-prevented-rework', 'verify gate prevented broken merge');
repl('harness/memory/reflection.md', 'replace-with-a-pattern-to-promote-into-conventions', 'phase outputs declared early');

run('node ../packages/agent-harness/bin/agent-harness.js validate --strict', temp);
const policyPath = path.join(temp, 'harness/policies/model-routing.yaml');
const policyOriginal = fs.readFileSync(policyPath, 'utf8');
const policyTail = 'task_defaults:\n  implementation: repo-default\nenforcement:\n  allow_only_machine_default: true\n';
const policyCases = [
  ['named profiles with unknown fallback', 'version: 0.1\nmachine_policy:\n  work: claude\n  personal: codex\n  unknown: claude\n' + policyTail, true],
  ['default fallback only', 'version: 0.1\nmachine_policy:\n  default: claude\n' + policyTail, true],
  ['named profiles without fallback', 'version: 0.1\nmachine_policy:\n  ci: claude\n  local: codex\n' + policyTail, false],
  ['empty machine_policy', 'version: 0.1\nmachine_policy:\n' + policyTail, false]
];
for (const [label, content, shouldPass] of policyCases) {
  fs.writeFileSync(policyPath, content, 'utf8');
  let passed = true;
  try { run('node ../packages/agent-harness/bin/agent-harness.js validate --strict', temp); } catch { passed = false; }
  if (passed !== shouldPass) throw new Error('policy case "' + label + '" expected ' + (shouldPass ? 'pass' : 'fail'));
}
fs.writeFileSync(policyPath, policyOriginal, 'utf8');

run('node ../packages/agent-harness/bin/agent-harness.js run build --dry-run', temp);
run('node ../packages/agent-harness/bin/agent-harness.js run build', temp);

fs.rmSync(temp, { recursive: true, force: true });
console.log('smoke-test:pass');
