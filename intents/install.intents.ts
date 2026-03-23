/**
 * Intent tests for the EaC Install command.
 *
 * Tests verify that the install command correctly scaffolds projects
 * from various template types and handles flags appropriately.
 *
 * All tests scaffold into ./tests/.temp/ to avoid polluting the project root.
 *
 * @module
 */

import { CommandIntentSuite } from '@fathym/cli';
import InstallCommand from '../commands/install.ts';
import CLI from '../.cli.ts';

/** Temp directory for test scaffolding output. */
const TEMP_DIR = './tests/.temp';

CommandIntentSuite('EaC Install Command Suite', InstallCommand, CLI)
  // ═══════════════════════════════════════════════════════════════════════════
  // Runtime template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install runtime template with default options', (int) =>
    int
      .Args(['runtime', `${TEMP_DIR}/test-runtime`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "runtime" template:', // Template selection
        'Project created from "runtime" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // API template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install API template', (int) =>
    int
      .Args(['api', `${TEMP_DIR}/test-api`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "api" template:', // Template selection
        'Project created from "api" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Synaptic template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install synaptic template', (int) =>
    int
      .Args(['synaptic', `${TEMP_DIR}/test-synaptic`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "synaptic" template:', // Template selection
        'Project created from "synaptic" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Atomic template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install atomic template', (int) =>
    int
      .Args(['atomic', `${TEMP_DIR}/test-atomic`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "atomic" template:', // Template selection
        'Project created from "atomic" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Library template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install library template', (int) =>
    int
      .Args(['library', `${TEMP_DIR}/test-library`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "library" template:', // Template selection
        'Project created from "library" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Preact template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install preact template', (int) =>
    int
      .Args(['preact', `${TEMP_DIR}/test-preact`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "preact" template:', // Template selection
        'Project created from "preact" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Sink template installation
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install sink (full-featured) template', (int) =>
    int
      .Args(['sink', `${TEMP_DIR}/test-sink`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "sink" template:', // Template selection
        'Project created from "sink" template', // Success message
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Flag validation tests
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent(
    'Warn when using inapplicable flags (tailwind on library)',
    (int) =>
      int
        .Args(['library', `${TEMP_DIR}/test-library-flags`])
        .Flags({ force: false, tailwind: true, preact: false })
        .ExpectLogs(
          'Flag --tailwind is not applicable', // Warning for inapplicable flag
        )
        .ExpectExit(0),
  )
  .Intent('Warn when using inapplicable flags (preact on api)', (int) =>
    int
      .Args(['api', `${TEMP_DIR}/test-api-flags`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Flag --preact is not applicable', // Warning for inapplicable flag
      )
      .ExpectExit(0))
  // ═══════════════════════════════════════════════════════════════════════════
  // Default name test
  // ═══════════════════════════════════════════════════════════════════════════
  .Intent('Install with default name (my-<type>)', (int) =>
    int
      .Args(['runtime', `${TEMP_DIR}/my-runtime`])
      .Flags({ force: false, tailwind: true, preact: true })
      .ExpectLogs(
        'Installing "runtime" template:', // Template selection
        'Project created from "runtime" template', // Success message
      )
      .ExpectExit(0))
  .Run();
