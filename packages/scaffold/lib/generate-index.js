import fs from 'node:fs';
import path from 'node:path';

const GUARDRAIL = `<!-- AGENT SCAFFOLD: Default instructions below ensure baseline agent behavior.
     Adding your own rules and conventions is encouraged.
     Removing or altering default instructions may cause unexpected agent behavior.
     Rule: safe to add, not safe to remove. -->

`;

const CODE_EXTENSIONS = new Set([
  '.js', '.ts', '.jsx', '.tsx', '.kt', '.kts', '.java', '.swift',
  '.py', '.rs', '.go', '.rb', '.c', '.cpp', '.h', '.hpp', '.cs',
  '.vue', '.svelte', '.dart', '.scala', '.clj',
]);

const DOC_EXTENSIONS = new Set([
  '.md', '.mdx', '.txt', '.yaml', '.yml', '.toml', '.json',
]);

function categorizeFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (CODE_EXTENSIONS.has(ext)) return 'code';
  if (DOC_EXTENSIONS.has(ext)) return 'config/docs';
  if (filename.startsWith('.')) return 'config/docs';
  return 'other';
}

function inferTags(dirPath, files) {
  const tags = [];
  const dirName = path.basename(dirPath) || 'root';

  if (files.some(f => f.endsWith('.test.ts') || f.endsWith('.test.js') || f.endsWith('Test.kt'))) {
    tags.push('#test');
  }
  if (dirName === 'src' || dirName === 'lib') tags.push('#source');
  if (dirName === 'test' || dirName === 'tests' || dirName === '__tests__') tags.push('#test');
  if (dirName === 'docs' || dirName === 'documentation') tags.push('#docs');
  if (dirName === 'scripts') tags.push('#automation');
  if (dirName === 'config' || dirName === 'configs') tags.push('#config');
  if (dirName === 'components') tags.push('#ui');
  if (dirName === 'api' || dirName === 'routes') tags.push('#api');
  if (dirName === 'models' || dirName === 'domain') tags.push('#domain');
  if (dirName === 'utils' || dirName === 'helpers') tags.push('#utility');

  if (tags.length === 0) tags.push(`#${dirName.toLowerCase()}`);
  return tags;
}

export function generateRootIndex(projectDir, tree, projectInfo) {
  const rootEntry = tree.find(t => t.path === '.');
  if (!rootEntry) return '';

  const lines = [GUARDRAIL];
  lines.push('# Repository Index\n');
  lines.push('Quick-lookup manifest for agent navigation. Read this first, then scan directory INDEX files for detailed contents.\n');
  lines.push(`**Project type:** ${projectInfo.type} (${projectInfo.language})\n`);
  lines.push('## Directory Map\n');
  lines.push('| Directory | Tags | What lives here | When to consult |');
  lines.push('|---|---|---|---|');

  for (const dir of rootEntry.dirs) {
    const dirEntry = tree.find(t => t.path === dir);
    const files = dirEntry ? dirEntry.files : [];
    const tags = inferTags(dir, files);
    const fileCount = files.length;
    const subDirs = dirEntry ? dirEntry.dirs.length : 0;

    let description = `${fileCount} files`;
    if (subDirs > 0) description += `, ${subDirs} subdirectories`;

    let consult = 'When working in this area';
    if (tags.includes('#test')) consult = 'When writing or running tests';
    if (tags.includes('#docs')) consult = 'When looking for documentation';
    if (tags.includes('#config')) consult = 'When changing configuration';
    if (tags.includes('#api')) consult = 'When modifying API surface';
    if (tags.includes('#source')) consult = 'When implementing features or fixing bugs';
    if (tags.includes('#utility')) consult = 'When needing shared helpers or utilities';
    if (tags.includes('#domain')) consult = 'When working with business logic or data models';

    lines.push(`| \`${dir}/\` | ${tags.join(' ')} | ${description} | ${consult} |`);
  }

  lines.push('');
  lines.push('## Key Files (root)\n');
  lines.push('| File | Category | Purpose |');
  lines.push('|---|---|---|');

  for (const file of rootEntry.files) {
    const category = categorizeFile(file);
    let purpose = '';
    if (file === 'README.md') purpose = 'Project overview and setup instructions';
    else if (file === 'package.json') purpose = 'Node.js dependencies and scripts';
    else if (file === 'build.gradle' || file === 'build.gradle.kts') purpose = 'Build configuration';
    else if (file === 'tsconfig.json') purpose = 'TypeScript configuration';
    else if (file === 'Cargo.toml') purpose = 'Rust dependencies and build config';
    else if (file === 'go.mod') purpose = 'Go module definition';
    else if (file === 'pyproject.toml') purpose = 'Python project configuration';
    else purpose = category;

    lines.push(`| \`${file}\` | ${category} | ${purpose} |`);
  }

  lines.push('');
  lines.push('## Retrieval Protocol\n');
  lines.push('1. Agent reads this INDEX first (always)');
  lines.push('2. Based on task context, scan relevant directory INDEX files');
  lines.push('3. Open full documents only when the INDEX summary confirms relevance');
  lines.push('4. Do not skip INDEX files - they prevent unnecessary full-doc reads');
  lines.push('');

  return lines.join('\n');
}

export function generateDirectoryIndex(dirPath, dirEntry, projectDir) {
  const dirName = path.basename(dirPath) || 'root';
  const tags = inferTags(dirPath, dirEntry.files);

  const lines = [GUARDRAIL];
  lines.push(`# \`${dirPath}/\` Index\n`);
  lines.push(`Tags: ${tags.join(' ')}\n`);

  if (dirEntry.files.length > 0) {
    lines.push('## Files\n');
    lines.push('| File | Category | Summary |');
    lines.push('|---|---|---|');

    for (const file of dirEntry.files) {
      const category = categorizeFile(file);
      lines.push(`| \`${file}\` | ${category} | |`);
    }
    lines.push('');
  }

  if (dirEntry.dirs.length > 0) {
    lines.push('## Subdirectories\n');
    lines.push('| Directory | Tags |');
    lines.push('|---|---|');

    for (const sub of dirEntry.dirs) {
      const subPath = `${dirPath}/${sub}`;
      const subTags = inferTags(subPath, []);
      lines.push(`| \`${sub}/\` | ${subTags.join(' ')} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
