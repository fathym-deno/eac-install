import { EaCRuntimeHandlers } from '@fathym/eac-runtime';
import { CompanyAPIState } from '../../src/state/CompanyAPIState.ts';

export default {
  GET(_req, ctx) {
    ctx.State.Random = crypto.randomUUID();

    return ctx.Next();
  },
} as EaCRuntimeHandlers<CompanyAPIState>;
