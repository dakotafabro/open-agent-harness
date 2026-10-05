#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { detectProjectType, scanDirectoryTree, hasExistingAgentFiles } from '../lib/detect.js';
import { generateRootIndex, generateDirectoryIndex } from '../lib/generate-index.js';
import { generateAgentsMd } from '../lib/generate-agents.js';
import { generateSporeYaml, generateTrustState } from '../lib/generate-config.js';

const args = process.argv.slice(2);
const flags = new Set(args.filter(a => a.startsWith('--')));
const projectDir = path.resolve(process.cwd());
const dryRun = flags.has('--dry-run');
const force = flags.has('--force');
const indexOnly = flags.has('--index-only');
const maxDepth = parseInt(args.find(a => a.startsWith('--depth='))?.split('=')[1] || '3', 10);

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

if (!indexOnly) {
  console.log('Generating agent configuration...');

  let existingAgentsContent = null;
  if (existing.agentsMd) {
    existingAgentsContent = fs.readFileSync(path.join(projectDir, 'AGENTS.md'), 'utf8');
  }
  const agentsMd = generateAgentsMd(projectInfo, existingAgentsContent);
  if (existing.agentsMd && !existingAgentsContent.includes('Repository Retrieval Protocol')) {
    writeFile(path.join(projectDir, 'AGENTS.md'), agentsMd);
    console.log('  (appended retrieval protocol to existing AGENTS.md)');
  } else if (!existing.agentsMd) {
    writeFile(path.join(projectDir, 'AGENTS.md'), agentsMd);
  } else {
    console.log('  skipped AGENTS.md (retrieval protocol already present)');
  }

  writeIfNotExists(path.join(projectDir, '.spore.yaml'), generateSporeYaml(projectInfo));
  writeIfNotExists(path.join(projectDir, '.trust-state.yaml'), generateTrustState());
  console.log('');
}

console.log('Done. Agent scaffold initialized.');
console.log('');
console.log('Next steps:');
console.log('  1. Review generated INDEX.md files and add summaries where helpful');
console.log('  2. Customize AGENTS.md with your project-specific conventions');
console.log('  3. Commit the scaffolded files alongside your code');
console.log('  4. Point your agent at this repo - it will read INDEX.md first');
console.log('');
if (!indexOnly) {
  console.log('Files created:');
  console.log('  INDEX.md (root + per-directory)  - Agent navigation');
  console.log('  AGENTS.md                        - Agent instructions');
  console.log('  .spore.yaml                      - Retrieval/memory config');
  console.log('  .trust-state.yaml                - Autonomy levels');
}
