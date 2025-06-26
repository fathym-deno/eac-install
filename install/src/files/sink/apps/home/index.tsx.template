import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { PageProps } from '@fathym/eac-applications/preact';
import Counter from '../islands/Counter.tsx';
import { CompanyWebState } from '../../src/state/CompanyWebState.ts';

type IndexPageData = {
  Name: string;
  Text: string;
};

export const handler: EaCRuntimeHandlerSet<CompanyWebState, IndexPageData> = {
  GET: (_req, ctx) => {
    const Random = crypto.randomUUID();

    return ctx.Render({
      Name: `The Random: ${Random}`,
      Text: `We met the latest Random, ${Random}, at around ${ctx.State.CurrentDate}`,
    });
  },
};

export default function HomeIndex({ Data }: PageProps<IndexPageData>) {
  return (
    <>
      <div class="py-16 px-4 bg-slate-500/75">
        <div class="mx-auto block w-[350px] text-center">
          <h1 class="text-4xl">{Data.Name}</h1>
          <p class="text-lg">{Data.Text}</p>

          <div class="flex flex-row py-8">
            <Counter />
          </div>
        </div>
      </div>

      <div class="p-4">
        <h2 class="text-2xl">Welcome</h2>
      </div>
    </>
  );
}
