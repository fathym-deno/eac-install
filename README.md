---
FrontmatterVersion: 1
DocumentType: Guide
Title: Fathym EaC Install
Summary: Installer/CLI utilities for bootstrapping Everything-as-Code projects.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: EaC Sub-Area README
    Path: ../README.md
  - Label: EaC Sub-Area AGENTS
    Path: ../AGENTS.md
  - Label: EaC Sub-Area GUIDE
    Path: ../GUIDE.md
  - Label: Projects README
    Path: ../../README.md
  - Label: Projects AGENTS
    Path: ../../AGENTS.md
  - Label: Projects GUIDE
    Path: ../../GUIDE.md
  - Label: Workspace README
    Path: ../../../README.md
  - Label: Workspace AGENTS
    Path: ../../../AGENTS.md
  - Label: Workspace GUIDE
    Path: ../../../WORKSPACE_GUIDE.md
---

# Fathym EaC Install

Installer/CLI utilities for bootstrapping EaC projects and environments.

- **Goal:** provide commands for installing/configuring EaC assets across projects and runtimes.
- **Outputs:** CLI entrypoints (`install.ts`, `src/commands/**`) and supporting config/templates under `install/` and `config/`.
- **Code location:** this folder hosts the source.

## Current Status

- Commands located in `src/commands/**`; installer configs/templates under `install/` and `config/`.
- Tasks: `deno task test`, `deno task test:installer`, `deno task build`, `deno task publish:check`, `deno task deploy`, `deno task version`.
- Licensing: MIT (non-commercial) with commercial option; see `LICENSE`.

## How to Work in This Pod

1. Read parent EaC docs plus this project’s `AGENTS` and `GUIDE`.
2. Declare intent before editing; summarize outcomes and open questions in this README or a short log.
3. Capture provenance and release channels in `UPSTREAM.md` when publishing to jsr/npm; note install target assumptions.
4. Keep links relative; reference dependent EaC modules and micro-frameworks when installer behavior changes.
5. Record prompts/scripts used for automation in doc references.
