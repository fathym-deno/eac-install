---
FrontmatterVersion: 1
DocumentType: Workstream
Title: "EaC Install CLI Migration: ftm-eac-install"
Summary: "Migrate custom eac-install CLI to @fathym/cli framework as standalone ftm-eac-install and fathym-cli plugin"
Created: 2026-01-19
Updated: 2026-01-19
CurrentPhase: "Phase 1"

PrimaryProject: "eac-app-runtime/eac-install"
PrimaryProjectPath: "projects/eac-app-runtime/eac-install"
AffectedProjects:
  - Ref: "open-source/fathym-cli"
    Path: "projects/open-source/fathym-cli"
    Role: "Composes ftm-eac-install as plugin at 'ftm eac install'"
  - Ref: "ref-arch/command-line-interface"
    Path: "projects/ref-arch/command-line-interface"
    Role: "Provides @fathym/cli framework and patterns"

CreationPhase: 6
CreationStatus: "Complete"
CompletedPhases:
  Vision: { CompletedDate: 2026-01-19 }
  Context: { CompletedDate: 2026-01-19 }
  Structure: { CompletedDate: 2026-01-19 }
  Depth: { CompletedDate: 2026-01-19 }
  Risks: { CompletedDate: 2026-01-19 }
  Approval: { CompletedDate: 2026-01-19 }

PendingQuestions: []

Risks:
  - Id: R001
    Risk: "Template migration breaks existing templates"
    Impact: HIGH
    Likelihood: MEDIUM
    Mitigation: "Test each template individually during Phase 2"
    Status: active
  - Id: R002
    Risk: "File mapping paths differ between old/new structure"
    Impact: MEDIUM
    Likelihood: HIGH
    Mitigation: "Update config carefully, test all template types"
    Status: active
  - Id: R003
    Risk: "Plugin composition adds commands at wrong path"
    Impact: MEDIUM
    Likelihood: LOW
    Mitigation: "Follow ftm-cli pattern exactly, verify with --help"
    Status: active
  - Id: R004
    Risk: "Handlebars conversion misses variable substitutions"
    Impact: MEDIUM
    Likelihood: MEDIUM
    Mitigation: "Compare old .template files with new .hbs output"
    Status: active

Opportunities:
  - Id: O001
    Opportunity: "Add interactive template selection (--interactive flag)"
    Effort: MEDIUM
    Value: HIGH
    Decision: defer
    Rationale: "Future enhancement after core migration"
  - Id: O002
    Opportunity: "Add template validation command"
    Effort: LOW
    Value: MEDIUM
    Decision: pursue
    Rationale: "Can add in Phase 3 alongside list command"
  - Id: O003
    Opportunity: "Support custom template sources (URL/git)"
    Effort: HIGH
    Value: MEDIUM
    Decision: defer
    Rationale: "Future enhancement"
  - Id: O004
    Opportunity: "Add ftm eac upgrade command for existing projects"
    Effort: MEDIUM
    Value: HIGH
    Decision: defer
    Rationale: "Future enhancement after core migration"

ExecutionReady: true
ExecutionBlockers: []
---

# EaC Install CLI Migration: ftm-eac-install

## Document Info

| Field | Value |
|-------|-------|
| Status | **In Progress** |
| Current Phase | Phase 1: Foundation Setup |
| Phases | 6 |
| Total Deliverables | 28 |
| Completed | 0 |
| Pending | Phases 1-6 |
| Risks | 4 (1 HIGH) |
| Blockers | None |

## Overview

Migrate the custom-built eac-install CLI to use the @fathym/cli framework, enabling it to work as:
1. **Standalone CLI** (`ftm-eac-install`) - like ftm-cli
2. **Plugin in fathym-cli** - composed at `ftm eac install`

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CLI name | `ftm-eac-install` | Follows Fathym naming pattern |
| Project structure | eac-install/ root = CLI root | No nested folder - project is dedicated to this CLI |
| Template format | Handlebars `.hbs` | Aligns with @fathym/cli framework |
| Migration approach | Full migration | Clean break - new architecture only, no legacy code |
| Command approach | Single command + enum + registry | Less files, easy expansion, Zod validates type at parse time |
| Command structure | `ftm eac install <type> [name]` | Enum arg for type, registry defines per-type flags |
| Scaffolding services | Use built-in TemplateLocator/TemplateScaffolder | No custom services - same pattern as ftm-cli init |

