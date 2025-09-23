# Follow-up Tasks (2025-09-23)

- Resolve `deno lint` errors in generated sink and sink-empty routes (async handlers without awaits, unused imports) so smoke tests pass cleanly.
- Investigate synaptic template test failure (`DFSFileHandler` service missing) and determine required IoC registrations or adjust template defaults.
- Address recurring peer dependency warnings for `@browserbasehq/stagehand` ? `openai` during template builds.
