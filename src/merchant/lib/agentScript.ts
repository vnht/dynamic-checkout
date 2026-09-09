import type { DemoPhase } from '../types';
import { cashbackPercentLabel } from '../../lib/cashback';

export type AgentActivity =
  | 'detecting'
  | 'recommending'
  | 'monitoring'
  | 'evaluating'
  | 'running'
  | 'intervening'
  | 'reporting';

export interface AgentTurn {
  activity: AgentActivity;
  activityLabel: string;
  greeting: string;
  body: string[];
  primaryHint: string;
}

export function agentTurnFor(phase: DemoPhase): AgentTurn {
  const pct = cashbackPercentLabel();

  switch (phase) {
    case 'opportunity_found':
      return {
        activity: 'detecting',
        activityLabel: 'Reading the numbers',
        greeting: 'Last month Circuit & Co. left A$637k of second-order revenue on the table.',
        body: [
          '4,860 buyers in the last 30 days. 42% of first-timers never return within 45 days: 2,041 missing second purchases at A$312 AOV.',
          'The leak is concentrated: 18–34 AU metro, headphone and accessory first orders, Afterpay-heavy value seekers. This is not a general loyalty problem.',
          'Spray-and-pray would burn the budget. Only 1,840 buyers (38%) pass settlement, consent, and first-purchase gates. The other 62% stay on standard checkout.',
        ],
        primaryHint: 'This is the first step. I can draft a targeted Instant cashback program from this evidence now.',
      };
    case 'charter_review':
      return {
        activity: 'recommending',
        activityLabel: 'Recommending',
        greeting: `I recommend a ${pct} Instant cashback program for eligible shoppers only.`,
        body: [
          `Reward: ${pct} of the order, credited the instant payment succeeds. It is already in the shopper’s balance.`,
          'I’ll keep control traffic so we can measure true lift, and skip anyone without consent or a settled payment.',
          'Owner approval locks the charter. After that I’ll start Observation Mode.',
        ],
        primaryHint: 'Approve the charter and I’ll begin the run.',
      };
    case 'observation':
      return {
        activity: 'monitoring',
        activityLabel: 'Monitoring',
        greeting: 'Observation Mode is live. I’m watching without changing offer volume.',
        body: [
          'Actual fixed allocation follows the locked charter.',
          'I’m also simulating a hypothetical adaptive mix so you can see what I’d do next.',
          'Existing offers stay immutable. No live mutation until evidence clears and you approve.',
        ],
        primaryHint: 'I’ll ping you when the evidence gate is ready.',
      };
    case 'evidence_gate_passed':
      return {
        activity: 'evaluating',
        activityLabel: 'Evaluating',
        greeting: 'Evidence looks solid. Ready for live adaptive if you want it.',
        body: [
          'Offer volume, arm balance, delivery, and liability checks are within thresholds.',
          'If you approve, I’ll start shifting allocation within the 15% floor and 10pp daily move limits.',
        ],
        primaryHint: 'Owner approval turns monitoring into live control.',
      };
    case 'live_adaptive':
      return {
        activity: 'running',
        activityLabel: 'Running',
        greeting: 'Live run started. Watch me qualify, skip, send, and redeem in real time.',
        body: [
          'I’ll stream Instant cashback activity as it happens: who qualifies, who I skip, and how liability moves.',
          'Adaptive share will nudge within floors. Ineligible shoppers never enter the reward ledger.',
        ],
        primaryHint: 'Let the sim play, or trip a safety pause to see me intervene.',
      };
    case 'safety_pause':
      return {
        activity: 'intervening',
        activityLabel: 'Intervening',
        greeting: 'I paused new Instant cashback offers.',
        body: [
          'A safety limit was breached. Existing offers stay immutable after send.',
          'Review the incident with me, then resume when you’re ready.',
        ],
        primaryHint: 'Safety first. We can resume after Owner review.',
      };
    case 'window_complete':
      return {
        activity: 'reporting',
        activityLabel: 'Reporting',
        greeting: 'Window one is complete. Here’s what I learned.',
        body: [
          'Adaptive Instant cashback beat fixed on second-purchase rate.',
          'Keeping 62% of buyers ineligible protected budget and avoided spray-and-pray rewards.',
        ],
        primaryHint: 'Say the word and I’ll prepare window two.',
      };
    case 'second_window_complete':
      return {
        activity: 'reporting',
        activityLabel: 'Reporting',
        greeting: 'Window two wrapped. Merchant-specific learning is ready.',
        body: [
          'Accessory-led Instant cashback messaging outperformed broad catalogue copy.',
          'I’ll keep eligibility tight unless you change the charter.',
        ],
        primaryHint: 'Start over from insight anytime in Demo tools.',
      };
  }
}

export const ACTIVITY_ORDER: AgentActivity[] = [
  'detecting',
  'recommending',
  'monitoring',
  'evaluating',
  'running',
  'reporting',
];
