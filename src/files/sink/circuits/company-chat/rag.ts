import {
  CircuitConfiguration,
  CircuitContext,
  EaCAzureSearchAIVectorStoreDetails,
  EaCChatPromptNeuron,
  EaCCheerioWebDocumentLoaderDetails,
  EaCCompoundDocumentLoaderDetails,
  EaCDenoKVIndexerDetails,
  EaCDenoKVSaverPersistenceDetails,
  EaCGraphCircuitDetails,
  lastAiNotHumanMessages,
} from '@fathym/synaptic';
import { AzureAISearchQueryType } from '@langchain/community/vectorstores/azure_aisearch';
import SynapticPlugin from '../../src/plugins/SynapticPlugin.ts';
import { CompanyChatGraphState } from '../../src/circuits/company-chat/CompanyChatGraphState.ts';
import { END, START } from '@langchain/langgraph';
import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { CompanyChatCircuitInput } from '../../src/circuits/company-chat/CompanyChatCircuitInput.ts';

export const Configure: CircuitConfiguration<'Graph'> = (
  ctx: CircuitContext,
) => {
  const AIHuntersCompanyInfoUrls = loadCompanyInfoUrls();

  return {
    AIaC: {
      Indexers: {
        ['company-chat']: {
          Details: {
            Type: 'DenoKV',
            Name: 'AIHunters',
            Description: 'The aaa_bbb_ccc document indexer to use.',
            DenoKVDatabaseLookup: 'thinky',
            RootKey: ['Synaptic', 'Indexers', 'CompanyChat'],
          } as EaCDenoKVIndexerDetails,
        },
      },
      Loaders: {
        ...AIHuntersCompanyInfoUrls.reduce((acc, url) => {
          acc[url] = {
            Details: {
              Type: 'CheerioWeb',
              URL: url,
            } as EaCCheerioWebDocumentLoaderDetails,
          };

          return acc;
        }, {} as Record<string, { Details: EaCCheerioWebDocumentLoaderDetails }>),
        ['company-chat']: {
          Details: {
            Type: 'CompoundDocument',
            LoaderLookups: AIHuntersCompanyInfoUrls.map((url) => ctx.AIaCLookup(url)),
          } as EaCCompoundDocumentLoaderDetails,
        },
      },
      Persistence: {
        'company-chat': {
          Details: {
            Type: 'DenoKVSaver',
            DatabaseLookup: 'thinky',
            RootKey: ['Thinky', 'company-chat'],
            CheckpointTTL: 1 * 1000 * 60 * 60 * 24 * 7, // 7 Days
          } as EaCDenoKVSaverPersistenceDetails,
        },
      },
      Retrievers: {
        [`company-chat`]: {
          Details: {
            RefreshOnStart: false,
            LoaderLookups: [ctx.AIaCLookup('company-chat')],
            LoaderTextSplitterLookups: {
              [ctx.AIaCLookup('company-chat')]: ctx.AIaCLookup(
                'html',
                SynapticPlugin.name,
              ),
            },
            IndexerLookup: ctx.AIaCLookup('company-chat'),
            VectorStoreLookup: ctx.AIaCLookup('company-chat'),
          },
        },
      },
      VectorStores: {
        ['company-chat']: {
          Details: {
            Type: 'AzureSearchAI',
            Name: 'Azure Search AI',
            Description: 'The Vector Store for interacting with Azure Search AI.',
            APIKey: Deno.env.get('AZURE_AI_SEARCH_KEY')!,
            Endpoint: Deno.env.get('AZURE_AI_SEARCH_ENDPOINT')!,
            EmbeddingsLookup: `${SynapticPlugin.name}|azure-openai`,
            IndexerLookup: ctx.AIaCLookup('company-chat'),
            IndexName: 'company-chat',
            QueryType: AzureAISearchQueryType.SimilarityHybrid,
          } as EaCAzureSearchAIVectorStoreDetails,
        },
      },
    },
    Type: 'Graph',
    Name: 'RAG Chat',
    Description:
      'This circuit is used to have conversation about aaa_bbb_ccc and all its capabilities.',
    IsCallable: true,
    PersistenceLookup: ctx.AIaCLookup('company-chat'),
    InputSchema: CompanyChatCircuitInput,
    State: CompanyChatGraphState,
    BootstrapInput({ Input }: CompanyChatCircuitInput) {
      return {
        Messages: Input ? [new HumanMessage(Input)] : [],
      };
    },
    Neurons: {
      chat: 'company-chat',
      welcome: {
        Type: 'ChatPrompt',
        PersonalityLookup: `${SynapticPlugin.name}|Employee`,
        SystemMessage:
          `Greet the user, and let them know you can help answer any aaa_bbb_ccc related questions. `,
        NewMessages: [new HumanMessage('Hi')],
        Neurons: {
          '': `llm`,
        },
        BootstrapOutput(msg: BaseMessage) {
          return {
            Messages: [msg],
          } as CompanyChatGraphState;
        },
      } as EaCChatPromptNeuron,
    },
    Edges: {
      [START]: {
        Node: {
          chat: 'chat',
          welcome: 'welcome',
          [END]: END,
        },
        Condition(state: CompanyChatGraphState, cfg) {
          const lastAiMsgs = lastAiNotHumanMessages(state.Messages);

          if (cfg?.configurable?.peek || lastAiMsgs?.length) {
            return END;
          }

          if (!state.Messages?.length) {
            return 'welcome';
          }

          return 'chat';
        },
      },
      welcome: END,
      chat: END,
    },
  } as EaCGraphCircuitDetails;
};

