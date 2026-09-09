import type { ShopperScenario } from '../types';

export type CashbackMotive = 'churn' | 'local_rail' | 'both';

export interface CashbackCaseSignal {
  label: string;
  value: string;
}

export interface CashbackCase {
  motive: CashbackMotive;
  stakesLabel: string;
  headline: string;
  detail: string;
  signals: CashbackCaseSignal[];
}

const CASES: Record<ShopperScenario, CashbackCase> = {
  recognised: {
    motive: 'both',
    stakesLabel: 'Protect a proven local rail',
    headline: 'Mia already pays by PayTo. Cashback is how she comes back on that rail, not card.',
    detail:
      'Last success was 12 days ago. Recognised buyers still leak. Instant cashback on the active ANZ PayTo agreement makes the next Circuit & Co. order the easy one, and keeps a cheap local debit in front of Visa.',
    signals: [
      { label: 'Last success', value: 'PayTo · 12 days ago' },
      { label: 'Local rail', value: 'ANZ PayTo ···42' },
      { label: 'Risk if idle', value: 'Repeat path goes cold' },
    ],
  },
  guest: {
    motive: 'churn',
    stakesLabel: 'High first-order churn',
    headline: 'First Circuit & Co. order. 42% of shoppers like Alex never return in 45 days.',
    detail:
      'No profile, no history, A$678 electronics cart. This is the leak: first-time buyers who complete once and disappear. Instant cashback is the reason to come back, not a later coupon they will forget.',
    signals: [
      { label: 'Purchase', value: 'First · no match' },
      { label: 'Cohort leak', value: '42% never return' },
      { label: 'Cart', value: 'A$678 electronics' },
    ],
  },
  student_afterpay: {
    motive: 'both',
    stakesLabel: 'Core churn segment',
    headline: '18–34 Afterpay shopper. This is the exact slice Circuit & Co. is losing after accessories.',
    detail:
      'Jordan matches the merchant leak: metro, student, Pay in 4, headphone / accessory cart. Instant cashback on Afterpay keeps them in-window without forcing a card they will not use.',
    signals: [
      { label: 'Segment', value: '18–34 · AU metro' },
      { label: 'Rail', value: 'Afterpay · 2 successes' },
      { label: 'Pattern', value: 'Highest 45-day churn' },
    ],
  },
  payid_privacy: {
    motive: 'local_rail',
    stakesLabel: 'Pay them to stay on PayID',
    headline: 'Sam refuses stored cards. Cashback rewards the local bank-push rail, not scheme.',
    detail:
      'No cards on file. Last success was PayID. Without a reason to repeat on that rail, the next checkout trains him onto Visa. Instant cashback is how Circuit & Co. grows PayID share instead of card.',
    signals: [
      { label: 'Saved cards', value: 'None' },
      { label: 'Preferred rail', value: 'PayID · CommBank' },
      { label: 'If we miss', value: 'Falls back to card' },
    ],
  },
  corporate_card: {
    motive: 'churn',
    stakesLabel: 'Business buyers rarely browse back',
    headline: 'Priya buys for AP. Without a hook, Northwind will not place a second Circuit & Co. order.',
    detail:
      'Corporate Visa, office delivery, last paid 5 days ago. B2B electronics is one-and-done unless the next requisition is obvious. Instant cashback on the card she already uses wins the following AP order.',
    signals: [
      { label: 'Account', value: 'Business / AP' },
      { label: 'Habit', value: 'Corporate Visa ···1881' },
      { label: 'Window', value: 'Need a 14-day reason' },
    ],
  },
  mobile_guest: {
    motive: 'churn',
    stakesLabel: 'Mobile one-and-done',
    headline: 'First mobile visit. Highest chance this A$678 cart is the only Circuit & Co. order.',
    detail:
      'No match, no wallet, phone session. Guests on mobile complete or bounce; they almost never self-return. Instant cashback is the only second-purchase signal that survives the tab close.',
    signals: [
      { label: 'Session', value: 'Mobile web · first visit' },
      { label: 'Profile', value: 'No match' },
      { label: 'Cohort leak', value: '42% never return' },
    ],
  },
  afterpay_regular: {
    motive: 'both',
    stakesLabel: 'Expand or lose a value-seeker',
    headline: 'Aisha already splits with Afterpay. Cashback is how accessories become a second order.',
    detail:
      'Four Afterpay settlements this quarter. This is the value-seeking slice that churns after the first gadget. Instant credit on Pay in 4 funds the complementary SKU without pushing her onto card.',
    signals: [
      { label: 'Cadence', value: '4 Afterpay / quarter' },
      { label: 'Segment', value: 'Value-seeker · BNPL' },
      { label: 'Upside', value: 'Accessory attach' },
    ],
  },
  regional_payto: {
    motive: 'both',
    stakesLabel: 'Regional + local rail',
    headline: 'Noah is expensive to reacquire from Dubbo. Cashback keeps him on CBA PayTo.',
    detail:
      'Regional NSW, live CBA agreement, last PayTo 9 days ago. Losing this shopper costs more than a metro guest, and the cheap local debit walks with him. Instant cashback protects both the repeat and the rail.',
    signals: [
      { label: 'Region', value: 'Dubbo · regional NSW' },
      { label: 'Local rail', value: 'CBA PayTo ···19' },
      { label: 'Reacquire cost', value: 'Higher than metro' },
    ],
  },
  new_to_au: {
    motive: 'both',
    stakesLabel: 'Win the second AU order',
    headline: 'Wei has no local banking history. Welcome cashback is how Australia and PayID stick.',
    detail:
      'Guest, no AU match, card is only familiar today. Instant cashback on this first success is the welcome; the next visit is when PayID or PayTo can lead. Miss it and this is a one-off tourist cart.',
    signals: [
      { label: 'Local history', value: 'None' },
      { label: 'Today’s rail', value: 'Card · universal' },
      { label: 'Next visit', value: 'Seed PayID / PayTo' },
    ],
  },
  senior_saved_card: {
    motive: 'churn',
    stakesLabel: 'Do not lose a 6-year customer',
    headline: 'Helen completes on a saved Visa and skips bank apps. Cashback keeps her. It does not force PayTo.',
    detail:
      'Six years of Circuit & Co., high AOV, proven card habit. A 6-year shopper who goes quiet is a worse loss than a guest. Instant cashback on the rail she will actually finish.',
    signals: [
      { label: 'Tenure', value: '6+ years' },
      { label: 'Completes on', value: 'Saved Visa' },
      { label: 'Bank-app', value: 'High abandon' },
    ],
  },
  vip_repeat: {
    motive: 'local_rail',
    stakesLabel: 'Keep the cheapest VIP rail',
    headline: 'Lucas already repeats on NAB PayTo. Cashback is insurance he does not drift to Amex.',
    detail:
      'Eight orders in 90 days, mandate used 2 days ago, Amex sitting in the wallet. High-frequency VIPs switch to card when it is one tap. Instant cashback on PayTo keeps the lowest-cost rail first.',
    signals: [
      { label: 'Frequency', value: '8 orders / 90 days' },
      { label: 'Lead rail', value: 'NAB PayTo ···77' },
      { label: 'Temptation', value: 'Saved Amex' },
    ],
  },
  card_friction: {
    motive: 'local_rail',
    stakesLabel: 'Lock the recovery rail',
    headline: 'Two card declines already. Cashback on PayTo is how Elena does not churn after friction.',
    detail:
      'Visa failed twice in 30 days; Westpac PayTo recovered the last order. If the next checkout leads with card again, she leaves. Instant cashback on the rail that actually works.',
    signals: [
      { label: 'Card result', value: '2 declines / 30 days' },
      { label: 'Recovery', value: 'Westpac PayTo' },
      { label: 'If we miss', value: 'Abandons after friction' },
    ],
  },
  usd_card: {
    motive: 'churn',
    stakesLabel: 'Hook the US second purchase',
    headline: 'Taylor’s last card payment was 9 days ago. Without cashback this is another one-category order.',
    detail:
      'Returning US shopper, saved Visa, no bank link yet. Instant cashback is the second-purchase hook, and the reason pay by bank can lead next time instead of another scheme debit.',
    signals: [
      { label: 'Last success', value: 'Card · 9 days ago' },
      { label: 'Bank link', value: 'None' },
      { label: 'Cohort', value: 'US first-repeat window' },
    ],
  },
  usd_afterpay: {
    motive: 'both',
    stakesLabel: 'US value-seeker churn',
    headline: 'Maya is the US Klarna regular who expands or disappears after Pay in 4.',
    detail:
      'Three Klarna orders this quarter, LA metro, good standing. Same pattern as AU: value-seekers churn after the gadget. Instant cashback on Klarna funds the attach item on the rail she already trusts.',
    signals: [
      { label: 'Cadence', value: '3 Klarna / quarter' },
      { label: 'Market', value: 'US metro · LA' },
      { label: 'Upside', value: 'Second-order attach' },
    ],
  },
  usd_paypal: {
    motive: 'local_rail',
    stakesLabel: 'Wallet vs local bank',
    headline: 'Chris pays PayPal so Circuit & Co. never stores a card. Cashback can grow pay by bank next.',
    detail:
      'No saved cards, last success PayPal. Instant cashback on this wallet payment keeps him returning; the same program is how a linked US bank account becomes the cheaper local default.',
    signals: [
      { label: 'Saved cards', value: 'None' },
      { label: 'Today', value: 'PayPal preferrer' },
      { label: 'Local alternative', value: 'Pay by bank' },
    ],
  },
  usd_applepay: {
    motive: 'local_rail',
    stakesLabel: 'Wallet vs stored card',
    headline: 'Elena pays with Face ID so Circuit & Co. never stores a card. Cashback keeps Apple Pay first.',
    detail:
      'iPhone wallet, last Apple Pay success 5 days ago. Instant cashback on this Face ID payment keeps her returning, and is how pay by bank can become the cheaper default later.',
    signals: [
      { label: 'Device wallet', value: 'Apple Pay · Face ID' },
      { label: 'Last success', value: 'Apple Pay · 5 days' },
      { label: 'Local alternative', value: 'Pay by bank' },
    ],
  },
  usd_googlepay: {
    motive: 'local_rail',
    stakesLabel: 'Android wallet habit',
    headline: 'Malik checks out with Google Pay. Cashback stops the next order falling back to a typed card.',
    detail:
      'Android wallet, last Google Pay success 7 days ago. Instant cashback on the rail he already uses keeps Android one-tap ahead of a new card entry.',
    signals: [
      { label: 'Device wallet', value: 'Google Pay · Android' },
      { label: 'Last success', value: 'Google Pay · 7 days' },
      { label: 'Competing rail', value: 'New card entry' },
    ],
  },
  usd_bank: {
    motive: 'local_rail',
    stakesLabel: 'Reward linked ACH',
    headline: 'Samira already pays from Chase. Cashback is how pay by bank stays ahead of the saved Visa.',
    detail:
      'Linked checking, last ACH success 8 days ago, Visa still on file. US local debit dies when card is one tap. Instant cashback on the linked account defends the cheaper rail.',
    signals: [
      { label: 'Linked account', value: 'Chase ···18' },
      { label: 'Last success', value: 'Pay by bank · 8 days' },
      { label: 'Competing rail', value: 'Saved Visa' },
    ],
  },
  usd_guest: {
    motive: 'churn',
    stakesLabel: 'US first-visit leak',
    headline: 'Jordan has no US profile. 42% of first-timers never place a second Circuit & Co. order.',
    detail:
      'Austin guest, high-consideration electronics, nothing on file. Instant cashback is the only reason this cart becomes a returning US customer instead of a one-off card payment.',
    signals: [
      { label: 'Profile', value: 'No US match' },
      { label: 'Cohort leak', value: '42% never return' },
      { label: 'Cart', value: 'High-consideration' },
    ],
  },
  id_dana: {
    motive: 'local_rail',
    stakesLabel: 'Keep the local wallet',
    headline: 'Siti already pays DANA. Cashback rewards the Indonesian rail, not a stored Visa.',
    detail:
      'Linked DANA, last wallet success 6 days ago, card sitting in the profile. Instant cashback on DANA is how Circuit & Co. grows local e-wallet share instead of defaulting Jakarta to scheme.',
    signals: [
      { label: 'Wallet', value: 'DANA ···8812' },
      { label: 'Last success', value: 'DANA · 6 days ago' },
      { label: 'Competing rail', value: 'Saved Visa' },
    ],
  },
  id_qris: {
    motive: 'local_rail',
    stakesLabel: 'Reward QRIS habit',
    headline: 'Budi scans QRIS every time. Cashback pays him to stay on the local rail.',
    detail:
      'Four QRIS orders this quarter, Surabaya. Instant cashback on scan-to-pay keeps the cheapest local method first and stops a saved Mastercard from taking the next checkout.',
    signals: [
      { label: 'Cadence', value: '4 QRIS / quarter' },
      { label: 'Lead rail', value: 'QRIS scan' },
      { label: 'Competing rail', value: 'Saved Mastercard' },
    ],
  },
  id_card: {
    motive: 'local_rail',
    stakesLabel: 'Shift card to QRIS / DANA',
    headline: 'Putri is card-first in Bandung. Cashback on this order is how local rails win the next one.',
    detail:
      'Saved Visa leads today because it worked last time. Instant cashback still credits on card, and gives Circuit & Co. a reason to rank QRIS or DANA first on the return visit.',
    signals: [
      { label: 'Today’s lead', value: 'Saved Visa' },
      { label: 'Local alternatives', value: 'QRIS · DANA' },
      { label: 'Goal', value: 'Shift next checkout' },
    ],
  },
  id_guest: {
    motive: 'both',
    stakesLabel: 'First Indonesia order',
    headline: 'Andi is a Bali guest on QRIS. Cashback is how a tourist cart becomes a returning local payer.',
    detail:
      'No profile, scan-to-pay first because it is familiar. Instant cashback on QRIS creates the second-order hook and a path to DANA next time, instead of a one-off island purchase.',
    signals: [
      { label: 'Profile', value: 'No ID match' },
      { label: 'Today’s rail', value: 'QRIS · guest' },
      { label: 'Cohort leak', value: '42% never return' },
    ],
  },
};

export function getCashbackCase(scenario: ShopperScenario): CashbackCase {
  return CASES[scenario] ?? CASES.guest;
}

export function cashbackMotiveLabel(motive: CashbackMotive): string {
  if (motive === 'churn') return 'Reduce churn';
  if (motive === 'local_rail') return 'Grow local rails';
  return 'Churn + local rails';
}
