import fs from 'node:fs';
import path from 'node:path';

const PROJECT_SIGNATURES = [
  { file: 'build.gradle', type: 'android', language: 'kotlin' },
  { file: 'build.gradle.kts', type: 'android', language: 'kotlin' },
  { file: 'Package.swift', type: 'ios', language: 'swift' },
  { file: 'Podfile', type: 'ios', language: 'swift' },
  { file: 'Cargo.toml', type: 'rust', language: 'rust' },
  { file: 'go.mod', type: 'go', language: 'go' },
  { file: 'pyproject.toml', type: 'python', language: 'python' },
  { file: 'setup.py', type: 'python', language: 'python' },
  { file: 'tsconfig.json', type: 'typescript', language: 'typescript' },
  { file: 'next.config.mjs', type: 'nextjs', language: 'typescript' },
  { file: 'next.config.js', type: 'nextjs', language: 'javascript' },
  { file: 'vite.config.js', type: 'vite', language: 'javascript' },
  { file: 'vite.config.ts', type: 'vite', language: 'typescript' },
  { file: 'package.json', type: 'node', language: 'javascript' },
  { file: 'Gemfile', type: 'ruby', language: 'ruby' },
  { file: 'pom.xml', type: 'java', language: 'java' },
];

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.gradle', 'build', 'dist', 'out',
  '.next', '.venv', '__pycache__', 'target', '.idea', '.vscode',
  'vendor', 'Pods', '.dart_tool', '.pub-cache',
]);

export function detectProjectType(projectDir) {
  for (const sig of PROJECT_SIGNATURES) {
    if (fs.existsSync(path.join(projectDir, sig.file))) {
      return { type: sig.type, language: sig.language, detectedFrom: sig.file };
    }
  }
  return { type: 'generic', language: 'unknown', detectedFrom: null };
}

export function scanDirectoryTree(projectDir, maxDepth = 4) {
  const tree = [];

  function walk(dir, depth, relativePath) {
    if (depth > maxDepth) return;

    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const dirs = [];
    const files = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.github') continue;
      if (IGNORE_DIRS.has(entry.name)) continue;

      if (entry.isDirectory()) {
        dirs.push(entry.name);
      } else if (entry.isFile()) {
        files.push(entry.name);
      }
    }

    tree.push({
      path: relativePath || '.',
      dirs,
      files,
      depth,
    });

    for (const d of dirs) {
      const childRel = relativePath ? `${relativePath}/${d}` : d;
      walk(path.join(dir, d), depth + 1, childRel);
    }
  }

  walk(projectDir, 0, '');
  return tree;
}

export function hasExistingAgentFiles(projectDir) {
  return {
    agentsMd: fs.existsSync(path.join(projectDir, 'AGENTS.md')),
    indexMd: fs.existsSync(path.join(projectDir, 'INDEX.md')),
    sporeYaml: fs.existsSync(path.join(projectDir, '.spore.yaml')),
    trustState: fs.existsSync(path.join(projectDir, '.trust-state.yaml')),
  };
}
