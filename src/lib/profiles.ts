import type {
  CardDetails,
  ContactDetails,
  DeliveryDetails,
  InsightSignal,
  MethodScore,
  PaymentMethod,
  ShopperScenario,
} from '../types';

export interface RankedMethodDef {
  id: PaymentMethod;
  reason?: string;
  reasonCode?: string;
  detailLine?: string;
  saved?: boolean;
}

export interface ShopperProfile {
  id: ShopperScenario;
  label: string;
  group: 'Recognised' | 'Guest';
  shortName: string;
  identityTitle: string;
  identitySummary: string;
  contact: ContactDetails;
  delivery: DeliveryDetails;
  cardPrefill: CardDetails;
  hasPayToAgreement: boolean;
  payToBankLabel?: string;
  payToReceiptDetail?: string;
  ranking: RankedMethodDef[];
  recognitionSignals: InsightSignal[];
  contextSignals: InsightSignal[];
  rankStepDetail: string;
  reasonHeadline: string;
  reasonDetail: string;
  methodScores: MethodScore[];
  /** Why this shopper can qualify for Circuit & Co. second-purchase cashback (demo). */
  cashbackReason?: string;
}

function demoCard(nameOnCard: string, saveCard = false): CardDetails {
  return {
    number: '4242 4242 4242 4242',
    name: nameOnCard.toUpperCase(),
    expiry: '12/30',
    cvc: '123',
    saveCard,
  };
}

const baseContext = (amountNote: string, friction: string): InsightSignal[] => [
  {
    id: 'vertical',
    label: 'Merchant vertical',
    value: 'Consumer electronics',
    weight: 'medium',
  },
  {
    id: 'amount',
    label: 'Order value',
    value: amountNote,
    weight: 'high',
  },
  {
    id: 'market',
    label: 'Market / currency',
    value: 'Australia · AUD',
    weight: 'high',
  },
  {
    id: 'friction',
    label: 'Priority signal',
    value: friction,
    weight: 'high',
  },
];

