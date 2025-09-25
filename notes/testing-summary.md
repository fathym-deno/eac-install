# Testing Summary (2025-09-23)

## Repo-level

- `deno task build` (fmt, lint, publish dry-run, tests) succeeded; coverage warning about empty suite persists.

## Template Smoke Tests (`notes/template-test-results.json`)

- PASS: api, atomic, core, golden-atomic, golden-api, golden-core, golden-ref-arch, golden-synaptic, golden-web, library, preact
- WARN: sink, sink-empty � `deno lint` flags unused variables and async handlers without awaits (see `tests/reports/2025-09-23T23-06-04-302Z/<template>/build.log`)
- WARN: synaptic � `deno test` fails (`DFSFileHandler` service not registered); `deno task publish:check` succeeds (logs under `tests/reports/2025-09-23T23-06-04-302Z/synaptic/build.log`)

All legacy smoke-test logs are archived under `tests/reports/2025-09-23T23-06-04-302Z/` (per template subdirectory).

- Harness enforces clean git state; pass `--allow-dirty` for experimental runs.

## Installer Harness Run (2025-09-23 23:06 UTC)

- Command: `deno run -A tests/installer/main.ts --all --allow-dirty --json tests/reports/latest.json`
- Summary: pass for api, atomic, core, golden-api, golden-atomic, golden-core, golden-ref-arch, golden-synaptic, golden-web, library, preact; **fail** for sink, sink-empty, synaptic.
- Failure details:
  - `sink`, `sink-empty`: `deno lint` rule `require-await` on generated route handlers (`apps/dashboard/index.tsx`). See `tests/reports/2025-09-23T23-06-04-302Z/sink/build.log` and `tests/reports/2025-09-23T23-06-04-302Z/sink-empty/build.log`.
  - `synaptic`: identical `require-await` issue in generated dashboard handler. See `tests/reports/2025-09-23T23-06-04-302Z/synaptic/build.log`.
- Logs relocated to `tests/reports/2025-09-23T23-06-04-302Z/`; temporary workspaces removed after archival.
- Repo status rechecked (`git status -sb`) after cleanup to verify no harness artefacts remain.
