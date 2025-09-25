import { parse as parseJsonc } from 'jsr:@std/jsonc@1.0.2';
import { ensureDir } from 'jsr:@std/fs@1.0.3/ensure-dir';
import { dirname, join } from 'jsr:@std/path@1.1.2';

const decoder = new TextDecoder();

type StepStatus = 'pass' | 'fail';

interface Options {
  templates?: string[];
  all: boolean;
  keep: boolean;
  jsonPath?: string;
  allowDirty: boolean;
}

interface CommandResult {
  code: number;
  durationMs: number;
  stdout: string;
  stderr: string;
}

interface StepResult {
  status: StepStatus;
  code: number;
  durationMs: number;
  logPath: string;
}

interface TemplateResult {
  name: string;
  install: StepResult;
  build?: StepResult;
  notes: string[];
}

interface Summary {
  startedAt: string;
  finishedAt: string;
  templates: TemplateResult[];
}

function parseArgs(argv: string[]): Options {
  const opts: Options = { all: false, keep: false, allowDirty: false };

  for (let idx = 0; idx < argv.length; idx++) {
    const arg = argv[idx];
    switch (arg) {
      case '--template': {
        opts.templates ??= [];
        const value = argv[++idx];
        if (!value) {
          throw new Error('--template requires a value');
        }
        opts.templates.push(value);
        break;
      }
      case '--all':
        opts.all = true;
        break;
      case '--keep':
        opts.keep = true;
        break;
      case '--json': {
        const value = argv[++idx];
        if (!value) {
          throw new Error('--json requires a value');
        }
        opts.jsonPath = value;
        break;
      }
      case '--allow-dirty':
        opts.allowDirty = true;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return opts;
}

async function checkCleanWorkingTree(allowDirty: boolean) {
  if (allowDirty) {
    return;
  }

  try {
    const gitStatus = new Deno.Command('git', {
      args: ['status', '--porcelain'],
      stdout: 'piped',
      stderr: 'piped',
    });
    const result = await gitStatus.output();
    if (result.code !== 0) {
      const stderr = decoder.decode(result.stderr).trim();
      const stdout = decoder.decode(result.stdout).trim();
      throw new Error(`git status failed (${result.code}): ${stderr || stdout}`);
    }

    const stdout = decoder.decode(result.stdout).trim();
    if (stdout.length > 0) {
      throw new Error('Working tree is dirty. Commit, stash, or rerun with --allow-dirty.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('git')) {
      console.warn(`??  Unable to verify git status: ${error.message}`);
      return;
    }
    throw error;
  }
}

async function loadTemplateNames(): Promise<string[]> {
  const raw = await Deno.readTextFile('config/installFiles.jsonc');
  const parsed = parseJsonc(raw) as Record<string, unknown>;
  return Object.keys(parsed).sort();
}

async function runCommand(
  executable: string,
  args: string[],
  cwd: string,
  logPath: string,
): Promise<CommandResult> {
  const started = performance.now();
  const command = new Deno.Command(executable, {
    args,
    cwd,
    stdout: 'piped',
    stderr: 'piped',
  });

  const output = await command.output();
  const durationMs = performance.now() - started;
  const stdout = decoder.decode(output.stdout);
  const stderr = decoder.decode(output.stderr);

  const logBody = [
    `command: ${[executable, ...args].join(' ')}`,
    `cwd: ${cwd}`,
    `exitCode: ${output.code}`,
    '--- stdout ---',
    stdout.trimEnd(),
    '--- stderr ---',
    stderr.trimEnd(),
    '',
  ].join('\n');

  await Deno.writeTextFile(logPath, logBody, { create: true });

  return { code: output.code, durationMs, stdout, stderr };
}

function toStepResult(logPath: string, result: CommandResult): StepResult {
  return {
    status: result.code === 0 ? 'pass' : 'fail',
    code: result.code,
    durationMs: Math.round(result.durationMs),
    logPath,
  };
}

async function removeDirectory(path: string) {
  try {
    await Deno.remove(path, { recursive: true });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return;
    }
    throw error;
  }
}

async function main() {
  const options = parseArgs(Deno.args);
  const startedAt = new Date().toISOString();
  const repoRoot = Deno.cwd();
  const installScript = join(repoRoot, 'install.ts');

  await checkCleanWorkingTree(options.allowDirty);

  const availableTemplates = await loadTemplateNames();
  const templates = (() => {
    if (options.all || !options.templates || options.templates.length === 0) {
      if (options.all) {
        return availableTemplates;
      }
      const fallback = availableTemplates[0] ?? 'core';
      return [fallback];
    }
    return options.templates;
  })();

  const runId = startedAt.replace(/[:.]/g, '-');
  const tmpRoot = join('tests', 'tmp', runId);
  await ensureDir(tmpRoot);

  const templateResults: TemplateResult[] = [];

  for (const template of templates) {
    const templateRoot = join(tmpRoot, template);
    const workDir = join(templateRoot, 'work');
    await ensureDir(workDir);
    const logsDir = templateRoot;

    const notes: string[] = [];

    console.log(`\n[${template}] install`);
    const installLog = join(logsDir, 'install.log');
    const installResult = await runCommand(
      'deno',
      ['run', '-A', installScript, '--template', template, '--force'],
      workDir,
      installLog,
    );
    const installStep = toStepResult(installLog, installResult);

    let buildStep: StepResult | undefined;

    if (installStep.status === 'pass') {
      console.log(`[${template}] build`);
      const buildLog = join(logsDir, 'build.log');
      const buildResult = await runCommand(
        'deno',
        ['task', 'build'],
        workDir,
        buildLog,
      );
      buildStep = toStepResult(buildLog, buildResult);

      if (buildStep.status === 'pass' && !options.keep) {
        await removeDirectory(workDir);
      } else if (buildStep.status === 'fail') {
        notes.push('Build failed; work directory retained for inspection.');
      }
    } else {
      notes.push('Install failed; build step skipped.');
    }

    templateResults.push({
      name: template,
      install: installStep,
      build: buildStep,
      notes,
    });
  }

  const finishedAt = new Date().toISOString();
  const summary: Summary = {
    startedAt,
    finishedAt,
    templates: templateResults,
  };

  const defaultReportPath = join('tests', 'reports', `${runId}.json`);
  const reportPath = options.jsonPath ?? defaultReportPath;
  await ensureDir(dirname(reportPath));
  await Deno.writeTextFile(reportPath, JSON.stringify(summary, null, 2));

  console.log('\nSummary report:', reportPath);
  for (const result of templateResults) {
    const checks = [result.install, result.build].filter(Boolean) as StepResult[];
    const ok = checks.every((step) => step.status === 'pass');
    console.log(`${ok ? 'OK' : 'FAIL'} ${result.name}`);
  }

  const anyFailures = templateResults.some((result) => {
    if (result.install.status === 'fail') return true;
    if (result.build && result.build.status === 'fail') return true;
    return false;
  });

  if (anyFailures) {
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
