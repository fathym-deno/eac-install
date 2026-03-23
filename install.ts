/**
 * Entry point for the EaC Install CLI.
 *
 * This module runs the ftm-eac-install CLI when executed directly.
 * It can be invoked with: `deno run -A jsr:@fathym/eac-install`
 *
 * @module
 */

import CLI from "./.cli.ts";
import { CLIRunner, Execute } from "@fathym/cli";

await CLIRunner()
  .FromModuleBuilder(CLI, Deno.args)
  .Run(Execute());
