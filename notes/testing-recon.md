# Testing Recon (2025-09-23)

## Existing Launch Configs

- `.vscode/launch.json` currently exposes:
  - `Launch Test`: `deno test -A tests/tests.ts` with inspector
  - `Launch Local Test`: runs `deno test -A install.ts` from `local_test/`
- Both rely on Deno runtime, Node debug adapter, and expect `deno.exe` on PATH.

## Deno Tasks

- `deno task build` = fmt + lint + publish dry-run + `deno test -A ./tests/tests.ts`
- No installer-specific automation yet; smoke tests executed manually via notes script.

## Environment / Secrets

- Templates (sink/synaptic) reference env vars such as `AZURE_OPENAI_KEY`, `AZURE_OPENAI_INSTANCE` during runtime/test.
- Tests currently assume unrestricted network and full permissions (`-A`).

## Repo Hygiene

- `.gitignore` already excludes `cov/` and `local_test/` outputs; no rule yet for future `tests/tmp/` or `tests/reports/` directories.
- No dedicated `tests/installer` directory yet; safe to create under version control.
