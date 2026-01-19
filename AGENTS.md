---
FrontmatterVersion: 1
DocumentType: Guide
Title: EaC Install Agents Guide
Summary: Guardrails for collaborating on the Everything-as-Code installer/CLI.
Created: 2025-11-20
Updated: 2025-11-20
Owners:
  - fathym
References:
  - Label: Project README
    Path: ./README.md
  - Label: Project GUIDE
    Path: ./GUIDE.md
  - Label: EaC App Runtime Area README
    Path: ../README.md
  - Label: EaC App Runtime Area AGENTS
    Path: ../AGENTS.md
  - Label: EaC App Runtime Area GUIDE
    Path: ../GUIDE.md
  - Label: Projects AGENTS
    Path: ../../AGENTS.md
  - Label: Workspace AGENTS
    Path: ../../../AGENTS.md
---

# AGENTS: EaC Install

Guardrails for humans and AI working on the EaC installer/CLI utilities.

## Core Guardrails

1. **Stay scoped.** Keep work under `projects/everything-as-code/eac-install/`
   unless coordinating with another pod; link cross-pod dependencies.
2. **Frontmatter required.** All docs include frontmatter and relative
   references back to parent guides.
3. **CLI stability.** Avoid breaking command/flag behavior silently; document
   breaking changes and add migration notes for consumers.
4. **Provenance.** Capture release channels and version pins in `UPSTREAM.md`
   when publishing; prefer upstream-first fixes before diverging.
5. **Security & data handling.** Don’t embed secrets or tokens in configs/tests;
   document required permissions and environment variables.

## Communication

- Declare intent before editing; summarize outcomes and next steps in the
  project README or a short log.
- Link consumer pods when installer behavior changes to keep dependencies
  aligned.
