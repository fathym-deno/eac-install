import { IoCContainer } from '@fathym/ioc';
import { DefaultAtomicIconsProcessorHandlerResolver } from '@fathym/atomic-icons/plugin';
import { DefaultSynapticProcessorHandlerResolver } from '@fathym/synaptic';
import {
  DefaultProcessorHandlerResolver,
  ProcessorHandlerResolver,
} from '@fathym/eac-applications/runtime/processors';
import { EaCApplicationProcessorConfig } from '@fathym/eac-applications/processors';
import { EverythingAsCode } from '@fathym/eac';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';

export class DefaultMyCoreProcessorHandlerResolver implements ProcessorHandlerResolver {
  public async Resolve(
    ioc: IoCContainer,
    appProcCfg: EaCApplicationProcessorConfig,
    eac: EverythingAsCode & EverythingAsCodeApplications,
  ) {
    const synapticResolver = new DefaultSynapticProcessorHandlerResolver();

    let resolver = await synapticResolver.Resolve(ioc, appProcCfg, eac);

    if (!resolver) {
      const atomicIconResolver = new DefaultAtomicIconsProcessorHandlerResolver();

      resolver = await atomicIconResolver.Resolve(ioc, appProcCfg, eac);
    }

    if (!resolver) {
      const defaultResolver = new DefaultProcessorHandlerResolver();

      resolver = await defaultResolver.Resolve(ioc, appProcCfg, eac);
    }

    return resolver;
  }
}
