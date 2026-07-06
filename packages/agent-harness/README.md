# @dakotafabrodev/agent-harness

CLI for validating and running growth-first harness workflows.

Commands:
- npx @dakotafabrodev/agent-harness validate
- npx @dakotafabrodev/agent-harness validate --strict
- npx @dakotafabrodev/agent-harness run build
- npx @dakotafabrodev/agent-harness run build --dry-run
- npx @dakotafabrodev/agent-harness run review --phase quality-check

Validation modes:
- validate checks baseline scaffold and contract structure
- validate --strict fails until placeholders are replaced with team-specific values

Run behavior:
- parses workflow phases
- executes inline commands arrays in each phase
- fails fast on command errors with non-zero exit

## Reporting outcomes to an observability backend
Set OTEL_EXPORTER_OTLP_LOGS_ENDPOINT to send validate/run outcomes as OTLP log records to any OTel-compatible backend. No endpoint set, no network calls: fully opt-in, no new dependency.

Env vars:
- OTEL_EXPORTER_OTLP_LOGS_ENDPOINT - full OTLP/HTTP logs endpoint (falls back to OTEL_EXPORTER_OTLP_ENDPOINT + /v1/logs)
- OTEL_EXPORTER_OTLP_HEADERS - comma-separated key=value pairs, e.g. authorization=Bearer <token>

Example, pointing at Winnow (https://justwinnow.com), which auto-creates a capture bucket for unattributed OTLP traffic (no pre-registration required):
- export OTEL_EXPORTER_OTLP_LOGS_ENDPOINT=https://app.justwinnow.com/otel/v1/logs
- export OTEL_EXPORTER_OTLP_HEADERS="authorization=Bearer <winnow-ingest-key>"
- npx @dakotafabrodev/agent-harness validate --strict
- npx @dakotafabrodev/agent-harness run build

Each outcome is one OTLP log record carrying gen_ai.* attributes plus harness.workflow, harness.phase, harness.status, and harness.exit_code. Delivery is best-effort with a 2s timeout: it never blocks or fails a command.

Works with Goose.
