// Optional outcome reporter for agent-harness.
//
// Sends validate/run outcomes as OTLP log records to any OTLP/HTTP logs
// endpoint (Winnow, or any other OTel-compatible backend). Fully opt-in and
// endpoint-agnostic: this module is a no-op unless
// OTEL_EXPORTER_OTLP_LOGS_ENDPOINT (or OTEL_EXPORTER_OTLP_ENDPOINT) is set.
//
// Zero dependencies: uses the global fetch/AbortController available in
// Node >=18, which this package already requires.

function resolveEndpoint() {
  const explicit = process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT;
  if (explicit) return explicit;
  const base = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
  if (!base) return null;
  return base.replace(/\/+$/, '') + '/v1/logs';
}

function parseHeaders() {
  const headers = { 'content-type': 'application/json' };
  const raw = process.env.OTEL_EXPORTER_OTLP_HEADERS;
  if (!raw) return headers;
  for (const pair of raw.split(',')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const value = pair.slice(idx + 1).trim();
    if (key) headers[key] = value;
  }
  return headers;
}

function toAttributes(fields) {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({
      key,
      value: typeof value === 'number'
        ? { doubleValue: value }
        : { stringValue: String(value) }
    }));
}

// event: { command, workflow, phase, status, exitCode, durationMs, message }
export async function reportOutcome(event, { timeoutMs = 2000 } = {}) {
  const endpoint = resolveEndpoint();
  if (!endpoint) return;

  const payload = {
    resourceLogs: [{
      resource: { attributes: toAttributes({ 'service.name': 'open-agent-harness' }) },
      scopeLogs: [{
        scope: { name: 'open-agent-harness' },
        logRecords: [{
          timeUnixNano: String(BigInt(Date.now()) * 1000000n),
          severityText: event.status === 'fail' ? 'ERROR' : 'INFO',
          body: { stringValue: event.message || `${event.command} ${event.status}` },
          attributes: toAttributes({
            'gen_ai.system': 'open-agent-harness',
            'gen_ai.agent.name': 'goose',
            'gen_ai.operation.name': event.command,
            'harness.workflow': event.workflow,
            'harness.phase': event.phase,
            'harness.strict': event.strict,
            'harness.status': event.status,
            'harness.exit_code': event.exitCode,
            'harness.duration_ms': event.durationMs
          })
        }]
      }]
    }]
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: parseHeaders(),
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch {
    // Best effort only: telemetry delivery never fails or blocks the harness.
  } finally {
    clearTimeout(timer);
  }
}
