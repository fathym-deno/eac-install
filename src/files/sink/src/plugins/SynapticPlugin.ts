import { EaCRuntimeConfig, EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac-runtime';

export default class SynapticPlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(_config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig = {
      Name: SynapticPlugin.name,
      Plugins: [],
      EaC: {},
    };

    return Promise.resolve(pluginConfig);
  }
}
