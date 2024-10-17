import {
  DefaultEaCConfig,
  defineEaCConfig,
  EaCRuntime,
  FathymDemoPlugin,
} from '@fathym/eac-runtime';
import { RuntimeLoggingProvider } from '../src/logging/RuntimeLoggingProvider.ts';

export const config = defineEaCConfig({
  LoggingProvider: new RuntimeLoggingProvider(),
  Plugins: [...(DefaultEaCConfig.Plugins || []), new FathymDemoPlugin()],
});

export function configure(_rt: EaCRuntime): Promise<void> {
  return Promise.resolve();
}
