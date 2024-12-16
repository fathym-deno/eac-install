import { EaCRuntimePlugin, EaCRuntimePluginConfig } from '@fathym/eac/runtime/plugins';
import { EaCRuntimeConfig } from '@fathym/eac/runtime/config';
import { EverythingAsCode } from '@fathym/eac';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';
import { EaCProxyProcessor } from '@fathym/eac-applications/processors';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications
    > = {
      Name: RuntimePlugin.name,
      Plugins: [],
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'Core Golden Path Micro Applications',
              Description: 'The Core Golden Path Micro Applications to use.',
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: config.Server.port || 8000,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: config.Server.port || 8000,
              },
            },
            ModifierResolvers: {},
            ApplicationResolvers: {
              api: {
                PathPattern: '/api*',
                Priority: 300,
              },
              synaptic: {
                PathPattern: '/api/synaptic*',
                Priority: 500,
              },
              web: {
                PathPattern: '*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          api: {
            Details: {
              Name: 'API',
              Description: 'The API proxy.',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('API_ROOT')!,
            } as EaCProxyProcessor,
          },
          synaptic: {
            Details: {
              Name: 'Synaptic',
              Description: 'The API for accessing synaptic cricuits',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('SYNAPTIC_ROOT')!,
            } as EaCProxyProcessor,
          },
          web: {
            Details: {
              Name: 'Dashboard',
              Description: 'The Dashboard.',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: Deno.env.get('WEB_ROOT')!,
            } as EaCProxyProcessor,
          },
        },
      },
    };

    return Promise.resolve(pluginConfig);
  }
}
