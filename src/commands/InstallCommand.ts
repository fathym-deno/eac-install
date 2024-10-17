import { EaCRuntimeInstallerFlags } from '../../install.ts';
import { exists, existsSync, mergeWithArrays, parseJsonc, path, toText } from '../install.deps.ts';
import { Command } from './Command.ts';

export class InstallCommand implements Command {
  protected filesToCreate: [string, string, ((contents: string) => string)?][];

  constructor(protected flags: EaCRuntimeInstallerFlags) {
    const fileSets = parseJsonc(
      Deno.readTextFileSync('../config/installFiles.jsonc'),
    ) as Record<string, typeof this.filesToCreate>;

    this.filesToCreate = fileSets[flags.template ?? 'core'];

    this.filesToCreate
      .find(([_fromFile, toFile]) => toFile === './deno.jsonc')
      ?.push((contents: string) => this.ensureDenoConfigSetup(contents));
  }

  public async Run(): Promise<void> {
    console.log(`Installing Fathym's EaC Runtime...`);

    const installDirectory = path.resolve('.');

    await this.ensureFilesCreated(installDirectory);

    const devTs = Deno.readTextFileSync(path.resolve('./dev.ts'));

    console.log(devTs);
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

      if (transformer) {
        const fileContents = await toText(file);

        const transformed = transformer(fileContents);

        await Deno.writeTextFile(outputTo, transformed, {
          append: false,
          create: true,
        });
      } else {
        const fileContents = await toText(file);

        await Deno.writeTextFile(outputTo, fileContents, {
          append: false,
          create: true,
        });
      }
    } else {
      console.log(`Skipping file ${outputTo}, because it already exists.`);
    }
  }

  protected ensureDenoConfigSetup(contents: string): string {
    // Is there a Deno type that represents the configuration file?
    let config: Record<string, unknown> = JSON.parse(contents);

    if (this.flags.template !== 'atomic' && this.flags.template !== 'library') {
      config = mergeWithArrays(config, {
        imports: {
          '@fathym/common': 'jsr:@fathym/common@0',
          '@fathym/eac': 'jsr:@fathym/eac@0',
          '@fathym/eac-runtime': 'jsr:@fathym/eac-runtime@0',
          '@std/log': 'jsr:@std/log@0.224.6',
        },
      });
    }

    if (
      this.flags.template === 'preact' ||
      this.flags.template === 'synaptic' ||
      this.flags.template === 'sink'
    ) {
      config = mergeWithArrays(config, {
        imports: {
          '@fathym/ioc': 'jsr:@fathym/ioc@0',
        },
      });
    }

    if (this.flags.template === 'preact' || this.flags.template === 'sink') {
      config = mergeWithArrays(config, {
        imports: {
          '@fathym/atomic': 'jsr:@fathym/atomic-design-kit@0',
          '@fathym/atomic-icons': 'jsr:@fathym/atomic-icons@0',
        },
      });
    }

    if (this.flags.template === 'synaptic' || this.flags.template === 'sink') {
      config = mergeWithArrays(config, {
        imports: {
          '@fathym/synaptic': 'jsr:@fathym/synaptic@0',
          'html-to-text': 'npm:html-to-text@9.0.5',
          '@langchain/community': 'npm:@langchain/community@0.3.0',
          '@langchain/core': 'npm:@langchain/core@0.3.1',
          '@langchain/langgraph': 'npm:@langchain/langgraph@0.2.3',
          'pdf-parse': 'npm:pdf-parse@1.1.1',
          zod: 'npm:zod@3.23.8',
        },
      });
    }

    if (this.flags.preact && this.flags.template !== 'library') {
      config = mergeWithArrays(config, {
        imports: {
          preact: 'npm:preact@10.20.1',
          // 'preact/jsx-runtime': 'npm:preact@10.20.1/jsx-runtime',
        },
        compilerOptions: {
          jsx: 'react-jsx',
          jsxImportSource: 'preact',
        },
      });
    }

    if (
      this.flags.tailwind &&
      this.flags.template !== 'api' &&
      this.flags.template !== 'atomic' &&
      this.flags.template !== 'library' &&
      this.flags.template !== 'synaptic'
    ) {
      config = mergeWithArrays(config, {
        imports: {
          tailwindcss: 'npm:tailwindcss@3.4.1',
          'tailwindcss/': 'npm:/tailwindcss@3.4.1/',
          'tailwindcss/plugin': 'npm:/tailwindcss@3.4.1/plugin.js',
          'tailwindcss/unimportant': 'npm:tailwindcss-unimportant@2.1.1',
        },
      });
    }

    const configStr = JSON.stringify(config, null, 2) + '\n';

    return configStr;
  }

  protected async ensureFilesCreated(installDirectory: string): Promise<void> {
    for (const [inputFile, outputFile, transformer] of this.filesToCreate) {
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
