import type {
  CardDetails,
  CheckoutCurrency,
  CheckoutMarket,
  ContactDetails,
  DeliveryDetails,
  InsightSignal,
  MethodScore,
  PaymentMethod,
  ShopperScenario,
} from '../types';
import { getCashbackCase, type CashbackCase } from './cashbackCase';

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
  currency?: CheckoutCurrency;
  market?: CheckoutMarket;
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
  /** Shopper-facing instant-credit line in cashback checkout mode. */
  cashbackReason?: string;
  /** Merchant-facing why this shopper should be funded. */
  cashbackCase?: CashbackCase;
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

const baseContext = (
  amountNote: string,
  friction: string,
  market = 'Australia',
): InsightSignal[] => [
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
    label: 'Market',
    value: market,
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
    label: 'Mia Chen, returning PayTo',
    group: 'Recognised',
    shortName: 'Mia',
    identityTitle: 'Recognised shopper',
    identitySummary:
      'Mia Chen is matched from a returning Circuit & Co. profile with an active PayTo agreement. Last success 12 days ago. Cashback keeps the next order on that local rail, not card.',
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
    label: 'Guest, no history',
    group: 'Guest',
    shortName: 'Alex',
    identityTitle: 'Guest shopper',
    identitySummary:
      'First Circuit & Co. order: no profile, no history, A$678 electronics. This is the 42% never-return cohort unless instant cashback gives Alex a reason to come back.',
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
    label: 'Jordan Lee, student / BNPL',
    group: 'Recognised',
    shortName: 'Jordan',
    identityTitle: 'Recognised · student segment',
    identitySummary:
      'Jordan Lee is the 18–34 metro Afterpay slice Circuit & Co. loses after headphone / accessory first orders. Two prior Pay in 4 successes. Cashback is how this becomes a second purchase.',
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
    label: 'Sam Okonkwo, PayID preferrer',
    group: 'Recognised',
    shortName: 'Sam',
    identityTitle: 'Recognised · bank-push preferrer',
    identitySummary:
      'Sam Okonkwo is recognised with no saved cards. Last success was PayID. Cashback rewards the local bank-push rail so the next checkout does not train him onto Visa.',
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
    label: 'Priya Nair, corporate buyer',
    group: 'Recognised',
    shortName: 'Priya',
    identityTitle: 'Recognised · business buyer',
    identitySummary:
      'Priya Nair buys for Northwind Labs on a saved corporate Visa. AP buyers rarely browse back. Instant cashback is the hook for the next requisition.',
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
    label: 'Guest, mobile web first-time',
    group: 'Guest',
    shortName: 'Riley',
    identityTitle: 'Guest · mobile session',
    identitySummary:
      'First-time mobile web visitor with no account match. Highest one-and-done risk. Instant cashback is the only second-purchase signal that survives the tab close.',
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
    label: 'Aisha Rahman, Afterpay regular',
    group: 'Recognised',
    shortName: 'Aisha',
    identityTitle: 'Recognised · BNPL regular',
    identitySummary:
      'Aisha Rahman is a frequent Afterpay shopper with four settlements this quarter. Value-seekers churn after the gadget; cashback on Pay in 4 funds the accessory attach.',
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
    label: 'Noah Blake, regional PayTo',
    group: 'Recognised',
    shortName: 'Noah',
    identityTitle: 'Recognised · regional returning',
    identitySummary:
      'Noah Blake shops from Dubbo with an active CBA PayTo agreement. Regional shoppers are expensive to reacquire. Cashback keeps him on the local rail.',
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
      'Recognised regional shopper with a live PayTo mandate. Bank debit is recommended without requiring card details.',
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
    label: 'Guest, new to Australia',
    group: 'Guest',
    shortName: 'Wei',
    identityTitle: 'Guest · limited AU banking history',
    identitySummary:
      'Guest with no AU banking history. Card is familiar today; welcome cashback is how the second order and a future PayID stick.',
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
    label: 'Helen Brooks, saved card preferrer',
    group: 'Recognised',
    shortName: 'Helen',
    identityTitle: 'Recognised · familiar-card preferrer',
    identitySummary:
      'Helen Brooks is a 6-year customer who finishes on a saved Visa and skips bank apps. Cashback keeps her on the rail she will complete. Losing her is worse than losing a guest.',
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
      'Factual history shows Helen completes saved-card payments and rarely finishes bank-app flows. Card is recommended without removing other methods.',
    methodScores: [
      { id: 'card', label: 'Card', score: 96, factors: ['Saved Visa', 'Completion habit'] },
      { id: 'afterpay', label: 'Afterpay', score: 64, factors: ['Occasional use'] },
      { id: 'payid', label: 'PayID', score: 42, factors: ['High abandon'] },
      { id: 'payto', label: 'PayTo', score: 38, factors: ['High abandon'] },
    ],
  },

  vip_repeat: {
    id: 'vip_repeat',
    label: 'Lucas Martin, VIP repeat',
    group: 'Recognised',
    shortName: 'Lucas',
    identityTitle: 'Recognised · high-frequency VIP',
    identitySummary:
      'Lucas Martin is a high-frequency VIP with a fresh NAB PayTo success and a saved Amex. Cashback is insurance the cheapest local rail stays first.',
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
    label: 'Elena Rossi, recent card declines',
    group: 'Recognised',
    shortName: 'Elena',
    identityTitle: 'Recognised · card friction',
    identitySummary:
      'Elena Rossi had two card declines in 30 days, then recovered on Westpac PayTo. Cashback locks the rail that works so friction does not become churn.',
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

  usd_card: {
    id: 'usd_card',
    label: 'Taylor Brooks, returning card',
    group: 'Recognised',
    shortName: 'Taylor',
    currency: 'USD',
    identityTitle: 'Recognised · US returning',
    identitySummary:
      'Taylor Brooks is a returning US shopper with a saved Visa and no bank link. Instant cashback is the second-purchase hook, and how pay by bank can lead next time.',
    contact: {
      email: 'taylor.brooks@example.com',
      mobile: '(212) 555-0148',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Taylor',
      lastName: 'Brooks',
      street: '210 Lafayette Street',
      suburb: 'New York',
      state: 'NY',
      postcode: '10012',
    },
    cardPrefill: demoCard('Taylor Brooks', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
        detailLine: 'Saved Visa ending 4242',
        saved: true,
      },
      { id: 'klarna' },
      { id: 'applepay' },
      { id: 'googlepay' },
      { id: 'paybybank' },
      { id: 'paypal' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'taylor.brooks@example.com', weight: 'high' },
      { id: 'device', label: 'Returning device', value: 'Known browser session', weight: 'medium' },
      { id: 'card', label: 'Saved instrument', value: 'Visa ···4242', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Card · 9 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Reuse saved card', 'United States'),
    rankStepDetail: 'Saved Visa and last-success card outrank Klarna and bank rails.',
    reasonHeadline: 'Card leads because it was used successfully last time',
    reasonDetail:
      'Dynamic Checkout keeps every USD-eligible method visible, but leads with the saved Visa that completed the last order.',
    methodScores: [
      { id: 'card', label: 'Card', score: 95, factors: ['Saved Visa', 'Last success'] },
      { id: 'klarna', label: 'Klarna', score: 74, factors: ['Eligible cart total'] },
      { id: 'applepay', label: 'Apple Pay', score: 70, factors: ['Device wallet available'] },
      { id: 'googlepay', label: 'Google Pay', score: 62, factors: ['Unused on this device'] },
      { id: 'paybybank', label: 'Pay by bank', score: 66, factors: ['No linked account'] },
      { id: 'paypal', label: 'PayPal', score: 58, factors: ['Unused recently'] },
    ],
  },

  usd_afterpay: {
    id: 'usd_afterpay',
    label: 'Maya Ortiz, Klarna regular',
    group: 'Recognised',
    shortName: 'Maya',
    currency: 'USD',
    identityTitle: 'Recognised · US BNPL regular',
    identitySummary:
      'Maya Ortiz is a Los Angeles Klarna regular with three Pay in 4 orders this quarter. US value-seekers expand or disappear; cashback funds the attach item on the rail she trusts.',
    contact: {
      email: 'maya.ortiz@example.com',
      mobile: '(323) 555-0190',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Maya',
      lastName: 'Ortiz',
      street: '818 N Spring Street',
      suburb: 'Los Angeles',
      state: 'CA',
      postcode: '90012',
    },
    cardPrefill: demoCard('Maya Ortiz', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'klarna',
        reason: 'Recommended · Used last time',
        reasonCode: 'klarna_regular',
      },
      { id: 'card', detailLine: 'Saved Mastercard ending 5444', saved: true },
      { id: 'applepay' },
      { id: 'paypal' },
      { id: 'googlepay' },
      { id: 'paybybank' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'maya.ortiz@example.com', weight: 'high' },
      { id: 'bnpl', label: 'BNPL cadence', value: '3 Klarna orders / quarter', weight: 'high' },
      { id: 'standing', label: 'Repayment standing', value: 'Good', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Prior Klarna success', 'United States'),
    rankStepDetail: 'Klarna history and good standing outrank saved card for this cart.',
    reasonHeadline: 'Klarna leads from recent Pay in 4 success',
    reasonDetail:
      'USD Dynamic Checkout still shows card, wallets and pay by bank. Klarna is first because Maya completed similar orders this way.',
    methodScores: [
      { id: 'klarna', label: 'Klarna', score: 94, factors: ['Repeat BNPL', 'Good standing'] },
      { id: 'card', label: 'Card', score: 80, factors: ['Saved Mastercard'] },
      { id: 'applepay', label: 'Apple Pay', score: 68, factors: ['Device wallet'] },
      { id: 'paypal', label: 'PayPal', score: 61, factors: ['Wallet available'] },
      { id: 'googlepay', label: 'Google Pay', score: 56, factors: ['Unused on this device'] },
      { id: 'paybybank', label: 'Pay by bank', score: 52, factors: ['No linked account'] },
    ],
  },

  usd_paypal: {
    id: 'usd_paypal',
    label: 'Chris Bell, PayPal preferrer',
    group: 'Recognised',
    shortName: 'Chris',
    currency: 'USD',
    identityTitle: 'Recognised · US wallet preferrer',
    identitySummary:
      'Chris Bell prefers PayPal so Circuit & Co. never stores a card. Cashback keeps him returning and opens a path to cheaper pay by bank next.',
    contact: {
      email: 'chris.bell@example.com',
      mobile: '(206) 555-0172',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Chris',
      lastName: 'Bell',
      street: '1201 2nd Avenue',
      suburb: 'Seattle',
      state: 'WA',
      postcode: '98101',
    },
    cardPrefill: demoCard('Chris Bell'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'paypal',
        reason: 'Recommended · Used last time',
        reasonCode: 'paypal_preference',
      },
      { id: 'applepay' },
      { id: 'googlepay' },
      { id: 'paybybank' },
      { id: 'card' },
      { id: 'klarna' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'chris.bell@example.com', weight: 'high' },
      { id: 'cards', label: 'Saved cards', value: 'None', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'PayPal · 16 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Avoid card storage', 'United States'),
    rankStepDetail: 'PayPal last success and no saved card outrank a new card entry.',
    reasonHeadline: 'PayPal leads because no card is stored',
    reasonDetail:
      'Card stays selectable. PayPal is recommended from the last successful wallet payment and a stated preference not to store a card.',
    methodScores: [
      { id: 'paypal', label: 'PayPal', score: 93, factors: ['Last success', 'No card on file'] },
      { id: 'applepay', label: 'Apple Pay', score: 74, factors: ['Device wallet'] },
      { id: 'googlepay', label: 'Google Pay', score: 70, factors: ['Device wallet'] },
      { id: 'paybybank', label: 'Pay by bank', score: 71, factors: ['Bank alternative'] },
      { id: 'card', label: 'Card', score: 64, factors: ['Would require new entry'] },
      { id: 'klarna', label: 'Klarna', score: 55, factors: ['No BNPL history'] },
    ],
  },

  usd_applepay: {
    id: 'usd_applepay',
    label: 'Elena Cho, Apple Pay regular',
    group: 'Recognised',
    shortName: 'Elena',
    currency: 'USD',
    identityTitle: 'Recognised · US Apple Pay',
    identitySummary:
      'Elena Cho pays with Apple Pay so Circuit & Co. never stores a card. Cashback keeps Face ID checkout in front of a saved Visa next time.',
    contact: {
      email: 'elena.cho@example.com',
      mobile: '(415) 555-0136',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Elena',
      lastName: 'Cho',
      street: '1 Market Street',
      suburb: 'San Francisco',
      state: 'CA',
      postcode: '94105',
    },
    cardPrefill: demoCard('Elena Cho'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'applepay',
        reason: 'Recommended · Used last time',
        reasonCode: 'applepay_preference',
        detailLine: 'iPhone · Face ID',
      },
      { id: 'card' },
      { id: 'googlepay' },
      { id: 'paypal' },
      { id: 'klarna' },
      { id: 'paybybank' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'elena.cho@example.com', weight: 'high' },
      { id: 'device', label: 'Device wallet', value: 'Apple Pay · Face ID', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Apple Pay · 5 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'One-tap Face ID', 'United States'),
    rankStepDetail: 'Recent Apple Pay success and an eligible iPhone wallet outrank a new card entry.',
    reasonHeadline: 'Apple Pay leads from last Face ID checkout',
    reasonDetail:
      'Card, Google Pay, PayPal, Klarna and pay by bank stay selectable. Apple Pay is first because Elena completed the last order this way.',
    methodScores: [
      { id: 'applepay', label: 'Apple Pay', score: 96, factors: ['Last success', 'Face ID wallet'] },
      { id: 'card', label: 'Card', score: 72, factors: ['Would require new entry'] },
      { id: 'googlepay', label: 'Google Pay', score: 54, factors: ['Wrong device wallet'] },
      { id: 'paypal', label: 'PayPal', score: 60, factors: ['Wallet fallback'] },
      { id: 'klarna', label: 'Klarna', score: 58, factors: ['Eligible unused'] },
      { id: 'paybybank', label: 'Pay by bank', score: 50, factors: ['No linked account'] },
    ],
  },

  usd_googlepay: {
    id: 'usd_googlepay',
    label: 'Malik Rivers, Google Pay regular',
    group: 'Recognised',
    shortName: 'Malik',
    currency: 'USD',
    identityTitle: 'Recognised · US Google Pay',
    identitySummary:
      'Malik Rivers checks out with Google Pay on Android. Cashback rewards the wallet so the next order does not fall back to a typed card.',
    contact: {
      email: 'malik.rivers@example.com',
      mobile: '(404) 555-0188',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Malik',
      lastName: 'Rivers',
      street: '265 Peachtree Center Avenue',
      suburb: 'Atlanta',
      state: 'GA',
      postcode: '30303',
    },
    cardPrefill: demoCard('Malik Rivers'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'googlepay',
        reason: 'Recommended · Used last time',
        reasonCode: 'googlepay_preference',
        detailLine: 'Android · Google account',
      },
      { id: 'card' },
      { id: 'applepay' },
      { id: 'paypal' },
      { id: 'klarna' },
      { id: 'paybybank' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'malik.rivers@example.com', weight: 'high' },
      { id: 'device', label: 'Device wallet', value: 'Google Pay · Android', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Google Pay · 7 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'One-tap Google Pay', 'United States'),
    rankStepDetail: 'Recent Google Pay success and a linked Android wallet outrank a new card entry.',
    reasonHeadline: 'Google Pay leads from the last Android checkout',
    reasonDetail:
      'Card, Apple Pay, PayPal, Klarna and pay by bank stay selectable. Google Pay is first because Malik completed the last order this way.',
    methodScores: [
      { id: 'googlepay', label: 'Google Pay', score: 95, factors: ['Last success', 'Android wallet'] },
      { id: 'card', label: 'Card', score: 73, factors: ['Would require new entry'] },
      { id: 'applepay', label: 'Apple Pay', score: 52, factors: ['Wrong device wallet'] },
      { id: 'paypal', label: 'PayPal', score: 63, factors: ['Wallet fallback'] },
      { id: 'klarna', label: 'Klarna', score: 57, factors: ['Eligible unused'] },
      { id: 'paybybank', label: 'Pay by bank', score: 49, factors: ['No linked account'] },
    ],
  },

  usd_bank: {
    id: 'usd_bank',
    label: 'Samira Khan, returning bank pay',
    group: 'Recognised',
    shortName: 'Samira',
    currency: 'USD',
    identityTitle: 'Recognised · US bank-linked',
    identitySummary:
      'Samira Khan already pays from a linked Chase account. Cashback is how pay by bank stays ahead of the saved Visa.',
    contact: {
      email: 'samira.khan@example.com',
      mobile: '(312) 555-0164',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Samira',
      lastName: 'Khan',
      street: '233 S Wacker Drive',
      suburb: 'Chicago',
      state: 'IL',
      postcode: '60606',
    },
    cardPrefill: demoCard('Samira Khan', true),
    hasPayToAgreement: true,
    payToBankLabel: 'Chase checking ending 18',
    payToReceiptDetail: 'Paid from Chase checking ending 18',
    ranking: [
      {
        id: 'paybybank',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
        detailLine: 'Chase checking ending 18',
      },
      { id: 'card', detailLine: 'Saved Visa ending 4242', saved: true },
      { id: 'applepay' },
      { id: 'googlepay' },
      { id: 'paypal' },
      { id: 'klarna' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'samira.khan@example.com', weight: 'high' },
      { id: 'bank', label: 'Linked account', value: 'Chase ···18 · Active', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Pay by bank · 8 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00', 'Reuse linked bank account', 'United States'),
    rankStepDetail: 'Linked Chase account and last-success bank debit outrank saved card.',
    reasonHeadline: 'Pay by bank leads because the account is already linked',
    reasonDetail:
      'USD Dynamic Checkout keeps card, wallets and Klarna visible. Pay by bank is first because an approved ACH debit already exists.',
    methodScores: [
      { id: 'paybybank', label: 'Pay by bank', score: 96, factors: ['Linked account', 'Last success'] },
      { id: 'card', label: 'Card', score: 81, factors: ['Saved Visa'] },
      { id: 'applepay', label: 'Apple Pay', score: 68, factors: ['Device wallet'] },
      { id: 'googlepay', label: 'Google Pay', score: 64, factors: ['Device wallet'] },
      { id: 'paypal', label: 'PayPal', score: 63, factors: ['Wallet fallback'] },
      { id: 'klarna', label: 'Klarna', score: 54, factors: ['Eligible unused'] },
    ],
  },

  usd_guest: {
    id: 'usd_guest',
    label: 'Guest, US first visit',
    group: 'Guest',
    shortName: 'Jordan',
    currency: 'USD',
    identityTitle: 'Guest · US session',
    identitySummary:
      'No US profile match. First-visit electronics cart. 42% of first-timers never return. Instant cashback is the reason this is not a one-off.',
    contact: {
      email: 'jordan.guest@example.com',
      mobile: '(512) 555-0107',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Jordan',
      lastName: 'Reed',
      street: '98 San Jacinto Blvd',
      suburb: 'Austin',
      state: 'TX',
      postcode: '78701',
    },
    cardPrefill: demoCard('Jordan Reed'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Quick checkout',
        reasonCode: 'quick_checkout',
      },
      { id: 'applepay' },
      { id: 'googlepay' },
      { id: 'klarna' },
      { id: 'paypal' },
      { id: 'paybybank' },
    ],
    recognitionSignals: [
      { id: 'profile', label: 'Customer profile', value: 'No match found', weight: 'high' },
      { id: 'wallet', label: 'Saved methods', value: 'None', weight: 'high' },
      { id: 'history', label: 'Payment history', value: 'Unavailable', weight: 'high' },
    ],
    contextSignals: baseContext('$678.00 · higher consideration', 'Lowest-friction familiar method', 'United States'),
    rankStepDetail: 'With no history, card is the shortest guest path. All USD rails stay selectable.',
    reasonHeadline: 'Card leads as the familiar guest path',
    reasonDetail:
      'No personalisation is claimed. Card is first because it is the lowest-friction method when nothing is on file.',
    methodScores: [
      { id: 'card', label: 'Card', score: 91, factors: ['Familiar guest path'] },
      { id: 'applepay', label: 'Apple Pay', score: 80, factors: ['One-tap if available'] },
      { id: 'googlepay', label: 'Google Pay', score: 78, factors: ['One-tap if available'] },
      { id: 'klarna', label: 'Klarna', score: 76, factors: ['Split payments'] },
      { id: 'paypal', label: 'PayPal', score: 70, factors: ['Wallet without card entry'] },
      { id: 'paybybank', label: 'Pay by bank', score: 58, factors: ['New account link'] },
    ],
  },

  id_dana: {
    id: 'id_dana',
    label: 'Siti Rahma, DANA regular',
    group: 'Recognised',
    shortName: 'Siti',
    currency: 'IDR',
    market: 'Indonesia',
    identityTitle: 'Recognised · DANA wallet',
    identitySummary:
      'Siti Rahma is a returning Jakarta shopper with linked DANA. Cashback rewards the local wallet so the next checkout does not default to the saved Visa.',
    contact: {
      email: 'siti.rahma@example.com',
      mobile: '0812 3456 7890',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Siti',
      lastName: 'Rahma',
      street: 'Jl. Jend. Sudirman Kav. 52-53',
      suburb: 'Jakarta Selatan',
      state: 'DKI Jakarta',
      postcode: '12190',
    },
    cardPrefill: demoCard('Siti Rahma', true),
    hasPayToAgreement: true,
    payToBankLabel: 'DANA wallet ···8812',
    payToReceiptDetail: 'Paid from DANA wallet ending 8812',
    ranking: [
      {
        id: 'dana',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
        detailLine: 'DANA wallet ···8812',
      },
      { id: 'qris' },
      { id: 'card', detailLine: 'Saved Visa ending 4242', saved: true },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'siti.rahma@example.com', weight: 'high' },
      { id: 'wallet', label: 'Linked wallet', value: 'DANA ···8812 · Active', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'DANA · 6 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('Rp10.170.000', 'Reuse linked DANA wallet', 'Indonesia'),
    rankStepDetail: 'Linked DANA wallet and last-success e-wallet outrank QRIS and saved card.',
    reasonHeadline: 'DANA leads because the wallet is already linked',
    reasonDetail:
      'Indonesian Dynamic Checkout keeps Card and QRIS visible. DANA is first because an approved wallet debit already exists.',
    methodScores: [
      { id: 'dana', label: 'DANA', score: 96, factors: ['Linked wallet', 'Last success'] },
      { id: 'qris', label: 'QRIS', score: 78, factors: ['Any QRIS app'] },
      { id: 'card', label: 'Card', score: 70, factors: ['Saved Visa'] },
    ],
  },

  id_qris: {
    id: 'id_qris',
    label: 'Budi Santoso, QRIS regular',
    group: 'Recognised',
    shortName: 'Budi',
    currency: 'IDR',
    market: 'Indonesia',
    identityTitle: 'Recognised · QRIS regular',
    identitySummary:
      'Budi Santoso completes Circuit & Co. by scanning QRIS, four times this quarter. Cashback pays him to stay on the local rail instead of a saved Mastercard.',
    contact: {
      email: 'budi.santoso@example.com',
      mobile: '0813 8821 4400',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Budi',
      lastName: 'Santoso',
      street: 'Jl. Tunjungan 56',
      suburb: 'Surabaya',
      state: 'East Java',
      postcode: '60275',
    },
    cardPrefill: demoCard('Budi Santoso', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'qris',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
      },
      { id: 'dana' },
      { id: 'card', detailLine: 'Saved Mastercard ending 5444', saved: true },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'budi.santoso@example.com', weight: 'high' },
      { id: 'qris', label: 'QRIS cadence', value: '4 QRIS orders / quarter', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'QRIS · 11 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('Rp10.170.000', 'Prior QRIS success', 'Indonesia'),
    rankStepDetail: 'QRIS last success outranks DANA and saved card for this cart.',
    reasonHeadline: 'QRIS leads from recent scan-to-pay success',
    reasonDetail:
      'Card and DANA stay selectable. QRIS is first because Budi completed similar orders by scanning the merchant QR.',
    methodScores: [
      { id: 'qris', label: 'QRIS', score: 94, factors: ['Last success', 'Familiar scan'] },
      { id: 'dana', label: 'DANA', score: 72, factors: ['Wallet available'] },
      { id: 'card', label: 'Card', score: 64, factors: ['Saved Mastercard'] },
    ],
  },

  id_card: {
    id: 'id_card',
    label: 'Putri Ananda, saved card',
    group: 'Recognised',
    shortName: 'Putri',
    currency: 'IDR',
    market: 'Indonesia',
    identityTitle: 'Recognised · ID returning',
    identitySummary:
      'Putri Ananda is card-first in Bandung. Instant cashback still credits on Visa, and is how QRIS or DANA can lead the return visit.',
    contact: {
      email: 'putri.ananda@example.com',
      mobile: '0857 2144 9088',
      smsUpdates: true,
    },
    delivery: {
      firstName: 'Putri',
      lastName: 'Ananda',
      street: 'Jl. Braga 15',
      suburb: 'Bandung',
      state: 'West Java',
      postcode: '40111',
    },
    cardPrefill: demoCard('Putri Ananda', true),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'card',
        reason: 'Recommended · Used last time',
        reasonCode: 'used_last_time',
        detailLine: 'Saved Visa ending 4242',
        saved: true,
      },
      { id: 'qris' },
      { id: 'dana' },
    ],
    recognitionSignals: [
      { id: 'email', label: 'Email match', value: 'putri.ananda@example.com', weight: 'high' },
      { id: 'card', label: 'Saved instrument', value: 'Visa ···4242', weight: 'high' },
      { id: 'history', label: 'Last success', value: 'Card · 9 days ago', weight: 'high' },
    ],
    contextSignals: baseContext('Rp10.170.000', 'Reuse saved card', 'Indonesia'),
    rankStepDetail: 'Saved Visa and last-success card outrank QRIS and DANA.',
    reasonHeadline: 'Card leads because it was used successfully last time',
    reasonDetail:
      'Dynamic Checkout keeps QRIS and DANA visible, but leads with the saved Visa that completed the last order.',
    methodScores: [
      { id: 'card', label: 'Card', score: 95, factors: ['Saved Visa', 'Last success'] },
      { id: 'qris', label: 'QRIS', score: 74, factors: ['Eligible scan'] },
      { id: 'dana', label: 'DANA', score: 61, factors: ['No linked wallet'] },
    ],
  },

  id_guest: {
    id: 'id_guest',
    label: 'Guest, Indonesia first visit',
    group: 'Guest',
    shortName: 'Andi',
    currency: 'IDR',
    market: 'Indonesia',
    identityTitle: 'Guest · Indonesia session',
    identitySummary:
      'No Indonesia profile match. QRIS is the familiar guest path. Cashback is how a Bali cart becomes a returning local payer, not a one-off.',
    contact: {
      email: 'andi.guest@example.com',
      mobile: '0811 2233 4455',
      smsUpdates: false,
    },
    delivery: {
      firstName: 'Andi',
      lastName: 'Wijaya',
      street: 'Jl. Sunset Road 88',
      suburb: 'Denpasar',
      state: 'Bali',
      postcode: '80361',
    },
    cardPrefill: demoCard('Andi Wijaya'),
    hasPayToAgreement: false,
    ranking: [
      {
        id: 'qris',
        reason: 'Recommended · Quick checkout',
        reasonCode: 'quick_checkout',
      },
      { id: 'dana' },
      { id: 'card' },
    ],
    recognitionSignals: [
      { id: 'profile', label: 'Customer profile', value: 'No match found', weight: 'high' },
      { id: 'wallet', label: 'Saved methods', value: 'None', weight: 'high' },
      { id: 'history', label: 'Payment history', value: 'Unavailable', weight: 'high' },
    ],
    contextSignals: baseContext(
      'Rp10.170.000 · higher consideration',
      'Lowest-friction familiar method',
      'Indonesia',
    ),
    rankStepDetail: 'With no history, QRIS is the shortest guest path. Card and DANA stay selectable.',
    reasonHeadline: 'QRIS leads as the familiar guest path',
    reasonDetail:
      'No personalisation is claimed. QRIS is first because scan-to-pay is the lowest-friction method when nothing is on file.',
    methodScores: [
      { id: 'qris', label: 'QRIS', score: 91, factors: ['Familiar guest path'] },
      { id: 'dana', label: 'DANA', score: 76, factors: ['Wallet without card entry'] },
      { id: 'card', label: 'Card', score: 68, factors: ['Would require new entry'] },
    ],
  },
};

/** Profile-specific why this shopper gets cashback eligibility in cashback checkout mode. */
export const CASHBACK_REASONS: Record<ShopperScenario, string> = {
  recognised:
    'Returning shopper. This payment credits instant cashback to Mia’s balance the moment it settles.',
  guest:
    'First Circuit & Co. payment can credit instant cashback immediately; no prior history required.',
  student_afterpay:
    'Settled Afterpay payment credits Jordan instantly. No 14-day wait, no second-purchase unlock.',
  payid_privacy:
    'PayID settlement credits instant cashback the moment the transfer is received.',
  corporate_card:
    'Corporate card settlement still credits instant cashback to the shopper profile on success.',
  mobile_guest:
    'Mobile guest checkout: a successful payment credits instant cashback even without a saved profile.',
  afterpay_regular:
    'Regular Afterpay buyer. Instalment confirmation credits instant cashback immediately.',
  regional_payto:
    'Live PayTo debit credits instant cashback the moment the bank confirms.',
  new_to_au:
    'New-to-AU shopper: first successful payment credits welcome cashback instantly.',
  senior_saved_card:
    'Saved-card success credits Helen instantly without changing her preferred rail.',
  vip_repeat:
    'High-frequency buyer: each successful payment credits more instant cashback on the spot.',
  card_friction:
    'Paying on the recommended path settles the order and credits instant cashback immediately.',
  usd_card:
    'Returning US shopper. Card success credits instant cashback to the balance immediately.',
  usd_afterpay:
    'Klarna confirmation credits Maya instantly, ready to spend on this or a later US shop.',
  usd_paypal:
    'PayPal success credits instant cashback the moment the wallet payment completes.',
  usd_applepay:
    'Apple Pay success credits instant cashback the moment Face ID confirms.',
  usd_googlepay:
    'Google Pay success credits instant cashback the moment the wallet payment completes.',
  usd_bank:
    'Linked bank debit credits instant cashback as soon as the payment succeeds.',
  usd_guest:
    'US guest checkout: a successful payment credits instant cashback even without a saved profile.',
  id_dana:
    'DANA success credits instant cashback the moment the wallet debit completes.',
  id_qris:
    'QRIS confirmation credits Budi instantly. It is already in the balance, with no next-shop unlock.',
  id_card:
    'Returning Indonesia shopper. Card success credits instant cashback immediately.',
  id_guest:
    'Indonesia guest checkout: a successful payment credits instant cashback even without a saved profile.',
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

function marketForCurrency(currency: CheckoutCurrency): CheckoutMarket {
  if (currency === 'USD') return 'United States';
  if (currency === 'IDR') return 'Indonesia';
  return 'Australia';
}

export function getProfile(scenario: ShopperScenario): ShopperProfile {
  const base = SHOPPER_PROFILES[scenario] ?? SHOPPER_PROFILES.guest;
  const currency = base.currency ?? 'AUD';
  return {
    ...base,
    currency,
    market: base.market ?? marketForCurrency(currency),
    cashbackReason: getCashbackReason(base.id),
    cashbackCase: getCashbackCase(base.id),
  };
}

export function isShopperScenario(value: string | null | undefined): value is ShopperScenario {
  return Boolean(value && value in SHOPPER_PROFILES);
}
