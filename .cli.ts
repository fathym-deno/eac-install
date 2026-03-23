import { CLI } from "@fathym/cli";

/**
 * The ftm-eac-install module for EaC Install CLI.
 * Provides commands for scaffolding EaC projects.
 */
const eacInstallCli = CLI(
  "EaC Install CLI",
  "ftm-eac-install",
  "0.0.1",
)
  .Origin(import.meta.url)
  .Commands("./commands")
  .Templates("./templates");

export default eacInstallCli;
