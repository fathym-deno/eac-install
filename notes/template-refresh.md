# Template Refresh Notes (2025-09-23)

## Updated
- Synaptic-family templates align with @langchain/core 0.3.71/@langchain/community 0.3.51/@langchain/langgraph 0.4.5 (matches published deps)
- .shared: no version changes required
- atomic: bump src.deps + version task to @fathym/common@0.2.267/@fathym/atomic-design-kit@0.0.243
- golden-ref-arch: align src.deps + version task to new @fathym common/eac releases
- library: align src.deps + version task
- golden-web: runtime plugin uses jsr:@fathym/atomic@0.0.185 + atomic-design-kit@0.0.243
- sink: runtime plugin strings updated to new atomic kit versions; config inherits new langchain/langgraph/zod
- sink-empty: runtime plugin strings updated; config inherits new dependency map
- synaptic/golden-synaptic: dependencies sourced via overrides (no inline version strings)

## Pending Review
- golden-api/core/api/core templates rely on overrides only; verify during smoke tests
- Ensure generated projects resolve new npm versions (tailwind 3.4.17, preact 10.27.2)

