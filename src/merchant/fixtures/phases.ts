import type {
  AgenticGrowthFixture,
  DemoPhase,
  MerchantCharter,
  ProgramStatus,
} from '../types';
import { liabilityBalances, sharesRespectFloor, sharesSumTo100 } from './validators';

const BASE_CHARTER: MerchantCharter = {
  id: 'CHARTER-CIR-2026-W1',
  goal: 'Instant cashback 5% to win a second purchase within 14 days',
  rewardRatePercent: 5,
  windowDays: 14,
  budgetAud: 12000,
  experimentSplit: { control: 20, fixed: 40, adaptive: 40 },
  safetyLimits: {
    maxDailyOffers: 400,
    maxRewardAud: 40,
    stopLossAud: 3500,
  },
  locked: false,
  approvedByOwner: false,
  approvedAt: null,
};

function statusFor(phase: DemoPhase): { status: ProgramStatus; label: string } {
  switch (phase) {
    case 'opportunity_found':
      return { status: 'opportunity', label: 'Opportunity found' };
    case 'charter_review':
      return { status: 'charter_pending', label: 'Charter pending approval' };
    case 'observation':
      return { status: 'observation', label: 'Observation Mode' };
    case 'evidence_gate_passed':
      return { status: 'evidence_review', label: 'Evidence gate passed' };
    case 'live_adaptive':
      return { status: 'live_adaptive', label: 'Live adaptive' };
    case 'safety_pause':
      return { status: 'paused', label: 'Safety pause' };
    case 'window_complete':
      return { status: 'complete', label: 'Window one complete' };
    case 'second_window_complete':
      return { status: 'complete', label: 'Window two complete' };
  }
}

function timeline(phase: DemoPhase) {
  const order: DemoPhase[] = [
    'opportunity_found',
    'charter_review',
    'observation',
    'evidence_gate_passed',
    'live_adaptive',
    'window_complete',
    'second_window_complete',
  ];
  const labels = [
    'Insight',
    'Setup charter',
    'Run (observe)',
    'Evidence gate',
    'Live adaptive',
    'Track window 1',
    'Track window 2',
  ];
  const idx = order.indexOf(phase === 'safety_pause' ? 'live_adaptive' : phase);
  return labels.map((label, i) => ({ label, done: i <= idx }));
}

function flowStageFor(phase: DemoPhase): AgenticGrowthFixture['flowStage'] {
  if (phase === 'opportunity_found') return 'insight';
  if (phase === 'charter_review') return 'setup';
  if (
    phase === 'observation' ||
    phase === 'evidence_gate_passed' ||
    phase === 'live_adaptive' ||
    phase === 'safety_pause'
  ) {
    return phase === 'live_adaptive' || phase === 'safety_pause' ? 'track' : 'run';
  }
  return 'track';
}

