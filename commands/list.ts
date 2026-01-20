/**
 * List command for displaying available EaC project templates.
 *
 * The list command shows all available template types that can be used
 * with the install command. It displays the template name, description,
 * and applicable flags for each template type.
 *
 * ## Output Format
 *
 * ```
 * Available EaC Templates:
 *
 *   runtime   - Standard web runtime (proxy)         [tailwind, preact]
 *   api       - API-focused project                  [tailwind]
 *   synaptic  - AI/synaptic runtime                  []
 *   atomic    - Atomic components library            []
 *   library   - Reusable library                     []
 *   preact    - Preact-based project                 [tailwind]
 *   sink      - Full-featured sink project           [tailwind, preact]
 * ```
 *
 * @example List all templates
 * ```bash
 * ftm eac list
 * ```
 *
 * @example List with JSON output
 * ```bash
 * ftm eac list --json
 * ```
 *
 * @module
 */

import { z } from '../.deps.ts';
import { Command, CommandParams, type CommandStatus } from '@fathym/cli';
import {
  getTemplateTypes,
  TemplateRegistry,
  type TemplateTypeKey,
} from '../src/TemplateRegistry.ts';

/**
 * Template information for list output.
 */
export interface TemplateInfo {
  /** Template type name */
  name: TemplateTypeKey;
  /** Human-readable description */
  description: string;
  /** Applicable flags */
  flags: readonly string[];
}

/**
 * Result data for the list command.
 */
export interface ListResult {
  /** Array of template information */
  templates: TemplateInfo[];
}

/**
 * Zod schema for list command positional arguments.
 * List command takes no positional arguments.
 */
export const ListArgsSchema = z.tuple([]);

/**
 * Zod schema for list command flags.
 *
 * @property json - Output in JSON format
 */
export const ListFlagsSchema = z
  .object({
    json: z
      .boolean()
      .optional()
      .default(false)
      .describe('Output in JSON format'),
  })
  .passthrough();

/**
 * Typed parameter accessor for the list command.
 */
class ListParams extends CommandParams<
  z.infer<typeof ListArgsSchema>,
  z.infer<typeof ListFlagsSchema>
> {
  /**
   * Whether to output in JSON format.
   */
  get Json(): boolean {
    return this.Flag('json') ?? false;
  }
}

/**
 * List command - displays available EaC project templates.
 *
 * Shows all template types with their descriptions and applicable flags.
 * Supports both human-readable and JSON output formats.
 */
export default Command('list', 'List available EaC project templates')
  .Args(ListArgsSchema)
  .Flags(ListFlagsSchema)
  .Params(ListParams)
  .Run(({ Params, Log }): CommandStatus<ListResult> => {
    const types = getTemplateTypes();

    const templates: TemplateInfo[] = types.map((type) => ({
      name: type,
      description: TemplateRegistry[type].description,
      flags: TemplateRegistry[type].flags,
    }));

    if (Params.Json) {
      // JSON output
      console.log(JSON.stringify({ templates }, null, 2));
    } else {
      // Human-readable output
      Log.Info('Available EaC Templates:\n');

      const maxNameLen = Math.max(...types.map((t) => t.length));
      const maxDescLen = Math.max(
        ...templates.map((t) => t.description.length),
      );

      for (const template of templates) {
        const namePad = template.name.padEnd(maxNameLen);
        const descPad = template.description.padEnd(maxDescLen);
        const flags = template.flags.length > 0 ? `[${template.flags.join(', ')}]` : '[]';

        Log.Info(`  ${namePad}  - ${descPad}  ${flags}`);
      }

      Log.Info('');
      Log.Info('Usage: ftm eac install <type> [name] [--flags]');
    }

    return {
      Code: 0,
      Message: `Listed ${templates.length} template types`,
      Data: { templates },
    };
  });
