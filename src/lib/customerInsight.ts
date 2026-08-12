import type {
  InsightSignal,
  InsightStep,
  MethodScore,
  PaymentMethod,
  ShopperScenario,
} from '../types';
import { METHOD_LABELS } from './constants';
import { money } from './format';
import { getProfile } from './profiles';

export type { InsightSignal, InsightStep, MethodScore };

export interface CustomerInsightModel {
  identityTitle: string;
  identitySummary: string;
  recognitionSignals: InsightSignal[];
  contextSignals: InsightSignal[];
  decisionSteps: InsightStep[];
  recommendedMethod: PaymentMethod;
  recommendedLabel: string;
  reasonCode: string;
  reasonHeadline: string;
  reasonDetail: string;
  methodScores: MethodScore[];
  outcomeNote: string;
}

export function buildCustomerInsight(
  scenario: ShopperScenario,
  cartTotal: number,
  selectedMethod: PaymentMethod,
  overridden: boolean,
): CustomerInsightModel {
  const profile = getProfile(scenario);
  const instalment = money(cartTotal / 4);
  const recommendedMethod = profile.ranking[0].id;

  const methodScores = profile.methodScores.map((score) => {
    if (score.id !== 'afterpay') return score;
    return {
      ...score,
      factors: score.factors.some((f) => f.includes('$') || f.includes('×'))
        ? score.factors
        : [...score.factors, `4 × ${instalment}`],
    };
  });

  const model: CustomerInsightModel = {
    identityTitle: profile.identityTitle,
    identitySummary: profile.identitySummary,
    recognitionSignals: profile.recognitionSignals,
    contextSignals: profile.contextSignals,
    decisionSteps: [
      {
        id: 'identify',
        title: 'Identify shopper',
        detail:
          profile.group === 'Guest'
            ? 'Guest path — limited or no returning profile signals.'
            : 'Recognised profile matched from merchant / Clever identity signals.',
      },
      {
        id: 'eligibility',
        title: 'Filter eligible methods',
        detail: 'Card, Afterpay, PayTo and PayID all remain selectable.',
      },
      {
        id: 'rank',
        title: 'Rank methods',
        detail: profile.rankStepDetail,
      },
      {
        id: 'explain',
        title: 'Explain to shopper',
        detail: `Surface a factual reason: ${profile.ranking[0].reason ?? 'Recommended'}.`,
      },
    ],
    recommendedMethod,
    recommendedLabel: METHOD_LABELS[recommendedMethod],
    reasonCode: profile.ranking[0].reasonCode ?? 'recommended',
    reasonHeadline: profile.reasonHeadline,
    reasonDetail: profile.reasonDetail,
    methodScores,
    outcomeNote:
      profile.group === 'Guest'
        ? 'No behavioural personalisation is claimed when history is absent. All methods stay selectable.'
        : 'Recommendation is guidance only. The shopper can override in one action without changing price.',
  };

  if (overridden && selectedMethod !== recommendedMethod) {
    model.outcomeNote = `Shopper overrode the recommendation and selected ${METHOD_LABELS[selectedMethod]}. Ranking stayed fixed during this session.`;
  }

  return model;
}