function loadCompanyInfoUrls() {
  return [
    'https://www.forbes.com/sites/trondarneundheim/2022/06/07/the-future-of-manufacturing-execution-systems-is-simplicity/',
    'https://www.newcastlesys.com/blog/5-excellent-reasons-to-adopt-mes-manufacturing-execution-systems',
    'https://www.aiscorp.com/factory-4-0/mes/',
    'https://www.sciencedirect.com/science/article/pii/S0166361520305340',
    'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7697927/',
    'https://corsosystems.com/manufacturing-execution-systems-guide',
    'https://fuuz.com/why-do-industrial-production-managers-need-mes-software/',
    'https://www.smartindustry.com/examples-of-transformation/business-models/article/11304934/industry-40-manufacturing-execution-systems-mes-smart-industry-internet-of-things-industrial-internet-of-things',
    'https://discover.aveva.com/paid-search-aoc-manu-ops/whitepaper-accelerate-your-manufacturing-transformation-by-enhancing-your-hmi-scada-v2?utm_term=industrial%20manufacturing%20software&utm_campaign=G_S_A_NA_All_Campaign_Solution_Operations_Operate-AOC&utm_source=adwords&utm_medium=ppc&gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfC8m42COxWE4Uex3u1MkQ145u7W5npFGNo1iG4oi4wKNpPi8Gv5Ob4aAqq-EALw_wcB',
    'https://go.parsec-corp.com/traksys-mes-bwn-1?utm_source=google&utm_medium=cpc&utm_campaign=parsec_2022_q3_upper-awareness&gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfDJALmPLM9zd5zRPcP8Qd2dOcpImbMsL8z9qMRGKoWzwkfRd97iYL0aAmGxEALw_wcB',
    'https://www.firstresonance.io/industries/robotics-manufacturing?gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfD5g8VBbmYNYnTv7E77FYejMgAC2CvVEef_N5VbuQfS_hkH407KdZgaAoeyEALw_wcB',
    'https://erp.business-software.com/top-20-erp-software-find-best-erp-today/?types=systems&cq_src=google_ads&cq_cmp=9777813482&cq_con=99562845243&cq_term=erp%20for%20manufacturing&cq_med=&cq_plac=&cq_net=g&cq_pos=&cq_plt=gp&gn=GoogleSearch&kw=erp%20for%20manufacturing&mt=b&nw=g&pl=&dv=c&dvm=&ap=&cid=614361131973&agid=5837&gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfDGB0tdYB4FsJG59_T5LNwcaTOVdEyEvQf3Z-5_3J8tiyDiJuPd-GkaAop1EALw_wcB',
    'https://www.plantengineering.com/articles/how-an-mes-can-help-companies-take-advantage-of-manufacturing-changes/',
    'https://www.machinemetrics.com/blog/machine-integration',
    'https://www.livetracking.io/live-tracking-blogs/evolution-manufacturing-execution-systems-mes',
    'https://www.accruent.com/resources/knowledge-hub/manufacturing-execution-system',
    'https://www.plex.com/products/manufacturing-execution-system/what-is-mes',
    'https://solutionsreview.com/enterprise-resource-planning/the-best-manufacturing-execution-systems-mes-to-consider/',
    'https://www.researchgate.net/publication/357890206_Intelligent_manufacturing_execution_systems_A_systematic_review',
    'https://new.abb.com/products/measurement-products/analytical/continuous-water-analysis/high-nitrate-nitrite-measurement/uvitec-high-nitrate-nitrite-sensor',
    'https://naologic.com/manufacturing-erp/overview?utm_term=manufacturing%20business%20systems&utm_campaign=manufacturing-c-1&utm_source=adwords&utm_medium=ppc&hsa_acc=4081055396&hsa_cam=21680931332&hsa_grp=165863279686&hsa_ad=712748807959&hsa_src=g&hsa_tgt=kwd-742836364762&hsa_kw=manufacturing%20business%20systems&hsa_mt=p&hsa_net=adwords&hsa_ver=3&gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfCU7Jdbf27chqoGAayCMt7wZfxOu4Okp0ALa2RRai7c7be5mmZXYYYaAiNyEALw_wcB',
    'https://www.outsystems.com/1/gartner-report-application-modernization/?utm_source=google&utm_medium=search-ads&utm_campaign=GOOGLE_SEARCH_NB_AMER_NA_Other&utm_term=erp%20modernization&utm_adid=legacy_modernization&utm_campaignteam=digital-mktg&utm_partner=none&gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfBgAbNCiTPbaLCl2xrsZCY968CzGz8RNvLdGXpJhhvteMIDDO7KXTAaAix3EALw_wcB',
    'https://www.emerson.com/en-us/automation/operations-business-management/deltav-mes/deltav-workflow-management?gad_source=1&gclid=Cj0KCQjw05i4BhDiARIsAB_2wfBm0zTkjDHrCKxIURmWqJQb0OjPeZN_oo5ZuF4UAIT2cIxlBRpkUTcaAgjCEALw_wcB',
  ];
}
