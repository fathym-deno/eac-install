import { parseJsonc } from '../install.deps.ts';
import { Command } from './Command.ts';

export class HelpCommand implements Command {
  public async Run(): Promise<void> {
    const installFilesUrl = import.meta.resolve('../../config/installFiles.jsonc');
    const installFilesResp = await fetch(installFilesUrl);
    const installFileSets = parseJsonc(await installFilesResp.text()) as Record<string, unknown>;

    const templates = Object.keys(installFileSets).sort();

    const helpText = `EaC Runtime Installer

Install a new EaC Runtime project in the current directory.

USAGE:
  deno run -A install.ts [--template <name>] [--force] [--preact=<bool>] [--tailwind=<bool>]

OPTIONS:
  -h, --help           Show this message
  -f, --force          Overwrite existing files
  --template <name>    Select template (default: core)
  --preact=<bool>      Control inclusion of Preact assets (default: true)
  --tailwind=<bool>    Control inclusion of Tailwind assets (default: true)

AVAILABLE TEMPLATES:
  ${templates.map((name) => `- ${name}`).join('\n  ')}

EXAMPLES:
  deno run -A install.ts --template core
  deno run -A install.ts --template sink --force
`;

    console.log(helpText);
  }
}
