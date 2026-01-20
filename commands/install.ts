/**
 * Install command for scaffolding EaC projects.
 *
 * The install command creates a new EaC project from templates based on the
 * specified type. It supports various project types including runtime, API,
 * synaptic, atomic, library, preact, and full-featured sink projects.
 *
 * ## Execution Flow
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  1. Parse template type and flags via Zod schemas              │
 * │  2. Validate flags are applicable to template type             │
 * │  3. Resolve target DFS (--dir or current directory)            │
 * │  4. Initialize TemplateScaffolder with template locator        │
 * │  5. Scaffold project from selected template type               │
 * │  6. Log success with output path                               │
 * └─────────────────────────────────────────────────────────────────┘
 * ```
 *
 * ## Template Types
 *
 * | Type | Description | Flags |
 * |------|-------------|-------|
 * | runtime | Standard web runtime (proxy) | tailwind, preact |
 * | api | API-focused project | tailwind |
 * | synaptic | AI/synaptic runtime | - |
 * | atomic | Atomic components library | - |
 * | library | Reusable library | - |
 * | preact | Preact-based project | tailwind |
 * | sink | Full-featured sink project | tailwind, preact |
 *
 * @example Basic installation - create a runtime project
 * ```bash
 * ftm eac install runtime my-project
 * ```
 *
 * @example Create API project in current directory
 * ```bash
 * ftm eac install api
 * ```
 *
 * @example Create preact project with specific directory
 * ```bash
 * ftm eac install preact my-app --dir=./projects
 * ```
 *
 * @example Create sink project with all features
 * ```bash
 * ftm eac install sink my-app --tailwind --preact
 * ```
 *
 * @module
 */

import { join, z } from '../.deps.ts';
import {
  CLIDFSContextManager,
  Command,
  CommandParams,
  type CommandStatus,
  TemplateLocator,
  TemplateScaffolder,
} from '@fathym/cli';
import {
  getTemplateConfig,
  isFlagApplicable,
  TemplateType,
  type TemplateTypeKey,
} from '../src/TemplateRegistry.ts';

/**
 * Result data for the install command.
 */
export interface InstallResult {
  /** The template type used */
  type: TemplateTypeKey;
  /** The project name/path */
  name: string;
  /** The full path to the installed project */
  projectPath: string;
  /** Flags that were applied */
  appliedFlags: string[];
}

/**
 * Zod schema for install command positional arguments.
 *
 * @property [0] - Template type (required): runtime, api, synaptic, atomic, library, preact, sink
 * @property [1] - Optional project name. Defaults to 'my-<type>' when omitted.
 */
export const InstallArgsSchema = z.tuple([
  TemplateType.describe('Template type to install'),
  z.string().optional().describe('Project name').meta({ argName: 'name' }),
]);

/**
 * Zod schema for install command flags.
 *
 * @property dir - Output directory (relative to cwd)
 * @property force - Overwrite existing files
 * @property tailwind - Include Tailwind CSS (runtime, api, preact, sink)
 * @property preact - Include Preact support (runtime, sink)
 */
export const InstallFlagsSchema = z
  .object({
    dir: z
      .string()
      .optional()
      .describe('Output directory (relative to cwd)'),

    force: z
      .boolean()
      .optional()
      .default(false)
      .describe('Overwrite existing files'),

    tailwind: z
      .boolean()
      .optional()
      .default(true)
      .describe('Include Tailwind CSS (runtime, api, preact, sink)'),

    preact: z
      .boolean()
      .optional()
      .default(true)
      .describe('Include Preact support (runtime, sink)'),
  })
  .passthrough();

/**
 * Typed parameter accessor for the install command.
 *
 * Extends CommandParams to provide strongly-typed getters for accessing
 * parsed arguments and flags.
 *
 * @example Accessing params in the Run handler
 * ```typescript
 * .Run(async ({ Params }) => {
 *   const type = Params.Type;          // 'runtime' | 'api' | ...
 *   const name = Params.Name;          // string
 *   const dir = Params.Dir;            // string | undefined
 *   const tailwind = Params.Tailwind;  // boolean
 * });
 * ```
 */
