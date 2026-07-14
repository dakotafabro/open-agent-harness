const GUARDRAIL_YAML = `# AGENT SCAFFOLD: Default configuration ensures baseline agent behavior.
# Adding your own settings is encouraged.
# Removing or altering defaults may cause unexpected behavior.
# Rule: safe to add, not safe to remove.

`;

export function generateSporeYaml(projectInfo) {
  const lines = [GUARDRAIL_YAML];
  lines.push('version: "0.1"');
  lines.push(`project_type: ${projectInfo.type}`);
  lines.push(`language: ${projectInfo.language}`);
  lines.push('');
  lines.push('retrieval:');
  lines.push('  decay_rate: 0.03');
  lines.push('  consolidation_threshold: 0.2');
  lines.push('  log_file: .retrieval-log.csv');
  lines.push('');
  lines.push('index:');
  lines.push('  auto_regenerate: false');
  lines.push('  max_depth: 4');
  lines.push('  ignore:');
  lines.push('    - node_modules');
  lines.push('    - .git');
  lines.push('    - build');
  lines.push('    - dist');
  lines.push('    - out');
  lines.push('    - .next');
  lines.push('    - __pycache__');
  lines.push('    - target');
  lines.push('    - .gradle');
  lines.push('    - .venv');
  lines.push('');

  return lines.join('\n');
}

export function generateTrustState() {
  const lines = [GUARDRAIL_YAML];
  lines.push('trust_levels:');
  lines.push('  file_reads:');
  lines.push('    level: 3');
  lines.push('    description: Agent can read any file without confirmation');
  lines.push('  file_writes:');
  lines.push('    level: 1');
  lines.push('    description: Agent should confirm before writing files');
  lines.push('  shell_commands:');
  lines.push('    level: 1');
  lines.push('    description: Agent should confirm before running shell commands');
  lines.push('  git_operations:');
  lines.push('    level: 1');
  lines.push('    description: Agent should confirm before git commit/push');
  lines.push('  index_maintenance:');
  lines.push('    level: 2');
  lines.push('    description: Agent can suggest INDEX updates, confirm before applying');
  lines.push('');
  lines.push('graduation:');
  lines.push('  confirmations_to_advance: 5');
  lines.push('  rejections_to_demote: 2');
  lines.push('  max_level: 5');
  lines.push('');
  lines.push('policy:');
  lines.push('  surface_before_acting: true');
  lines.push('  log_all_actions: true');
  lines.push('');

  return lines.join('\n');
}
