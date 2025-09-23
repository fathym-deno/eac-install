# Change Summary (2025-09-23)

- Pinned Deno std modules and @fathym packages across installer deps, CLI tasks, and template overrides.
- Refreshed template scaffolds (atomic, golden-ref-arch, library, sink family, golden-web) to match new dependency map and updated marked usage.
- Improved CLI experience: default template is `core`; help command now enumerates templates dynamically and documents flag behavior.
- Added notes + automation for smoke testing, including dependency target matrix and CLI/test artifacts under `notes/`.
