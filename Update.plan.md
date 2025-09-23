# eac-install Update Plan

This plan assumes only the `eac-install` directory is available locally. All paths below are relative to this folder.

## Phase 0 - Baseline Snapshot
- [ ] Run `git status -sb` and capture the output in your working notes.
- [ ] Record current dependency versions:
  - [ ] `src/install.deps.ts`
  - [ ] `install.ts`
  - [ ] `config/denoConfigOverrides.jsonc`
  - [ ] `config/installFiles.jsonc`
  - [ ] Each template directory under `src/files/*` (inspect `deno.jsonc`, `package.json`, `Dockerfile`, and workflow files if present).
- [ ] List available CLI tasks from `deno.jsonc` (for example build, test, publish:check).
- [ ] Optional: Create `notes/baseline.md` to store the collected information for quick reference.

## Phase 1 - Dependency Alignment
1. Establish target versions:
   - [ ] Use `deno info jsr:@fathym/common@0` and similar commands (`@fathym/atomic@0`, `@std/streams@1`, etc.) to identify the latest published versions.
   - [ ] Document the chosen target versions in your notes.
2. Update shared dependency references:
   - [ ] Edit `src/install.deps.ts` to use the target versions.
   - [ ] Search the source for hard-coded versions (`rg "@fathym"`, `rg "@std"`, `rg "version"`) and update matches in `install.ts`, `src/commands/**/*.ts`, and any other relevant files.
3. Adjust configuration files:
   - [ ] Update `config/denoConfigOverrides.jsonc` with new versions or paths.
   - [ ] Update `config/installFiles.jsonc` to ensure generated projects pull the refreshed dependencies.
4. Validation:
   - [ ] Run `deno fmt` and `deno lint` from the repo root.
   - [ ] Note any additional fixes required and address them immediately.

## Phase 2 - Template Refresh
For each template directory in `src/files` (api, atomic, core, golden-api, golden-core, golden-ref-arch, golden-synaptic, golden-web, library, preact, sink, sink-empty, synaptic):
- [ ] Update dependency references inside template config files (`deno.jsonc`, `package.json`, workflows, Dockerfiles).
- [ ] Sync shared assets first by reviewing `src/files/.shared`; propagate any updates to the template directories.
- [ ] Ensure documentation files (`README.md`, usage guides) mention the updated versions or instructions.
- [ ] Record which files were changed for each template in your notes.

## Phase 3 - CLI Behaviour Review
- [ ] Update `src/commands/HelpCommand.ts` if template names or descriptions have changed.
- [ ] Run `deno run -A install.ts --help` and verify the output; save the command output to `notes/help-output.txt` (or similar).
- [ ] Review installer prompts/defaults in `src/commands/InstallCommand.ts` to ensure they align with the refreshed templates.

## Phase 4 - Test Matrix
1. Static checks:
   - [ ] Execute `deno task build` and confirm fmt, lint, publish dry-run, and tests succeed.
2. Template smoke tests (repeat for each template listed in Phase 2):
   - [ ] Create a temporary workspace (for example `mkdir .tmp/<template>`).
   - [ ] Run `deno run -A install.ts --template <template> --target .tmp/<template>`.
   - [ ] Change into the generated project and run the documented verification command (`deno task build`, `deno task test`, `npm test`, etc.).
   - [ ] Capture the command outputs (store in `.tmp/<template>/install.log` or your notes).
   - [ ] Remove or archive the temporary workspace after validation.
3. Track results in a checklist noting success, failure, or follow-up items.

## Phase 5 - Wrap-Up
- [ ] Compile testing notes and logs into `notes/testing-summary.md` (include command outputs or references).
- [ ] Run `git status -sb` to review pending changes and confirm expected files are modified.
- [ ] Draft a change summary outlining version bumps, template updates, and testing performed.
- [ ] Record any follow-up tasks for issues uncovered during testing.

## Deliverables Checklist
- [ ] Updated dependency references across `src/` and `config/` directories.
- [ ] Refreshed template directories with documented changes.
- [ ] Verified CLI help text and command behaviour.
- [ ] Passing `deno task build` run.
- [ ] Smoke-test evidence for every template.
- [ ] Follow-up task list for outstanding issues.
