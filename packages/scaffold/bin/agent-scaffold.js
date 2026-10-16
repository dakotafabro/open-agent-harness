#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { detectProjectType, scanDirectoryTree, hasExistingAgentFiles } from '../lib/detect.js';
import { generateRootIndex, generateDirectoryIndex } from '../lib/generate-index.js';
import { generateAgentsMd } from '../lib/generate-agents.js';
import { generateSporeYaml, generateTrustState } from '../lib/generate-config.js';

const OPTIONAL = {
  index: 'INDEX.md (root + per-directory) and the retrieval protocol in AGENTS.md',
  spore: '.spore.yaml - retrieval and memory config',
  trust: '.trust-state.yaml - graduated autonomy levels'
};

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const projectDir = path.resolve(process.cwd());
const dryRun = flags.has('--dry-run');
const force = flags.has('--force');
const indexOnly = flags.has('--index-only');
const maxDepth = parseInt(args.find(a => a.startsWith('--depth='))?.split('=')[1] || '3', 10);

function parseWith() {
  const selected = new Set();
  for (const arg of args.filter(a => a.startsWith('--with='))) {
    for (const raw of arg.slice('--with='.length).split(',')) {
      const name = raw.trim().toLowerCase();
      if (!name) continue;
      if (name === 'all') {
        Object.keys(OPTIONAL).forEach(k => selected.add(k));
      } else if (OPTIONAL[name]) {
        selected.add(name);
      } else {
        console.error(`Unknown --with value: ${name}. Use a comma list of ${Object.keys(OPTIONAL).join(', ')}, or all.`);
        process.exit(1);
      }
    }
  }
  return selected;
}

const withSet = indexOnly ? new Set(['index']) : parseWith();
const includeIndex = withSet.has('index');

function writeFile(filePath, content) {
  const rel = path.relative(projectDir, filePath);
  if (dryRun) {
    console.log(`  [dry-run] would write: ${rel}`);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  created: ${rel}`);
}

function writeIfNotExists(filePath, content) {
  if (fs.existsSync(filePath) && !force) {
    const rel = path.relative(projectDir, filePath);
    console.log(`  skipped (exists): ${rel}`);
    return false;
  }
  writeFile(filePath, content);
  return true;
}

console.log('Agent Scaffold - Initializing agent-first repo structure\n');

const projectInfo = detectProjectType(projectDir);
console.log(`Detected project: ${projectInfo.type} (${projectInfo.language})`);
if (projectInfo.detectedFrom) {
  console.log(`  from: ${projectInfo.detectedFrom}`);
}
console.log('');

const existing = hasExistingAgentFiles(projectDir);

if (includeIndex) {
  if (existing.indexMd && !force) {
    console.log('INDEX.md already exists. Use --force to regenerate.');
    console.log('');
  }

  const tree = scanDirectoryTree(projectDir, maxDepth);
  console.log(`Scanned ${tree.length} directories (max depth: ${maxDepth})\n`);

  console.log('Generating INDEX.md files...');
  const rootIndex = generateRootIndex(projectDir, tree, projectInfo);
  writeIfNotExists(path.join(projectDir, 'INDEX.md'), rootIndex);

  for (const entry of tree) {
    if (entry.path === '' || entry.path === '.') continue;
    if (entry.depth > maxDepth) continue;
    if (entry.files.length === 0 && entry.dirs.length === 0) continue;

    const indexPath = path.join(projectDir, entry.path, 'INDEX.md');
    const content = generateDirectoryIndex(entry.path, entry, projectDir);
    writeIfNotExists(indexPath, content);
  }
  console.log('');
}

if (!indexOnly) {
  console.log('Generating agent configuration...');

  const agentsPath = path.join(projectDir, 'AGENTS.md');
  if (!existing.agentsMd) {
    writeFile(agentsPath, generateAgentsMd(projectInfo, null, { includeRetrieval: includeIndex }));
  } else {
    const existingAgentsContent = fs.readFileSync(agentsPath, 'utf8');
    if (includeIndex && !existingAgentsContent.includes('Repository Retrieval Protocol')) {
      writeFile(agentsPath, generateAgentsMd(projectInfo, existingAgentsContent, { includeRetrieval: true }));
      console.log('  (appended retrieval protocol to existing AGENTS.md)');
    } else {
      console.log('  skipped (exists): AGENTS.md');
    }
  }

  if (withSet.has('spore')) {
    writeIfNotExists(path.join(projectDir, '.spore.yaml'), generateSporeYaml(projectInfo));
  }
  if (withSet.has('trust')) {
    writeIfNotExists(path.join(projectDir, '.trust-state.yaml'), generateTrustState());
  }
  console.log('');
}

console.log('Done. Agent scaffold initialized.');
console.log('');
console.log('Next steps:');
const steps = [];
if (includeIndex) steps.push('Review generated INDEX.md files and add summaries where helpful');
if (!indexOnly) steps.push('Customize AGENTS.md with your project-specific conventions and working style');
steps.push('Commit the scaffolded files alongside your code');
if (includeIndex) steps.push('Point your agent at this repo - it will read INDEX.md first');
steps.forEach((step, i) => console.log(`  ${i + 1}. ${step}`));
console.log('');

if (!indexOnly) {
  console.log('Files included:');
  console.log('  AGENTS.md                        - Agent instructions');
  if (includeIndex) console.log('  INDEX.md (root + per-directory)  - Agent navigation');
  if (withSet.has('spore')) console.log('  .spore.yaml                      - Retrieval/memory config');
  if (withSet.has('trust')) console.log('  .trust-state.yaml                - Autonomy levels');

  const skipped = Object.keys(OPTIONAL).filter(k => !withSet.has(k));
  if (skipped.length > 0) {
    console.log('');
    console.log('Optional files (not written):');
    for (const k of skipped) console.log(`  --with=${k.padEnd(6)} ${OPTIONAL[k]}`);
    console.log('  --with=all    all of the above');
  }
}