## Target Structure

```
eac-install/                       # Project root IS the CLI root
├── .cli.ts                        # CLI module definition (fluent API)
├── .exports.ts                    # Barrel export for plugin composition
├── .deps.ts                       # Centralized dependencies
├── commands/
│   ├── .group.ts                  # Root group: "eac-install"
│   ├── install.ts                 # Single install command with enum type arg
│   └── list.ts                    # List available templates
├── src/
│   └── TemplateRegistry.ts        # Template type definitions + flag schemas
├── templates/                     # Handlebars templates (.hbs)
│   ├── runtime/                   # From src/files/core
│   ├── api/                       # From src/files/api
│   ├── synaptic/                  # From src/files/synaptic
│   ├── atomic/                    # From src/files/atomic
│   ├── library/                   # From src/files/library
│   ├── preact/                    # From src/files/preact
│   └── sink/                      # From src/files/sink
├── intents/                       # Intent tests
│   ├── install.intents.ts
│   └── list.intents.ts
├── config/                        # Config files
└── deno.jsonc
```

## Command Structure

```bash
ftm eac install <type> [name] [flags]

Arguments:
  type   Template type (runtime|api|synaptic|atomic|library|preact|sink)
  name   Project name (optional, defaults to my-<type>)

Flags:
  --dir        Output directory
  --force      Overwrite existing files
  --golden     Use golden template variant
  --tailwind   Include Tailwind CSS (runtime, api, preact)
  --preact     Include Preact support (runtime)
```

---

## Phase 1: Foundation Setup

**Goal:** Add @fathym/cli structure to eac-install project root

**Status:** Not Started

### Deliverables

- [ ] 1.1: Create `.cli.ts` at project root with CLI() fluent API (name: 'EaC Install CLI', command: 'ftm-eac-install')
- [ ] 1.2: Create `.exports.ts` barrel export (export EaCInstallCLI)
- [ ] 1.3: Create `.deps.ts` with dependencies (@fathym/cli, zod, etc.)
- [ ] 1.4: Create `commands/.group.ts` root group
- [ ] 1.5: Update `deno.jsonc` with @fathym/cli import and package export

**Pattern Reference:** `projects/ref-arch/command-line-interface/ftm-cli/`

**Verification:** `deno check .cli.ts` passes (from eac-install/ root)

---

## Phase 2: Template Migration to Handlebars

**Goal:** Migrate template files from `.template` to Handlebars `.hbs` format

**Status:** Not Started

### Deliverables

- [ ] 2.1: Create `templates/` directory at project root
- [ ] 2.2: Migrate `src/files/core/` → `templates/runtime/` (rename to .hbs)
- [ ] 2.3: Migrate `src/files/api/` → `templates/api/`
- [ ] 2.4: Migrate `src/files/synaptic/` → `templates/synaptic/`
- [ ] 2.5: Migrate `src/files/atomic/` → `templates/atomic/`
- [ ] 2.6: Migrate `src/files/library/` → `templates/library/`
- [ ] 2.7: Migrate `src/files/preact/` → `templates/preact/`
- [ ] 2.8: Migrate `src/files/sink/` → `templates/sink/`
- [ ] 2.9: Migrate shared templates (`src/files/.shared/`)
- [ ] 2.10: Test each template type loads correctly

**Note:** Golden templates (golden-*) can be added as a `--golden` flag in Phase 3

**Verification:** All 7 template directories exist under `templates/` with .hbs files

---

## Phase 3: Command Implementation

**Goal:** Implement install command using single command + enum + registry pattern

**Status:** Not Started

### Deliverables

- [ ] 3.1: Create `src/TemplateRegistry.ts` - Template type enum and per-template flag definitions
- [ ] 3.2: Create `commands/install.ts` - Single install command with enum type argument
- [ ] 3.3: Create `commands/list.ts` - List available templates from registry
- [ ] 3.4: Add runtime validation for template-specific flags (warn if inapplicable)

