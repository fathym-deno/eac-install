/**
 * Intent tests for the EaC List command.
 *
 * Tests verify that the list command correctly displays available
 * template types and their descriptions.
 *
 * @module
 */

import { CommandIntentSuite } from '@fathym/cli';
import ListCommand from '../commands/list.ts';
import CLI from '../.cli.ts';

CommandIntentSuite('EaC List Command Suite', ListCommand, CLI)
  // ═══════════════════════════════════════════════════════════════════════════
  // Basic list functionality
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('List all available templates', (int) =>
    int
      .Args([])
      .Flags({ json: false })
      .ExpectLogs(
        'Available EaC Templates:', // Header
        'runtime', // Runtime template
        'api', // API template
        'synaptic', // Synaptic template
        'atomic', // Atomic template
        'library', // Library template
        'preact', // Preact template
        'sink', // Sink template
        'Usage:', // Usage hint
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // JSON output
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('List templates in JSON format', (int) =>
    int
      .Args([])
      .Flags({ json: true })
      .ExpectLogs(
        '"templates"', // JSON output contains templates array
        '"name"', // Each template has name
        '"description"', // Each template has description
        '"flags"', // Each template has flags
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Template descriptions in output
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Display template descriptions', (int) =>
    int
      .Args([])
      .Flags({ json: false })
      .ExpectLogs(
        'Standard web runtime', // Runtime description
        'API-focused project', // API description
        'AI/synaptic runtime', // Synaptic description
        'Atomic components', // Atomic description
        'Reusable library', // Library description
        'Preact-based', // Preact description
        'Full-featured sink', // Sink description
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Flags shown in output
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Show applicable flags for each template', (int) =>
    int
      .Args([])
      .Flags({ json: false })
      .ExpectLogs(
        '[tailwind, preact]', // Runtime/sink flags
        '[tailwind]', // API/preact flags
        '[]', // Templates with no flags
      )
      .ExpectExit(0))
  .Run();
