# Baseline Snapshot (2025-09-23)

## Git
- Branch: integration
- git status -sb: clean vs origin/integration

## src/install.deps.ts
- jsr:@std/cli@1.0.13
- jsr:@std/fmt@1.0.5/colors
- jsr:@std/jsonc@1.0.1
- jsr:@std/path@1.0.1
- jsr:@std/streams@1.0.9/to-text
- jsr:@fathym/common@0.2.178 (path, merge, build types)

## config/denoConfigOverrides.jsonc
- Most templates pin @fathym packages to jsr:@fathym/*@0
- Common std imports: @std/assert@1.0.6, @std/log@0.224.6
- Preact templates use 
pm:preact@10.20.1
- Tailwind usage: 
pm:tailwindcss@3.4.1, 	ailwindcss-unimportant@2.1.1
- Langchain blocks vary (sink/synaptic): @langchain/community@0.3.22, @langchain/core@0.3.27, @langchain/langgraph@0.2.39, @langchain@0.3.9
- Golden synaptic notes: 
pm:@langchain/community@0.3.0, 
pm:@langchain/core@0.3.1, 
pm:@langchain/langgraph@0.2.3
- Shared extras: html-to-text@9.0.5, pdf-parse@1.1.1, zod@3.23.8

## config/installFiles.jsonc
- Maps template scaffolding files; no explicit version pins beyond shared templates

## CLI Tasks (deno.jsonc)
- build
- build:fmt
- build:lint
- check
- deploy
- publish:check
- test
- version
## Template Dependency Highlights
- API/core/golden templates reuse .shared configs; runtime plugins import @fathym/eac, @fathym/eac-applications, @fathym/eac-deno-kv, @fathym/ioc (versions indirect via overrides)
- Atomic/library templates expose jsr:@fathym/common@0, jsr:@fathym/atomic-design-kit@0
- Preact/golden-web/sink variants import @fathym/atomic, @fathym/atomic-design-kit, @fathym/atomic-icons, plus npm:preact@10.20.1 and tailwindcss@3.4.1 via overrides
- Synaptic-focused templates (synaptic, golden-synaptic, sink variants) include npm dependencies: @azure/search-documents@12.1.0, pdf-parse@1.1.1, html-to-text@9.0.5, @langchain suite (core/community/langgraph 0.3.x/0.2.x), and 
pm:zod
- Content templates rely on .shared Markdown/dev tooling; no package.json files present in repo