export const SHOPPER_PROFILES: Record<ShopperScenario, ShopperProfile> = {
  recognised: {
    id: 'recognised',
    label: 'Mia Chen — returning PayTo',
    group: 'Recognised',
    shortName: 'Mia',
    identityTitle: 'Recognised shopper',
    identitySummary:
      'Mia Chen is matched from a returning Circuit & Co. profile with an active PayTo agreement and a prior successful PayTo payment.',
    contact: {
      email: 'mia.chen@example.com',
      mobile: '0412 345 678',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Mia',
      lastName: 'Chen',
      street: '88 Market Street',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
    },
    cardPrefill: demoCard('Mia Chen', true),
    hasPayToAgreement: true,
    payToBankLabel: 'ANZ account ending 42',
    payToReceiptDetail: 'Paid from ANZ account ending 42',
    ranking: [
      {
        id: 'payto',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
        detailLine: 'ANZ account ending 42',
      },
      { id: 'card', detailLine: 'Saved Visa ending 4242', saved: true },
      { id: 'afterpay' },
      { id: 'payid' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'mia.chen@example.com', weight: 'high' },
      { id: 'device', label: 'Returning device', value: 'Known browser session', weight: 'medium' },
      { id: 'mandate', label: 'PayTo agreement', value: 'ANZ ···42 · Active', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'PayTo · 12 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Reuse approved PayTo agreement'),
    rankStepDetail: 'Active PayTo agreement and last-success method outrank saved card.',
    reasonHeadline: 'PayTo leads because it was used successfully last time',
    reasonDetail:
      'Dynamic Checkout keeps every eligible method visible, but leads with the lowest-friction proven path: an approved PayTo agreement for ANZ account ending 42.',
    methodScores: [
      { id: 'payto', label: 'PayTo', score: 96, factors: ['Active agreement', 'Last success'] },
      { id: 'card', label: 'Card', score: 82, factors: ['Saved Visa ···4242'] },
      { id: 'afterpay', label: 'Afterpay', score: 71, factors: ['Eligible cart total'] },
      { id: 'payid', label: 'PayID', score: 58, factors: ['Higher completion effort'] },
    ],
  },

  guest: {
    id: 'guest',
    label: 'Guest — no history',
    group: 'Guest',
    shortName: 'Alex',
    identityTitle: 'Guest shopper',
    identitySummary:
      'No saved identity, mandate or prior method is available. Ranking uses cart context and lowest-friction familiar checkout for a high-value electronics order.',
    contact: {
      email: 'alex.guest@example.com',
      mobile: '0411 000 222',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Alex',
      lastName: 'Nguyen',
      street: '12 Demo Street',
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010',
    },
    cardPrefill: demoCard('Alex Nguyen'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Quick checkout',
        reasonCode: 'quick_checkout',
      },
      { id: 'afterpay' },
      { id: 'payto' },
      { id: 'payid' },
    ],
    recognitionSignals: [
      { id: 'profile', label: 'Customer profile', value: 'No match found', weight: 'high' },
      { id: 'mandate', label: 'Bank agreement', value: 'None on file', weight: 'high' },
      { id: 'history', label: 'Payment history', value: 'Unavailable', weight: 'high' },
      {
        id: 'consent',
        label: 'Personalisation',
        value: 'Not claimed without history',
        weight: 'medium',
      },
    ],
    contextSignals: baseContext('$678.00 · higher consideration', 'Lowest-friction familiar method'),
    rankStepDetail: 'Card leads for a high-value guest cart; Afterpay second for split payments.',
    reasonHeadline: 'Card leads for a guest high-value electronics cart',
    reasonDetail:
      'Without history, Dynamic Checkout does not invent personalisation. It recommends the familiar, low-friction path (card).',
    methodScores: [
      { id: 'card', label: 'Card', score: 91, factors: ['Familiar guest path'] },
      { id: 'afterpay', label: 'Afterpay', score: 78, factors: ['Split payments'] },
      { id: 'payto', label: 'PayTo', score: 64, factors: ['New agreement needed'] },
      { id: 'payid', label: 'PayID', score: 52, factors: ['Manual push payment'] },
    ],
  },

  student_afterpay: {
    id: 'student_afterpay',
    label: 'Jordan Lee — student / BNPL',
    group: 'Recognised',
    shortName: 'Jordan',
    identityTitle: 'Recognised · student segment',
    identitySummary:
      'Jordan Lee is a returning uni-age shopper who completed two prior Afterpay checkouts at Circuit & Co. Cashflow-sensitive signals favour Pay in 4.',
    contact: {
      email: 'jordan.lee@student.example.com',
      mobile: '0433 221 009',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Jordan',
      lastName: 'Lee',
      street: '14 Uni Way',
      suburb: 'Carlton',
      state: 'VIC',
      postcode: '3053',
    },
    cardPrefill: demoCard('Jordan Lee', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'afterpay',
        reason: 'Recommended · Used Afterpay before',
        reasonCode: 'afterpay_history',
        detailLine: 'Prior Afterpay · in good standing',
      },
      { id: 'card', detailLine: 'Debit ending 1111', saved: true },
      { id: 'payid' },
      { id: 'payto' },
    ],
    recognitionSignals: [
      {
        id: 'email',
        label: 'Email match',
        value: 'jordan.lee@student.example.com',
        weight: 'high',
      },
      { id: 'segment', label: 'Segment', value: 'Student / young adult', weight: 'medium' },
      { id: 'bnpl', label: 'BNPL history', value: '2 Afterpay successes', weight: 'high' },
      { id: 'mandate', label: 'PayTo agreement', value: 'None', weight: 'low' },
    ],
    contextSignals: baseContext('$678.00 · instalment-friendly', 'Prefer Pay in 4 when eligible'),
    rankStepDetail: 'Prior Afterpay success and instalment fit outrank card for this segment.',
    reasonHeadline: 'Afterpay leads from prior BNPL success on similar carts',
    reasonDetail:
      'Recognised Afterpay history and an eligible AUD cart total make Pay in 4 the lowest-friction path, without hiding card or bank rails.',
    methodScores: [
      {
        id: 'afterpay',
        label: 'Afterpay',
        score: 94,
        factors: ['Prior BNPL success', 'Eligible total'],
      },
      { id: 'card', label: 'Card', score: 76, factors: ['Saved debit'] },
      { id: 'payid', label: 'PayID', score: 61, factors: ['Student banking app use'] },
      { id: 'payto', label: 'PayTo', score: 55, factors: ['No agreement on file'] },
    ],
  },

  payid_privacy: {
    id: 'payid_privacy',
    label: 'Sam Okonkwo — PayID preferrer',
    group: 'Recognised',
    shortName: 'Sam',
    identityTitle: 'Recognised · bank-push preferrer',
    identitySummary:
      'Sam Okonkwo is recognised with no saved cards. Prior Circuit & Co. orders were completed by PayID push from a CommBank PayID.',
    contact: {
      email: 'sam.okonkwo@example.com',
      mobile: '0408 776 221',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Sam',
      lastName: 'Okonkwo',
      street: '6 Harbour Road',
      suburb: 'Pyrmont',
      state: 'NSW',
      postcode: '2009',
    },
    cardPrefill: demoCard('Sam Okonkwo'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'payid',
        reason: 'Recommended · Preferred bank transfer',
        reasonCode: 'payid_preference',
        detailLine: 'Last paid by PayID',
      },
      { id: 'payto' },
      { id: 'card' },
      { id: 'afterpay' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'sam.okonkwo@example.com', weight: 'high' },
      { id: 'cards', label: 'Saved cards', value: 'None', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'PayID · 21 days ago', weight: 'high' },
      { id: 'pref', label: 'Stated preference', value: 'Avoid card storage', weight: 'medium' },
    ],
    contextSignals: baseContext('$678.00', 'Payer-initiated bank transfer preference'),
    rankStepDetail: 'PayID history and no saved card elevate bank-push over card entry.',
    reasonHeadline: 'PayID leads from prior bank-transfer success and no saved card',
    reasonDetail:
      'When the shopper previously completed PayID and declined card storage, Dynamic Checkout leads with PayID while keeping card and PayTo available.',
    methodScores: [
      { id: 'payid', label: 'PayID', score: 93, factors: ['Last success', 'No card on file'] },
      { id: 'payto', label: 'PayTo', score: 74, factors: ['Bank alternative'] },
      { id: 'card', label: 'Card', score: 63, factors: ['Would require new entry'] },
      { id: 'afterpay', label: 'Afterpay', score: 57, factors: ['No BNPL history'] },
    ],
  },

  corporate_card: {
    id: 'corporate_card',
    label: 'Priya Nair — corporate buyer',
    group: 'Recognised',
    shortName: 'Priya',
    identityTitle: 'Recognised · business buyer',
    identitySummary:
      'Priya Nair buys for Northwind Labs. Delivery is to a Melbourne office and the last three payments used a saved corporate Visa.',
    contact: {
      email: 'priya.nair@northwind.example',
      mobile: '0417 555 014',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Priya',
      lastName: 'Nair',
      street: 'Level 12, 200 Collins Street',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
    },
    cardPrefill: demoCard('Priya Nair', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Corporate card on file',
        reasonCode: 'corporate_card',
        detailLine: 'Saved Visa ending 1881',
        saved: true,
      },
      { id: 'payto' },
      { id: 'payid' },
      { id: 'afterpay' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'priya.nair@northwind.example', weight: 'high' },
      { id: 'org', label: 'Account type', value: 'Business / AP buyer', weight: 'high' },
      { id: 'card', label: 'Saved instrument', value: 'Corporate Visa ···1881', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Card · 5 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00 · business delivery', 'Reuse corporate card'),
    rankStepDetail: 'Saved corporate card and business checkout pattern outrank BNPL.',
    reasonHeadline: 'Card leads for a business buyer with a corporate Visa on file',
    reasonDetail:
      'Business delivery and repeated corporate-card success make card the factual lead. Afterpay is deprioritised for B2B-style purchasing.',
    methodScores: [
      { id: 'card', label: 'Card', score: 95, factors: ['Corporate Visa saved', 'Last success'] },
      { id: 'payto', label: 'PayTo', score: 70, factors: ['Possible AP alternative'] },
      { id: 'payid', label: 'PayID', score: 62, factors: ['Manual AP friction'] },
      { id: 'afterpay', label: 'Afterpay', score: 40, factors: ['Weak B2B fit'] },
    ],
  },

  mobile_guest: {
    id: 'mobile_guest',
    label: 'Guest — mobile web first-time',
    group: 'Guest',
    shortName: 'Riley',
    identityTitle: 'Guest · mobile session',
    identitySummary:
      'First-time mobile web visitor with no account match. Device and session signals favour the fastest familiar checkout path.',
    contact: {
      email: 'riley.mobile@example.com',
      mobile: '0488 321 654',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Riley',
      lastName: 'Patel',
      street: '44 Beach Road',
      suburb: 'Bondi',
      state: 'NSW',
      postcode: '2026',
    },
    cardPrefill: demoCard('Riley Patel'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Fastest on mobile',
        reasonCode: 'mobile_quick',
      },
      { id: 'afterpay' },
      { id: 'payid' },
      { id: 'payto' },
    ],
    recognitionSignals: [
      { id: 'profile', label: 'Customer profile', value: 'No match found', weight: 'high' },
      { id: 'device', label: 'Device', value: 'Mobile web · first visit', weight: 'high' },
      { id: 'wallet', label: 'Saved methods', value: 'None', weight: 'high' },
      { id: 'history', label: 'Payment history', value: 'Unavailable', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Minimise mobile form friction'),
    rankStepDetail:
      'Mobile guest + no history → card first; PayTo deprioritised (agreement creation).',
    reasonHeadline: 'Card leads as the fastest familiar path on mobile for a guest',
    reasonDetail:
      'No personalisation is claimed. Card is recommended for speed on a first mobile visit; bank rails stay available but secondary.',
    methodScores: [
      { id: 'card', label: 'Card', score: 92, factors: ['Mobile familiarity', 'Short path'] },
      { id: 'afterpay', label: 'Afterpay', score: 77, factors: ['One redirect'] },
      { id: 'payid', label: 'PayID', score: 60, factors: ['App switch cost'] },
      { id: 'payto', label: 'PayTo', score: 48, factors: ['Agreement creation'] },
    ],
  },

  afterpay_regular: {
    id: 'afterpay_regular',
    label: 'Aisha Rahman — Afterpay regular',
    group: 'Recognised',
    shortName: 'Aisha',
    identityTitle: 'Recognised · BNPL regular',
    identitySummary:
      'Aisha Rahman is a frequent Circuit & Co. shopper with four Afterpay settlements in the last quarter and a healthy repayment record.',
    contact: {
      email: 'aisha.rahman@example.com',
      mobile: '0421 889 330',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Aisha',
      lastName: 'Rahman',
      street: '29 Florence Street',
      suburb: 'Teneriffe',
      state: 'QLD',
      postcode: '4005',
    },
    cardPrefill: demoCard('Aisha Rahman', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'afterpay',
        reason: 'Recommended · Regular Afterpay customer',
        reasonCode: 'afterpay_regular',
        detailLine: '4 Afterpay orders · good standing',
      },
      { id: 'card', detailLine: 'Saved Mastercard ending 5444', saved: true },
      { id: 'payto' },
      { id: 'payid' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'aisha.rahman@example.com', weight: 'high' },
      { id: 'bnpl', label: 'BNPL cadence', value: '4 Afterpay orders / quarter', weight: 'high' },
      { id: 'standing', label: 'Repayment standing', value: 'Good', weight: 'high' },
      { id: 'card', label: 'Saved card', value: 'Mastercard ···5444', weight: 'medium' },
    ],
    contextSignals: baseContext('$678.00 · within Afterpay demo limit', 'Lead with habitual BNPL'),
    rankStepDetail: 'Strong Afterpay habit and standing outrank saved card.',
    reasonHeadline: 'Afterpay leads for a regular BNPL customer in good standing',
    reasonDetail:
      'Repeated Afterpay completion on electronics carts is a factual reason to recommend Pay in 4, with card kept as the clear fallback.',
    methodScores: [
      {
        id: 'afterpay',
        label: 'Afterpay',
        score: 97,
        factors: ['Habitual BNPL', 'Good standing'],
      },
      { id: 'card', label: 'Card', score: 80, factors: ['Saved Mastercard'] },
      { id: 'payto', label: 'PayTo', score: 59, factors: ['No agreement'] },
      { id: 'payid', label: 'PayID', score: 54, factors: ['Unused recently'] },
    ],
  },

  regional_payto: {
    id: 'regional_payto',
    label: 'Noah Blake — regional PayTo',
    group: 'Recognised',
    shortName: 'Noah',
    identityTitle: 'Recognised · regional returning',
    identitySummary:
      'Noah Blake shops from regional NSW with an active CBA PayTo agreement. Last payment used PayTo successfully from Dubbo.',
    contact: {
      email: 'noah.blake@example.com',
      mobile: '0499 120 884',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Noah',
      lastName: 'Blake',
      street: '7 Macquarie Street',
      suburb: 'Dubbo',
      state: 'NSW',
      postcode: '2830',
    },
    cardPrefill: demoCard('Noah Blake'),
    hasPayToAgreement: true,
    payToBankLabel: 'CBA account ending 19',
    payToReceiptDetail: 'Paid from CBA account ending 19',
    ranking: [
      {
        id: 'payto',
        reason: 'Recommended · Active bank agreement',
        reasonCode: 'payto_mandate',
        detailLine: 'CBA account ending 19',
      },
      { id: 'payid' },
      { id: 'card' },
      { id: 'afterpay' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'noah.blake@example.com', weight: 'high' },
      { id: 'region', label: 'Delivery region', value: 'Regional NSW · Dubbo', weight: 'medium' },
      { id: 'mandate', label: 'PayTo agreement', value: 'CBA ···19 · Active', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'PayTo · 9 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Reuse regional bank agreement'),
    rankStepDetail: 'Active CBA PayTo agreement is the strongest low-friction signal.',
    reasonHeadline: 'PayTo leads from an active CBA agreement used last time',
    reasonDetail:
      'Recognised regional shopper with a live PayTo mandate — bank debit is recommended without requiring card details.',
    methodScores: [
      {
        id: 'payto',
        label: 'PayTo',
        score: 95,
        factors: ['Active CBA mandate', 'Last success'],
      },
      { id: 'payid', label: 'PayID', score: 72, factors: ['Banking-app familiarity'] },
      { id: 'card', label: 'Card', score: 66, factors: ['No saved card'] },
      { id: 'afterpay', label: 'Afterpay', score: 58, factors: ['Eligible but unused'] },
    ],
  },

  new_to_au: {
    id: 'new_to_au',
    label: 'Guest — new to Australia',
    group: 'Guest',
    shortName: 'Wei',
    identityTitle: 'Guest · limited AU banking history',
    identitySummary:
      'Guest checkout with no local payment history. Signals suggest a recent arrival — card remains the most universally familiar option.',
    contact: {
      email: 'wei.zhang@example.com',
      mobile: '0466 778 900',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Wei',
      lastName: 'Zhang',
      street: '8 Station Place',
      suburb: 'Parramatta',
      state: 'NSW',
      postcode: '2150',
    },
    cardPrefill: demoCard('Wei Zhang'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Widely accepted',
        reasonCode: 'universal_card',
      },
      { id: 'afterpay' },
      { id: 'payid' },
      { id: 'payto' },
    ],
    recognitionSignals: [
      { id: 'profile', label: 'Customer profile', value: 'No AU match', weight: 'high' },
      { id: 'bank', label: 'Local bank history', value: 'Unavailable', weight: 'high' },
      {
        id: 'bnpl',
        label: 'BNPL eligibility signal',
        value: 'Unknown / unproven',
        weight: 'medium',
      },
      { id: 'history', label: 'Payment history', value: 'None', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Prefer universally familiar rail'),
    rankStepDetail: 'No local history → card first; bank rails available but not assumed.',
    reasonHeadline: 'Card leads when local banking history is unavailable',
    reasonDetail:
      'Dynamic Checkout does not assume PayID/PayTo familiarity for guests without AU history. Card is the transparent default; other methods remain selectable.',
    methodScores: [
      { id: 'card', label: 'Card', score: 90, factors: ['Global familiarity'] },
      { id: 'afterpay', label: 'Afterpay', score: 68, factors: ['May need eligibility'] },
      { id: 'payid', label: 'PayID', score: 55, factors: ['Requires AU PayID'] },
      { id: 'payto', label: 'PayTo', score: 50, factors: ['Requires AU bank app'] },
    ],
  },

  senior_saved_card: {
    id: 'senior_saved_card',
    label: 'Helen Brooks — saved card preferrer',
    group: 'Recognised',
    shortName: 'Helen',
    identityTitle: 'Recognised · familiar-card preferrer',
    identitySummary:
      'Helen Brooks is a long-time customer who consistently chooses her saved Visa and abandons bank-app authorisation flows.',
    contact: {
      email: 'helen.brooks@example.com',
      mobile: '0412 900 117',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Helen',
      lastName: 'Brooks',
      street: '3 Garden Court',
      suburb: 'Glenelg',
      state: 'SA',
      postcode: '5045',
    },
    cardPrefill: demoCard('Helen Brooks', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Preferred saved card',
        reasonCode: 'saved_card_preference',
        detailLine: 'Saved Visa ending 4242',
        saved: true,
      },
      { id: 'afterpay' },
      { id: 'payid' },
      { id: 'payto' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'helen.brooks@example.com', weight: 'high' },
      { id: 'tenure', label: 'Customer tenure', value: '6+ years', weight: 'medium' },
      { id: 'card', label: 'Saved instrument', value: 'Visa ···4242', weight: 'high' },
      {
        id: 'abandon',
        label: 'Bank-app abandon',
        value: 'PayTo/PayID often skipped',
        weight: 'high',
      },
    ],
    contextSignals: baseContext('$678.00', 'Maximise familiarity / minimise new steps'),
    rankStepDetail: 'Saved card preference and bank-app abandon history elevate card.',
    reasonHeadline: 'Card leads from a saved Visa and preference for familiar checkout',
    reasonDetail:
      'Factual history shows Helen completes saved-card payments and rarely finishes bank-app flows — card is recommended without removing other methods.',
    methodScores: [
      { id: 'card', label: 'Card', score: 96, factors: ['Saved Visa', 'Completion habit'] },
      { id: 'afterpay', label: 'Afterpay', score: 64, factors: ['Occasional use'] },
      { id: 'payid', label: 'PayID', score: 42, factors: ['High abandon'] },
      { id: 'payto', label: 'PayTo', score: 38, factors: ['High abandon'] },
    ],
  },

  vip_repeat: {
    id: 'vip_repeat',
    label: 'Lucas Martin — VIP repeat',
    group: 'Recognised',
    shortName: 'Lucas',
    identityTitle: 'Recognised · high-frequency VIP',
    identitySummary:
      'Lucas Martin is a high-frequency buyer with an active PayTo agreement and very recent successful bank payment. Speed and reuse dominate ranking.',
    contact: {
      email: 'lucas.martin@example.com',
      mobile: '0401 222 818',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Lucas',
      lastName: 'Martin',
      street: '101 Oxford Street',
      suburb: 'Paddington',
      state: 'NSW',
      postcode: '2021',
    },
    cardPrefill: demoCard('Lucas Martin', true),
    hasPayToAgreement: true,
    payToBankLabel: 'NAB account ending 77',
    payToReceiptDetail: 'Paid from NAB account ending 77',
    ranking: [
      {
        id: 'payto',
        reason: 'Recommended · Fastest repeat checkout',
        reasonCode: 'vip_payto',
        detailLine: 'NAB account ending 77',
      },
      { id: 'card', detailLine: 'Saved Amex ending 1005', saved: true },
      { id: 'payid' },
      { id: 'afterpay' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'lucas.martin@example.com', weight: 'high' },
      { id: 'freq', label: 'Purchase frequency', value: '8 orders / 90 days', weight: 'high' },
      { id: 'mandate', label: 'PayTo agreement', value: 'NAB ···77 · Active', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'PayTo · 2 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00 · repeat electronics', 'Optimise for repeat speed'),
    rankStepDetail: 'VIP frequency + fresh PayTo success → PayTo first.',
    reasonHeadline: 'PayTo leads for a high-frequency shopper with a fresh bank success',
    reasonDetail:
      'Recent PayTo completion and an active NAB agreement make bank debit the factual fastest repeat path; Afterpay is least relevant for this VIP pattern.',
    methodScores: [
      { id: 'payto', label: 'PayTo', score: 98, factors: ['Active mandate', '2-day recency'] },
      { id: 'card', label: 'Card', score: 84, factors: ['Saved Amex'] },
      { id: 'payid', label: 'PayID', score: 60, factors: ['Slower than mandate'] },
      { id: 'afterpay', label: 'Afterpay', score: 45, factors: ['Low VIP fit'] },
    ],
  },

  card_friction: {
    id: 'card_friction',
    label: 'Elena Rossi — recent card declines',
    group: 'Recognised',
    shortName: 'Elena',
    identityTitle: 'Recognised · card friction',
    identitySummary:
      'Elena Rossi is recognised but had two recent card declines on Circuit & Co. A successful PayTo payment followed — bank rails are ranked above card.',
    contact: {
      email: 'elena.rossi@example.com',
      mobile: '0455 671 902',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Elena',
      lastName: 'Rossi',
      street: '55 Hay Street',
      suburb: 'Subiaco',
      state: 'WA',
      postcode: '6008',
    },
    cardPrefill: demoCard('Elena Rossi'),
    hasPayToAgreement: true,
    payToBankLabel: 'Westpac account ending 08',
    payToReceiptDetail: 'Paid from Westpac account ending 08',
    ranking: [
      {
        id: 'payto',
        reason: 'Recommended · More reliable than card lately',
        reasonCode: 'avoid_card_friction',
        detailLine: 'Westpac account ending 08',
      },
      { id: 'payid' },
      { id: 'afterpay' },
      { id: 'card', detailLine: 'Visa ending 4242 · recent declines' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'elena.rossi@example.com', weight: 'high' },
      { id: 'declines', label: 'Recent card result', value: '2 declines / 30 days', weight: 'high' },
      { id: 'mandate', label: 'PayTo agreement', value: 'Westpac ···08 · Active', weight: 'high' },
      {
        id: 'recovery',
        label: 'Recovery path',
        value: 'PayTo success after decline',
        weight: 'high',
      },
    ],
    contextSignals: baseContext('$678.00', 'Prefer rails with recent success'),
    rankStepDetail: 'Card decline friction + PayTo recovery success reorder the list.',
    reasonHeadline: 'PayTo leads after recent card declines and a successful bank recovery',
    reasonDetail:
      'Recommendation is factual: card stayed eligible but is ranked last because of recent declines; PayTo is the proven recovery path.',
    methodScores: [
      {
        id: 'payto',
        label: 'PayTo',
        score: 94,
        factors: ['Recovery success', 'Active mandate'],
      },
      { id: 'payid', label: 'PayID', score: 73, factors: ['Bank alternative'] },
      { id: 'afterpay', label: 'Afterpay', score: 67, factors: ['Eligible fallback'] },
      { id: 'card', label: 'Card', score: 44, factors: ['Recent declines'] },
    ],
  },
};

/** Profile-specific why this shopper gets cashback eligibility in cashback checkout mode. */
export const CASHBACK_REASONS: Record<ShopperScenario, string> = {
  recognised:
    'Returning shopper with a settled Circuit & Co. first purchase (A$678) — qualifies for second-purchase rewards on this payment rail.',
  guest:
    'First settled Circuit & Co. payment can unlock second-purchase cashback; no prior history required.',
  student_afterpay:
    'Settled Afterpay first order qualifies Jordan for accessory credit on a second purchase within 14 days.',
  payid_privacy:
    'Bank-push PayID settlement counts as a qualifying first purchase for Circuit & Co. cashback offers.',
  corporate_card:
    'Corporate card settlement still qualifies the shopper profile for optional second-purchase email offers.',
  mobile_guest:
    'Mobile guest checkout: a settled payment seeds cashback eligibility even without a saved profile.',
  afterpay_regular:
    'Regular Afterpay buyer — settled instalment plan payment qualifies for second-purchase cashback.',
  regional_payto:
    'Settled PayTo debit from a live mandate qualifies this regional shopper for second-purchase rewards.',
  new_to_au:
    'New-to-AU shopper: first settled Circuit & Co. payment can unlock welcome second-purchase cashback.',
  senior_saved_card:
    'Saved-card settlement qualifies Helen for a simple second-purchase reward without changing her preferred rail.',
  vip_repeat:
    'High-frequency buyer: each settled Circuit & Co. payment can refresh second-purchase cashback eligibility.',
  card_friction:
    'Completing on the recommended card path settles the order and unlocks second-purchase cashback eligibility.',
};

export const SCENARIO_IDS = Object.keys(SHOPPER_PROFILES) as ShopperScenario[];

export const SCENARIO_LABELS: Record<ShopperScenario, string> = SCENARIO_IDS.reduce(
  (acc, id) => {
    acc[id] = SHOPPER_PROFILES[id].label;
    return acc;
  },
  {} as Record<ShopperScenario, string>,
);

export function getCashbackReason(scenario: ShopperScenario): string {
  return CASHBACK_REASONS[scenario] ?? CASHBACK_REASONS.guest;
}

export function getProfile(scenario: ShopperScenario): ShopperProfile {
  const base = SHOPPER_PROFILES[scenario] ?? SHOPPER_PROFILES.guest;
  return {
    ...base,
    cashbackReason: getCashbackReason(base.id),
  };
}

export function isShopperScenario(value: string | null | undefined): value is ShopperScenario {
  return Boolean(value && value in SHOPPER_PROFILES);
}
