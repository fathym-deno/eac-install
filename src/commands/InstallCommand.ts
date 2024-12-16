import { DenoConfig } from 'jsr:@fathym/common@0.2.168/build';
import { EaCRuntimeInstallerFlags } from '../../install.ts';
import { exists, existsSync, mergeWithArrays, parseJsonc, path, toText } from '../install.deps.ts';
import { Command } from './Command.ts';

export class InstallCommand implements Command {
  constructor(protected flags: EaCRuntimeInstallerFlags) {}

  public async Run(): Promise<void> {
    console.log(`Installing Fathym's EaC Runtime...`);

    const configOverridesResp = await fetch(
      import.meta.resolve('../../config/denoConfigOverrides.jsonc'),
    );

    const configOverrides = parseJsonc(
      await configOverridesResp.text(),
    ) as Record<string, Record<string, DenoConfig>>;

    const filesRes = await fetch(
      import.meta.resolve('../../config/installFiles.jsonc'),
    );

    const fileSets = parseJsonc(await filesRes.text()) as Record<
      string,
      [string, string, ((contents: string) => string)?][]
    >;

    const configToOverride = configOverrides[this.flags.template ?? 'core'];

    const filesToCreate = fileSets[this.flags.template ?? 'core'];

    filesToCreate
      .find(([_fromFile, toFile]) => toFile === './deno.jsonc')
      ?.push((contents: string) => this.ensureDenoConfigSetup(contents, configToOverride));

    const installDirectory = path.resolve('.');

    await this.ensureFilesCreated(installDirectory, filesToCreate);
  }

  protected async copyTemplateFile(
    installDirectory: string,
    filePath: string,
    outputFilePath: string,
    transformer?: (contents: string) => string,
  ): Promise<void> {
    const outputTo = path.join(installDirectory, outputFilePath);

    if (!(await exists(outputTo))) {
      const dir = await path.dirname(outputTo);

      dir.split('\\').reduce((path, next) => {
        path.push(next);

        if (!existsSync(path.join('\\'))) {
          Deno.mkdirSync(path.join('\\'));
        }

        return path;
      }, new Array<string>());

      const file = await this.openTemplateFile(filePath);

      let fileContents = await toText(file);

      fileContents = fileContents
        .replaceAll('.ts.template', '.ts')
        .replaceAll('.tsx.template', '.tsx');

      if (transformer) {
        const transformed = transformer(fileContents);

        await Deno.writeTextFile(outputTo, transformed, {
          append: false,
          create: true,
        });
      } else {
        await Deno.writeTextFile(outputTo, fileContents, {
          append: false,
          create: true,
        });
      }
    } else {
      console.log(`Skipping file ${outputTo}, because it already exists.`);
    }
  }

  protected ensureDenoConfigSetup(
    contents: string,
    denoConfigOverrides: Record<string, unknown>,
  ): string {
    // Is there a Deno type that represents the configuration file?
    let config: Record<string, unknown> = JSON.parse(contents);

    config = mergeWithArrays(config, denoConfigOverrides ?? {});

    const configStr = JSON.stringify(config, null, 2) + '\n';

    return configStr;
  }

  protected async ensureFilesCreated(
    installDirectory: string,
    filesToCreate: [string, string, ((contents: string) => string)?][],
  ): Promise<void> {
    for (const [inputFile, outputFile, transformer] of filesToCreate) {
      await this.copyTemplateFile(
        installDirectory,
        inputFile,
        outputFile,
        transformer,
      );
    }
  }

  protected async openTemplateFile(
    filePath: string,
  ): Promise<ReadableStream<Uint8Array>> {
    const fileUrl = new URL(filePath, import.meta.url);

    if (fileUrl.protocol.startsWith('http')) {
      const fileResp = await fetch(fileUrl, {
        headers: {
          'user-agent': 'Deno\\',
        },
      });

      return fileResp.body!;
    } else {
      const file = await Deno.open(fileUrl, {
        read: true,
      });

      return file.readable;
    }
  }
}