export function buildFixture(phase: DemoPhase, overrides?: Partial<AgenticGrowthFixture>): AgenticGrowthFixture {
  const { status, label } = statusFor(phase);
  const locked = ![
    'opportunity_found',
    'charter_review',
  ].includes(phase);
  const approved = ![
    'opportunity_found',
    'charter_review',
  ].includes(phase);

  const charter: MerchantCharter = {
    ...BASE_CHARTER,
    locked,
    approvedByOwner: approved,
    approvedAt: approved ? '2026-08-03T09:15:00+10:00' : null,
  };

  const observationShares = { control: 20, fixed: 40, adaptive: 40 };
  const liveShares =
    phase === 'live_adaptive' || phase === 'safety_pause' || phase === 'window_complete'
      ? { control: 20, fixed: 32, adaptive: 48 }
      : phase === 'second_window_complete'
        ? { control: 18, fixed: 30, adaptive: 52 }
        : observationShares;

  const hypothetical =
    phase === 'observation' || phase === 'evidence_gate_passed'
      ? { control: 20, fixed: 35, adaptive: 45 }
      : liveShares;

  const ledger =
    phase === 'safety_pause'
      ? { authorised: 12000, reserved: 2100, netConsumed: 9800, available: 100 }
      : phase === 'live_adaptive' || phase === 'window_complete' || phase === 'second_window_complete'
        ? { authorised: 12000, reserved: 1800, netConsumed: 4200, available: 6000 }
        : { authorised: 12000, reserved: 900, netConsumed: 400, available: 10700 };

  if (!liabilityBalances(ledger)) {
    throw new Error('Fixture liability ledger does not balance');
  }
  if (!sharesSumTo100(liveShares) || !sharesRespectFloor(liveShares)) {
    throw new Error('Fixture allocation invalid');
  }

  const evidencePassed = ![
    'opportunity_found',
    'charter_review',
    'observation',
  ].includes(phase);

  const fixture: AgenticGrowthFixture = {
    phase,
    status,
    statusLabel: label,
    flowStage: flowStageFor(phase),
    metrics: {
      eligibleSettled:
        phase === 'opportunity_found' ? 1840 : phase === 'charter_review' ? 1840 : 3120,
      offersSent:
        phase === 'opportunity_found' || phase === 'charter_review'
          ? 0
          : phase === 'observation' || phase === 'evidence_gate_passed'
            ? 1860
            : 4120,
      redemptions:
        phase === 'opportunity_found' || phase === 'charter_review'
          ? 0
          : phase === 'observation' || phase === 'evidence_gate_passed'
            ? 214
            : 618,
      liabilityAvailable: ledger.available,
      secondPurchaseLiftPp:
        phase === 'window_complete' ? 4.8 : phase === 'second_window_complete' ? 6.1 : null,
    },
    readiness: [
      {
        id: 'settled',
        label: 'Settled first purchases',
        detail: 'Enough Circuit & Co. settled payments to seed a 5% instant cashback window.',
        status: 'pass',
      },
      {
        id: 'consent',
        label: 'Email consent coverage',
        detail: 'Only consented shoppers can receive Instant cashback offers, not the full base.',
        status: phase === 'opportunity_found' ? 'warn' : 'pass',
      },
      {
        id: 'budget',
        label: '5% cashback budget authorised',
        detail: 'A$12,000 authorised for window one liability (5% rewards, A$40 cap).',
        status: phase === 'opportunity_found' ? 'fail' : 'pass',
      },
      {
        id: 'channel',
        label: 'Checkout + email path ready',
        detail: 'Recommended-method Instant cashback callout and Hello Clever send checks ready.',
        status: 'pass',
      },
    ],
    charter,
    insight: {
      headline: 'A$637k of second-order revenue is walking out of last month’s Circuit & Co. cohort',
      summary:
        '4,860 buyers in 30 days. 42% of first-time electronics buyers never return within 45 days: 2,041 missing orders at A$312 AOV. Churn concentrates in 18–34 metro accessory / Afterpay shoppers. Instant cashback should hit that slice, not the full base.',
      recommendation:
        'Set up a 5% Instant cashback program for a qualified subset only: settled first purchase, promotional consent, and in-window eligibility. Keep control traffic to measure lift.',
      stats: [
        {
          id: 'risk',
          label: 'Second-order revenue at risk',
          value: 'A$637k',
          detail: '4,860 buyers × 42% non-return × A$312 AOV, last 30 days only. A year of the same leak is north of A$7.6M.',
        },
        {
          id: 'churn',
          label: '45-day non-return',
          value: '42%',
          detail: 'First-time buyers who never make a second purchase',
        },
        {
          id: 'lost',
          label: 'Missing second purchases',
          value: '2,041',
          detail: 'From this 30-day cohort if the 42% pattern holds',
        },
        {
          id: 'eligible',
          label: 'Eligible for Instant cashback',
          value: '38%',
          detail: '1,840 of 4,860 last-30-day buyers. This is the only slice that should be rewarded',
        },
      ],
      eligibilityRules: [
        { id: 'settled', label: 'Payment settled (not pending / reversed)', required: true },
        { id: 'first', label: 'First Circuit & Co. purchase in window', required: true },
        { id: 'consent', label: 'Promotional email consent on file', required: true },
        { id: 'cap', label: 'Under daily offer + liability caps', required: true },
        { id: 'guest_ok', label: 'Guest shoppers can qualify if settled + consent', required: false },
      ],
      totalBuyers30d: 4860,
      eligibleSharePct: 38,
      ineligibleSharePct: 62,
    },
    segments: [
      {
        id: 'high_intent_repeat',
        name: 'High-intent repeat',
        size: 1280,
        qualified: 842,
        avgFirstOrderAud: 412,
        description: 'Settled buyers with accessory affinity. About 66% are eligible for 5% Instant cashback.',
      },
      {
        id: 'cart_abandon_recover',
        name: 'Post-purchase expanders',
        size: 960,
        qualified: 510,
        avgFirstOrderAud: 289,
        description: 'Browsed complementary SKUs; 450 excluded (no consent or unsettled).',
      },
      {
        id: 'value_seekers',
        name: 'Value seekers',
        size: 740,
        qualified: 318,
        avgFirstOrderAud: 198,
        description: 'Price-sensitive Afterpay mix. Only about 43% pass eligibility rules.',
      },
    ],
    qualificationExample: {
      name: 'Mia Chen',
      firstOrderAud: 678,
      daysSincePurchase: 3,
      emailConsent: true,
      paymentSettled: true,
      reasons: [
        'Settled Circuit & Co. payment of A$678.00',
        'Email promotional consent on file',
        'Within 14-day Instant cashback window',
        '5% Instant cashback = A$33.90 (under A$40 cap)',
        'Not already offered in this window',
      ],
      qualified: true,
    },
    ineligibleExample: {
      name: 'Alex Nguyen',
      firstOrderAud: 678,
      daysSincePurchase: 2,
      emailConsent: false,
      paymentSettled: true,
      reasons: [
        'Payment settled. Passes settlement check',
        'Missing promotional email consent',
        'Guest profile with no Instant cashback opt-in',
        'Would see standard checkout (no cashback callout) until consent exists',
      ],
      qualified: false,
    },
    allocation: {
      id: 'DEC-CIR-2026-08-12-A',
      date: '2026-08-12',
      armShares: liveShares,
      rationale: [
        'Fixed arm underperformed on redemptions vs adaptive in the last 3 days.',
        'Control held at 20% for causal measurement.',
        'Daily move capped at 10pp; floor of 15% retained on every arm.',
      ],
      mode: phase === 'live_adaptive' || phase === 'safety_pause' ? 'live' : 'observation',
      provisional: phase === 'observation' || phase === 'evidence_gate_passed',
    },
    hypotheticalAllocation: {
      id: 'DEC-CIR-2026-08-12-H',
      date: '2026-08-12',
      armShares: hypothetical,
      rationale: [
        'Hypothetical adaptive would shift +5pp into adaptive from fixed.',
        'Observation Mode does not mutate live offer counts.',
      ],
      mode: 'observation',
      provisional: true,
    },
    ledger,
    evidenceGate: [
      {
        id: 'n',
        criterion: 'Minimum offers observed',
        threshold: '1,500',
        actual: evidencePassed || phase === 'observation' ? '1,860' : '0',
        passed: evidencePassed || phase === 'observation',
      },
      {
        id: 'balance',
        criterion: 'Arm balance within tolerance',
        threshold: '±8pp vs charter',
        actual: 'Within 4pp',
        passed: evidencePassed || phase === 'observation',
      },
      {
        id: 'delivery',
        criterion: 'Email delivery success',
        threshold: '≥ 96%',
        actual: '97.4%',
        passed: true,
      },
      {
        id: 'liability',
        criterion: 'Liability reconciliation',
        threshold: 'Balanced daily',
        actual: liabilityBalances(ledger) ? 'Balanced' : 'Breach',
        passed: liabilityBalances(ledger),
      },
      {
        id: 'safety',
        criterion: 'No open safety breach',
        threshold: 'None',
        actual: phase === 'safety_pause' ? 'Stop-loss warn' : 'None',
        passed: phase !== 'safety_pause',
      },
    ],
    evidencePassed,
    liveApproved: ['live_adaptive', 'safety_pause', 'window_complete', 'second_window_complete'].includes(
      phase,
    ),
    safety: [
      {
        id: 'daily',
        label: 'Daily offer cap',
        limit: '400',
        current: phase === 'live_adaptive' ? '286' : '0–186',
        status: 'ok',
      },
      {
        id: 'reward',
        label: 'Max reward',
        limit: 'A$25',
        current: 'A$20',
        status: 'ok',
      },
      {
        id: 'stoploss',
        label: 'Stop-loss',
        limit: 'A$3,500',
        current: phase === 'safety_pause' ? 'A$3,620' : 'A$1,840',
        status: phase === 'safety_pause' ? 'breach' : 'ok',
      },
    ],
    merchantStop: phase === 'safety_pause',
    helloCleverStop: false,
    pauseReason:
      phase === 'safety_pause'
        ? 'Stop-loss exceeded authorised threshold. New offers paused; existing offers remain immutable.'
        : null,
    armResults: [
      {
        arm: 'control',
        offers: phase === 'second_window_complete' ? 980 : 720,
        redemptions: phase === 'second_window_complete' ? 62 : 41,
        secondPurchaseRate: phase === 'second_window_complete' ? 0.063 : 0.057,
        incrementalRevenueAud: 0,
        costAud: 0,
      },
      {
        arm: 'fixed',
        offers: phase === 'second_window_complete' ? 1680 : 1240,
        redemptions: phase === 'second_window_complete' ? 198 : 132,
        secondPurchaseRate: phase === 'second_window_complete' ? 0.118 : 0.106,
        incrementalRevenueAud: phase === 'second_window_complete' ? 41200 : 26800,
        costAud: phase === 'second_window_complete' ? 3960 : 2640,
      },
      {
        arm: 'adaptive',
        offers: phase === 'second_window_complete' ? 2140 : 1460,
        redemptions: phase === 'second_window_complete' ? 294 : 188,
        secondPurchaseRate: phase === 'second_window_complete' ? 0.137 : 0.129,
        incrementalRevenueAud: phase === 'second_window_complete' ? 58600 : 34200,
        costAud: phase === 'second_window_complete' ? 4280 : 2880,
      },
    ],
    learningNotes:
      phase === 'second_window_complete'
        ? [
            'Window two: 5% Instant cashback on accessory attach outperformed broader catalogue messaging.',
            'Ineligible shoppers (no consent) stayed on standard checkout, which kept CAC from inflating.',
            'Adaptive kept control near 18% for measurement while respecting the 15% floor.',
          ]
        : phase === 'window_complete'
          ? [
              'Window one: 5% Instant cashback adaptive beat fixed by +2.3pp second-purchase rate.',
              'Eligible-only targeting mattered: 62% of buyers never saw Instant cashback.',
              'High AOV first orders (e.g. Mia A$678 → A$33.90) redeemed fastest within 7 days.',
            ]
          : [
              'Learning updates appear when a window completes.',
              'Run mode compares Actual fixed vs Hypothetical adaptive without mutating live offer counts.',
            ],
    audit: [
      {
        id: 'AUD-001',
        timestamp: '2026-08-01T10:00:00+10:00',
        actor: 'system',
        action: 'opportunity_detected',
        detail: 'Second-purchase opportunity found for Circuit & Co.',
      },
      ...(approved
        ? [
            {
              id: 'AUD-002',
              timestamp: '2026-08-03T09:15:00+10:00',
              actor: 'merchant_owner',
              action: 'charter_approved',
              detail: 'Owner approved CHARTER-CIR-2026-W1; Observation Mode started.',
            },
          ]
        : []),
      ...(evidencePassed
        ? [
            {
              id: 'AUD-003',
              timestamp: '2026-08-10T16:40:00+10:00',
              actor: 'system',
              action: 'evidence_gate_passed',
              detail: 'All evidence criteria met for live adaptive eligibility.',
            },
          ]
        : []),
      ...(fixtureNeedsLive(phase)
        ? [
            {
              id: 'AUD-004',
              timestamp: '2026-08-11T11:05:00+10:00',
              actor: 'merchant_owner',
              action: 'live_adaptive_approved',
              detail: 'Owner approved live adaptive allocation.',
            },
          ]
        : []),
      ...(phase === 'safety_pause'
        ? [
            {
              id: 'AUD-005',
              timestamp: '2026-08-12T08:22:00+10:00',
              actor: 'system',
              action: 'safety_pause',
              detail: 'Stop-loss breach; new offers stopped. Existing offers immutable.',
            },
          ]
        : []),
    ],
    weeklyObservationSummary:
      'Week of 4–10 Aug: Actual fixed held at charter weights. Hypothetical adaptive would have moved +5pp into adaptive based on redemption velocity. No live offer counts were mutated.',
    timeline: timeline(phase),
  };

  return { ...fixture, ...overrides, phase, status, statusLabel: label };
}

function fixtureNeedsLive(phase: DemoPhase) {
  return ['live_adaptive', 'safety_pause', 'window_complete', 'second_window_complete'].includes(phase);
}

export const DEMO_PHASES: { id: DemoPhase; label: string }[] = [
  { id: 'opportunity_found', label: 'Opportunity found' },
  { id: 'charter_review', label: 'Charter review' },
  { id: 'observation', label: 'Observation Mode' },
  { id: 'evidence_gate_passed', label: 'Evidence gate passed' },
  { id: 'live_adaptive', label: 'Live adaptive' },
  { id: 'safety_pause', label: 'Safety pause' },
  { id: 'window_complete', label: 'Window one complete' },
  { id: 'second_window_complete', label: 'Window two complete' },
];

export const PHASE_STORAGE_KEY = 'dcal.merchant.demoPhase';
export const ROLE_STORAGE_KEY = 'dcal.merchant.role';
