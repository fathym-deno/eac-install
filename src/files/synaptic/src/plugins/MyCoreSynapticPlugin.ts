import { EaCRuntimeConfig, EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac-runtime';

export default class MyCoreSynapticPlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(_config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig = {
      Name: MyCoreSynapticPlugin.name,
      Plugins: [],
      EaC: {},
    };

    return Promise.resolve(pluginConfig);
  }
}