class InstallParams extends CommandParams<
  z.infer<typeof InstallArgsSchema>,
  z.infer<typeof InstallFlagsSchema>
> {
  /**
   * Template type from first positional argument.
   */
  get Type(): TemplateTypeKey {
    return this.Arg(0) as TemplateTypeKey;
  }

  /**
   * Project name from second positional argument.
   * Defaults to 'my-<type>' if not provided.
   */
  get Name(): string {
    const name = this.Arg(1);
    return name || `my-${this.Type}`;
  }

  /**
   * Output directory for scaffolding.
   * When specified, scaffolds relative to this path instead of cwd.
   */
  get Dir(): string | undefined {
    return this.Flag('dir');
  }

  /**
   * Force overwrite of existing files.
   */
  get Force(): boolean {
    return this.Flag('force') ?? false;
  }

  /**
   * Include Tailwind CSS in the project.
   */
  get Tailwind(): boolean {
    return this.Flag('tailwind') ?? true;
  }

  /**
   * Include Preact support in the project.
   */
  get Preact(): boolean {
    return this.Flag('preact') ?? true;
  }
}

/**
 * Install command - scaffolds a new EaC project from templates.
 *
 * Uses the fluent Command API to define arguments, flags, services,
 * and the run handler. The command validates that flags are applicable
 * to the selected template type and warns if not.
 */
export default Command('install', 'Install a new EaC project from templates')
  .Args(InstallArgsSchema)
  .Flags(InstallFlagsSchema)
  .Params(InstallParams)
  .Services(async (ctx, ioc) => {
    const dfsCtxMgr = await ioc.Resolve(CLIDFSContextManager);

    if (ctx.Params.Dir) {
      const targetPath = join(Deno.cwd(), ctx.Params.Dir);
      dfsCtxMgr.RegisterCustomDFS('Target', { FileRoot: targetPath });
    }

    const buildDFS = ctx.Params.Dir
      ? await dfsCtxMgr.GetDFS('Target')
      : await dfsCtxMgr.GetExecutionDFS();

    return {
      BuildDFS: buildDFS,
      Scaffolder: new TemplateScaffolder(
        await ioc.Resolve<TemplateLocator>(ioc.Symbol('TemplateLocator')),
        buildDFS,
        {
          name: ctx.Params.Name,
          type: ctx.Params.Type,
          tailwind: ctx.Params.Tailwind,
          preact: ctx.Params.Preact,
        },
      ),
    };
  })
  .Run(
    async ({ Params, Log, Services }): Promise<CommandStatus<InstallResult>> => {
      const { Type, Name, Tailwind, Preact } = Params;

      // Validate flags against template type
      const appliedFlags: string[] = [];

      if (Tailwind) {
        if (isFlagApplicable(Type, 'tailwind')) {
          appliedFlags.push('tailwind');
        } else {
          Log.Warn(
            `Flag --tailwind is not applicable to "${Type}" template, ignoring.`,
          );
        }
      }

      if (Preact) {
        if (isFlagApplicable(Type, 'preact')) {
          appliedFlags.push('preact');
        } else {
          Log.Warn(
            `Flag --preact is not applicable to "${Type}" template, ignoring.`,
          );
        }
      }

      const config = getTemplateConfig(Type);
      Log.Info(`Installing "${Type}" template: ${config.description}`);

      // Scaffold the project
      await Services.Scaffolder.Scaffold({
        templateName: Type,
        outputDir: Name,
        context: {
          name: Name,
          type: Type,
          tailwind: appliedFlags.includes('tailwind'),
          preact: appliedFlags.includes('preact'),
        },
      });

      const fullPath = await Services.BuildDFS.ResolvePath(Name);

      Log.Success(`Project created from "${Type}" template.`);
      Log.Info(`  Initialized at: ${fullPath}`);

      if (appliedFlags.length > 0) {
        Log.Info(`  Applied flags: ${appliedFlags.join(', ')}`);
      }

      return {
        Code: 0,
        Message: `Project installed from "${Type}" template`,
        Data: {
          type: Type,
          name: Name,
          projectPath: fullPath,
          appliedFlags,
        },
      };
    },
  );
