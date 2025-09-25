# Installer Test Harness Design (2025-09-23)

## CLI Sketch

- Entry: `deno run -A tests/installer/main.ts [--template <name>] [--all] [--keep] [--json <path>]`
- Defaults:
  - If neither `--template` nor `--all` is provided, run core template.
  - `--keep` skips cleanup for debugging.
  - `--allow-dirty` flag gates execution when git state is not clean.

## Outputs & Reporting

- Console summary per template (install/build/test status, duration).
- JSON report schema:
  ```json
  {
    "templates": [
      {
        "name": "core",
        "install": { "status": "pass", "durationMs": 1234 },
        "build": { "status": "pass" },
        "notes": []
      }
    ],
    "startedAt": "ISO",
    "finishedAt": "ISO"
  }
  ```
- Optional JUnit XML emitter for future CI (stretch goal).

## Cleanup Strategy

- Create runs under `tests/tmp/<timestamp>/<template>`.
- Remove directories on success; retain when `--keep` or on failure for inspection.
- Ensure `tests/tmp/` and `tests/reports/` are git-ignored.

## Safety Rails

- Verify working tree clean unless `--allow-dirty`.
- Derive template list from `config/installFiles.jsonc` to stay in sync.
- Surface lint/test failures but continue multi-template runs; summarize at end.