### Template Registry Pattern

```typescript
// src/TemplateRegistry.ts
import { z } from 'zod';

export const TemplateRegistry = {
  runtime: {
    description: 'Standard web runtime (proxy)',
    flags: ['tailwind', 'preact'] as const,
  },
  api: {
    description: 'API-focused project',
    flags: ['tailwind'] as const,
  },
  synaptic: {
    description: 'AI/synaptic runtime',
    flags: [] as const,
  },
  atomic: {
    description: 'Atomic components library',
    flags: [] as const,
  },
  library: {
    description: 'Reusable library',
    flags: [] as const,
  },
  preact: {
    description: 'Preact-based project',
    flags: ['tailwind'] as const,
  },
  sink: {
    description: 'Full-featured sink project',
    flags: ['tailwind', 'preact'] as const,
  },
} as const;

export const TemplateType = z.enum(
  Object.keys(TemplateRegistry) as [keyof typeof TemplateRegistry, ...Array<keyof typeof TemplateRegistry>]
);
```

**Verification:**
- `deno run -A .cli.ts install --help` shows enum types and all flags
- `deno run -A .cli.ts install runtime --help` works

---

## Phase 4: Plugin Composition

**Goal:** Enable ftm-eac-install to be composed into fathym-cli at `ftm eac`

**Status:** Not Started

### Deliverables

- [ ] 4.1: Export CLI module from `@fathym/eac-install/ftm-eac-install`
- [ ] 4.2: Add EaCInstallCLI to fathym-cli as plugin with CommandRoot: 'eac'
- [ ] 4.3: Verify `ftm eac install --help` shows enum type and flags
- [ ] 4.4: Verify `ftm eac install runtime --help` works
- [ ] 4.5: Verify `ftm eac list` shows all templates from registry
- [ ] 4.6: Test install with each template type via fathym-cli composition
- [ ] 4.7: Verify standalone `ftm-eac-install install runtime` also works

**Integration File:** `projects/open-source/fathym-cli/.cli.ts`

**Verification:**
- `ftm eac install runtime --help` works from fathym-cli
- `ftm eac install api --preact` shows warning for inapplicable flag

---

## Phase 5: Testing & Documentation

**Goal:** Add intent tests and update documentation

**Status:** Not Started

### Deliverables

- [ ] 5.1: Create `intents/install.intents.ts` - test suite for install command (all template types)
- [ ] 5.2: Create `intents/list.intents.ts` - test suite for list command
- [ ] 5.3: Add tests for template-specific flag validation warnings
- [ ] 5.4: Update eac-install README.md with new CLI usage
- [ ] 5.5: Update eac-install AGENTS.md
- [ ] 5.6: Add ftm-eac-install to eac-install GUIDE.md

**Verification:** `ftm task @fathym/eac-install build` - all tests pass

---

## Phase 6: Release & Cascade

**Goal:** Release packages and update dependents

**Status:** Not Started

### Deliverables

- [ ] 6.1: Release @fathym/eac-install with CLI export
- [ ] 6.2: Update fathym-cli to use new EaCInstallCLI plugin
- [ ] 6.3: Release fathym-cli with eac plugin
- [ ] 6.4: Verify compiled fathym-cli includes `ftm eac install` command
- [ ] 6.5: Update workspace documentation
- [ ] 6.6: Clean up old src/files/, src/commands/, install.ts (remove deprecated code)

**Verification:** Compiled fathym-cli binary includes `ftm eac install` command

---

## Agent Notes

| Date | Context | Lesson |
|------|---------|--------|
| 2026-01-19 | Workstream creation | Single command + enum + registry pattern chosen over dedicated commands for maintainability |

---

## Session Log

### Session 1 - 2026-01-19

**Focus:** Workstream Creation

**Completed:**
- [x] Plan approved with single command + enum + registry pattern
- [x] Created .workstreams directory
- [x] Created EaCInstallCLIMigration.Workstream.md

**Next:** Begin Phase 1 - Foundation Setup
