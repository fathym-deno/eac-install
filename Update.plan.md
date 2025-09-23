# eac-install Update Plan

This plan assumes only the `eac-install` directory is available locally. All paths below are relative to this folder.

## Phase 0 - Baseline Snapshot
- [x] Run `git status -sb` and capture the output in your working notes.
- [x] Record current dependency versions:
  - [x] `src/install.deps.ts`
  - [x] `install.ts`
  - [x] `config/denoConfigOverrides.jsonc`
  - [x] `config/installFiles.jsonc`
  - [x] Each template directory under `src/files/*` (inspect `deno.jsonc`, `package.json`, `Dockerfile`, and workflow files if present).
- [x] List available CLI tasks from `deno.jsonc` (for example build, test, publish:check).
- [x] Optional: Create `notes/baseline.md` to store the collected information for quick reference.

## Phase 1 - Dependency Alignment
1. Establish target versions:
   - [x] Use `deno info jsr:@fathym/common@0` and similar commands (`@fathym/atomic@0`, `@std/streams@1`, etc.) to identify the latest published versions.
   - [x] Document the chosen target versions in your notes.
2. Update shared dependency references:
   - [x] Edit `src/install.deps.ts` to use the target versions.
   - [x] Search the source for hard-coded versions (`rg "@fathym"`, `rg "@std"`, `rg "version"`) and update matches in `install.ts`, `src/commands/**/*.ts`, and any other relevant files.
3. Adjust configuration files:
   - [x] Update `config/denoConfigOverrides.jsonc` with new versions or paths.
   - [x] Update `config/installFiles.jsonc` to ensure generated projects pull the refreshed dependencies.
4. Validation:
   - [x] Run `deno fmt` and `deno lint` from the repo root.
   - [x] Note any additional fixes required and address them immediately.

## Phase 2 - Template Refresh
For each template directory in `src/files` (api, atomic, core, golden-api, golden-core, golden-ref-arch, golden-synaptic, golden-web, library, preact, sink, sink-empty, synaptic):
- [x] Update dependency references inside template config files (`deno.jsonc`, `package.json`, workflows, Dockerfiles).
- [x] Sync shared assets first by reviewing `src/files/.shared`; propagate any updates to the template directories.
- [x] Ensure documentation files (`README.md`, usage guides) mention the updated versions or instructions.
- [x] Record which files were changed for each template in your notes.
_(See `notes/template-refresh.md` for per-template highlights.)_

## Phase 3 - CLI Behaviour Review
- [x] Update `src/commands/HelpCommand.ts` if template names or descriptions have changed.
- [x] Run `deno run -A install.ts --help` and verify the output; save the command output to `notes/help-output.txt` (or similar).
- [x] Review installer prompts/defaults in `src/commands/InstallCommand.ts` to ensure they align with the refreshed templates.

## Phase 4 - Test Matrix
1. Static checks:
   - [x] Execute `deno task build` and confirm fmt, lint, publish dry-run, and tests succeed.
2. Template smoke tests (repeat for each template listed in Phase 2):
   - [x] Create a temporary workspace (for example `mkdir .tmp/<template>`).
   - [x] Run `deno run -A install.ts --template <template> --target .tmp/<template>`.
   - [x] Change into the generated project and run the documented verification command (`deno task build`, `deno task test`, `npm test`, etc.).
   - [x] Capture the command outputs (store in `.tmp/<template>/install.log` or your notes).
   - [x] Remove or archive the temporary workspace after validation.
   _(Results captured in `notes/template-test-results.json`; sink/sink-empty lint and synaptic test issues logged as follow-ups.)_
3. Track results in a checklist noting success, failure, or follow-up items.
   - [x] Logged outcomes and outstanding items.

## Phase 5 - Wrap-Up
- [x] Compile testing notes and logs into `notes/testing-summary.md` (include command outputs or references).
- [x] Run `git status -sb` to review pending changes and confirm expected files are modified.
- [x] Draft a change summary outlining version bumps, template updates, and testing performed.
- [x] Record any follow-up tasks for issues uncovered during testing.

## Deliverables Checklist
- [x] Updated dependency references across `src/` and `config/` directories.
- [x] Refreshed template directories with documented changes.
- [x] Verified CLI help text and command behaviour.
- [x] Passing `deno task build` run.
- [x] Smoke-test evidence for every template.
- [x] Follow-up task list for outstanding issues.
