import {
  buildEaCTestIoC,
  EaCRuntimePlugin,
  EverythingAsCode,
  EverythingAsCodeSynaptic,
} from './tests.deps.ts';
import RuntimePlugin from '../src/plugins/RuntimePlugin.ts';

export const AI_LOOKUP = 'core';

const testEaC = {} as EverythingAsCodeSynaptic;

export async function buildTestIoC(
  eac: EverythingAsCode,
  plugins: EaCRuntimePlugin[] = [new RuntimePlugin()],
  useDefault = true,
  useDefaultPlugins = false,
) {
  return await buildEaCTestIoC(
    useDefault ? testEaC : {},
    eac,
    plugins,
    useDefaultPlugins,
  );
}
