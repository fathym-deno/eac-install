---
FrontmatterVersion: 1
DocumentType: Guide
Title: EaC Install Guide
Summary: Playbook for maintaining the Everything-as-Code installer/CLI.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: Project README
    Path: ./README.md
  - Label: Project AGENTS
    Path: ./AGENTS.md
  - Label: EaC Sub-Area README
    Path: ../README.md
  - Label: EaC Sub-Area GUIDE
    Path: ../GUIDE.md
  - Label: Workspace GUIDE
    Path: ../../../WORKSPACE_GUIDE.md
---

# EaC Install Guide

Steps for keeping the EaC installer predictable and stable.

## Current Focus

- Maintain CLI commands and installation flows for EaC projects.
- Keep templates/configs in `install/` and `config/` aligned with current packages and dependencies.
- Capture cross-package dependencies (EaC modules, ref-arch) and version expectations.

## Workflow

1. **Align scope** in [`README.md`](./README.md): clarify intended change (command update, template change, release prep) and note target repo/branch if code moves.
2. **Design & docs**: capture new commands/flags or template expectations in `docs/` (create if needed) with frontmatter and links to upstream assumptions.
3. **Capture provenance**: record release channels and version pins in `UPSTREAM.md` once publishing to jsr/npm.
4. **Validate behavior**: run `deno task test` and `deno task test:installer`; use `deno task build` and `deno task publish:check` before releases; keep examples aligned with installer flows.
5. **Communicate changes**: document breaking changes with migration guidance and notify consumers (other EaC packages, micro-frameworks).

## Verification

- Ensure links stay relative and parent guides remain discoverable.
- Keep the roster entry in `../README.md` current when docs or status change.
- When workspace tasks exist, also run: `deno task prompts:verify-frontmatter`, `deno task link:verify`, `deno task workspace:check`.
