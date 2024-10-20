import { DefaultEaCConfig, defineEaCConfig, EaCRuntime } from '@fathym/eac-runtime';
import MyCoreRuntimePlugin from '../src/plugins/MyCoreRuntimePlugin.ts';
import { RuntimeLoggingProvider } from '../src/logging/RuntimeLoggingProvider.ts';

export const config = defineEaCConfig({
  LoggingProvider: new RuntimeLoggingProvider(),
  Plugins: [...(DefaultEaCConfig.Plugins || []), new MyCoreRuntimePlugin()],
});

export function configure(_rt: EaCRuntime): Promise<void> {
  return Promise.resolve();
}
