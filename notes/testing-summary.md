# Testing Summary (2025-09-23)

## Repo-level
- `deno task build` (fmt, lint, publish dry-run, tests) succeeded; coverage warning about empty suite persists.

## Template Smoke Tests (`notes/template-test-results.json`)
- PASS: api, atomic, core, golden-atomic, golden-api, golden-core, golden-ref-arch, golden-synaptic, golden-web, library, preact
- WARN: sink, sink-empty — `deno lint` flags unused variables and async handlers without awaits (see `.tmp/<template>/build.log`)
- WARN: synaptic — `deno test` fails (`DFSFileHandler` service not registered); `deno task publish:check` succeeds (logs under `.tmp/synaptic/build.log`)

All install and build logs for smoke tests live under `.tmp/<template>/*.log`.
