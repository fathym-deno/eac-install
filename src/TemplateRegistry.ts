/**
 * Template type registry for EaC Install CLI.
 *
 * Defines available project template types and their supported flags.
 * The registry is used by the install command to:
 * - Validate template type arguments
 * - Determine which flags are applicable to each template
 * - Provide help text and descriptions
 *
 * @example Using the registry
 * ```ts
 * import { TemplateRegistry, TemplateType } from './TemplateRegistry.ts';
 *
 * // Get template config
 * const config = TemplateRegistry.runtime;
 * console.log(config.description); // "Standard web runtime (proxy)"
 * console.log(config.flags); // ['tailwind', 'preact']
 *
 * // Parse and validate template type
 * const parsed = TemplateType.parse('runtime'); // 'runtime'
 * const invalid = TemplateType.safeParse('invalid'); // { success: false, ... }
 * ```
 *
 * @module
 */

import { z } from '../.deps.ts';

/**
 * Configuration for a single template type.
 *
 * @property description - Human-readable description shown in help
 * @property flags - List of flag names applicable to this template
 */
export interface TemplateConfig {
  /** Human-readable description of the template type */
  description: string;
  /** Flags that are applicable to this template type */
  flags: readonly string[];
}

/**
 * Registry of all available EaC project templates.
 *
 * Each template type maps to a configuration object containing:
 * - A description for help text
 * - A list of applicable flags
 *
 * Templates are scaffolded from the `templates/<type>/` directory
 * combined with shared templates from `templates/.shared/`.
 *
 * @example Template types
 * - `runtime` - Standard web runtime with proxy support
 * - `api` - API-focused project for building REST endpoints
 * - `synaptic` - AI/synaptic runtime for circuit-based AI
 * - `atomic` - Atomic design component library
 * - `library` - Reusable TypeScript library
 * - `preact` - Preact-based web application
 * - `sink` - Full-featured project with all capabilities
 */
export const TemplateRegistry = {
  /**
   * Standard web runtime template.
   * Creates a basic EaC runtime project with proxy configuration.
   */
  runtime: {
    description: 'Standard web runtime (proxy)',
    flags: ['tailwind', 'preact'] as const,
  },

  /**
   * API-focused template.
   * Creates a project optimized for REST API development
   * with middleware and route handler examples.
   */
  api: {
    description: 'API-focused project',
    flags: ['tailwind'] as const,
  },

  /**
   * AI/Synaptic runtime template.
   * Creates a project for building AI circuits using
   * the Synaptic framework for LLM-powered applications.
   */
  synaptic: {
    description: 'AI/synaptic runtime',
    flags: [] as const,
  },

  /**
   * Atomic design component library template.
   * Creates a reusable component library following
   * atomic design principles (atoms, molecules, organisms).
   */
  atomic: {
    description: 'Atomic components library',
    flags: [] as const,
  },

  /**
   * Reusable library template.
   * Creates a standard TypeScript library project
   * with exports, tests, and documentation structure.
   */
  library: {
    description: 'Reusable library',
    flags: [] as const,
  },

  /**
   * Preact-based web application template.
   * Creates a web application using Preact with
   * islands architecture for partial hydration.
   */
  preact: {
    description: 'Preact-based project',
    flags: ['tailwind'] as const,
  },

  /**
   * Full-featured "kitchen sink" template.
   * Creates a comprehensive project including all features:
   * API, web UI, Preact islands, and AI circuits.
   */
  sink: {
    description: 'Full-featured sink project',
    flags: ['tailwind', 'preact'] as const,
  },
} as const satisfies Record<string, TemplateConfig>;

/**
 * Type representing all valid template type keys.
 */
export type TemplateTypeKey = keyof typeof TemplateRegistry;

/**
 * Zod enum schema for validating template types.
 *
 * Use this schema to parse and validate template type arguments
 * in commands. Invalid values will result in a Zod validation error.
 *
 * @example
 * ```ts
 * // Parse with validation
 * const type = TemplateType.parse('runtime'); // 'runtime'
 *
 * // Safe parse (doesn't throw)
 * const result = TemplateType.safeParse('invalid');
 * if (!result.success) {
 *   console.error('Invalid template type');
 * }
 * ```
 */
export const TemplateType = z.enum(
  Object.keys(TemplateRegistry) as [TemplateTypeKey, ...TemplateTypeKey[]],
);

/**
 * Get the configuration for a specific template type.
 *
 * @param type - The template type key
 * @returns The template configuration
 *
 * @example
 * ```ts
 * const config = getTemplateConfig('runtime');
 * console.log(config.description); // "Standard web runtime (proxy)"
 * console.log(config.flags); // ['tailwind', 'preact']
 * ```
 */
export function getTemplateConfig(type: TemplateTypeKey): TemplateConfig {
  return TemplateRegistry[type];
}

/**
 * Check if a flag is applicable to a template type.
 *
 * @param type - The template type key
 * @param flag - The flag name to check
 * @returns True if the flag is applicable
 *
 * @example
 * ```ts
 * isFlagApplicable('runtime', 'tailwind'); // true
 * isFlagApplicable('library', 'tailwind'); // false
 * ```
 */
export function isFlagApplicable(
  type: TemplateTypeKey,
  flag: string,
): boolean {
  const config = TemplateRegistry[type];
  return (config.flags as readonly string[]).includes(flag);
}

/**
 * Get all available template type names.
 *
 * @returns Array of template type keys
 *
 * @example
 * ```ts
 * const types = getTemplateTypes();
 * // ['runtime', 'api', 'synaptic', 'atomic', 'library', 'preact', 'sink']
 * ```
 */
export function getTemplateTypes(): TemplateTypeKey[] {
  return Object.keys(TemplateRegistry) as TemplateTypeKey[];
}
