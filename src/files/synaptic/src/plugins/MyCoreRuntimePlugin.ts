import {
  EaCRuntimeConfig,
  EaCRuntimeEaC,
  EaCRuntimePlugin,
  EaCRuntimePluginConfig,
  FathymAzureContainerCheckPlugin,
  FathymDFSFileHandlerPlugin,
  FathymEaCServicesPlugin,
} from '@fathym/eac-runtime';
import { EaCDenoKVDatabaseDetails } from '@fathym/eac/databases';
import { EaCLocalDistributedFileSystemDetails } from '@fathym/eac/dfs';
import { IoCContainer } from '@fathym/ioc';
import {
  EaCSynapticCircuitsProcessor,
  EverythingAsCodeSynaptic,
  FathymSynapticPlugin,
} from '@fathym/synaptic';
import { DefaultMyCoreProcessorHandlerResolver } from './DefaultMyCoreProcessorHandlerResolver.ts';
import SynapticPlugin from './SynapticPlugin.ts';

export default class MyCoreRuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig = {
      Name: MyCoreRuntimePlugin.name,
      Plugins: [
        new FathymAzureContainerCheckPlugin(),
        new FathymEaCServicesPlugin(),
        new FathymDFSFileHandlerPlugin(),
        new SynapticPlugin(),
        new FathymSynapticPlugin(),
      ],
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          core: {
            Details: {
              Name: 'Core Micro Applications',
              Description: 'The Core Micro Applications to use.',
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
              circuits: {
                PathPattern: '/circuits*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          circuits: {
            Details: {
              Name: 'Circuits',
              Description: 'The API for accessing circuits',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'SynapticCircuits',
              IsCodeDriven: true,
            } as EaCSynapticCircuitsProcessor,
          },
        },
        AIs: {},
        Circuits: {
          $circuitsDFSLookups: ['local:circuits'],
        },
        Databases: {
          thinky: {
            Details: {
              Type: 'DenoKV',
              Name: 'Thinky',
              Description: 'The Deno KV database to use for thinky',
              DenoKVPath: Deno.env.get('THINKY_DENO_KV_PATH') || undefined,
            } as EaCDenoKVDatabaseDetails,
          },
        },
        DFSs: {
          'local:circuits': {
            Details: {
              Type: 'Local',
              FileRoot: './circuits/',
              Extensions: ['.ts'],
              WorkerPath: import.meta.resolve(
                '@fathym/eac-runtime/workers/local',
              ),
            } as EaCLocalDistributedFileSystemDetails,
          },
        },
      } as EaCRuntimeEaC | EverythingAsCodeSynaptic,
    };

    pluginConfig.IoC!.Register(DefaultMyCoreProcessorHandlerResolver, {
      Type: pluginConfig.IoC!.Symbol('ProcessorHandlerResolver'),
    });

    return Promise.resolve(pluginConfig);
  }
}
