import path from 'node:path';

const GUARDRAIL = `<!-- AGENT SCAFFOLD: Default instructions below ensure baseline agent behavior.
     Adding your own rules and conventions is encouraged.
     Removing or altering default instructions may cause unexpected agent behavior.
     Rule: safe to add, not safe to remove. -->

`;

export function generateAgentsMd(projectInfo, existingAgentsMd) {
  if (existingAgentsMd) {
    return appendRetrievalProtocol(existingAgentsMd);
  }

  const lines = [GUARDRAIL];
  lines.push('# Agent Instructions\n');
  lines.push(`## Project: ${projectInfo.type} (${projectInfo.language})\n`);

  lines.push('## Repository Retrieval Protocol\n');
  lines.push('This repo uses INDEX.md files for structured agent navigation.\n');
  lines.push('1. Read `INDEX.md` (root) for the directory map');
  lines.push('2. Based on task context, scan relevant directory INDEX files');
  lines.push('3. Open full documents only when the INDEX summary confirms relevance');
  lines.push('4. Do not skip INDEX files - they prevent unnecessary full-doc reads');
  lines.push('5. For cross-cutting work, scan ALL directory INDEX files (they are lightweight)');
  lines.push('');

  lines.push('## Conventions\n');
  lines.push('<!-- Add your project-specific conventions below -->');
  lines.push('');

  lines.push('## Working Style\n');
  lines.push('<!-- Add your preferred working style, communication norms, etc. -->');
  lines.push('');

  return lines.join('\n');
}

function appendRetrievalProtocol(existingContent) {
  if (existingContent.includes('Repository Retrieval Protocol')) {
    return existingContent;
  }

  const protocol = `
## Repository Retrieval Protocol

This repo uses INDEX.md files for structured agent navigation.

1. Read \`INDEX.md\` (root) for the directory map
2. Based on task context, scan relevant directory INDEX files
3. Open full documents only when the INDEX summary confirms relevance
4. Do not skip INDEX files - they prevent unnecessary full-doc reads
5. For cross-cutting work, scan ALL directory INDEX files (they are lightweight)

`;

  return existingContent.trimEnd() + '\n' + protocol;
}
