import type { CheckoutCurrency, ShopperScenario } from '../types';
import { CASHBACK_RATE } from './constants';
import { money, moneyLabel } from './format';
import { getProfile } from './profiles';

/** Prior-window cashback available to spend at pay (recognised shoppers only). */
const CASHBACK_BALANCES: Record<ShopperScenario, number> = {
  recognised: 0,
  guest: 0,
  student_afterpay: 14.9,
  payid_privacy: 24.5,
  corporate_card: 0,
  mobile_guest: 0,
  afterpay_regular: 22,
  regional_payto: 33.9,
  new_to_au: 0,
  senior_saved_card: 18,
  vip_repeat: 67.8,
  card_friction: 33.9,
  usd_card: 22,
  usd_afterpay: 18,
  usd_paypal: 0,
  usd_applepay: 18,
  usd_googlepay: 22,
  usd_bank: 33.9,
  usd_guest: 0,
  id_dana: 18,
  id_qris: 22,
  id_card: 33.9,
  id_guest: 0,
};

export function isRecognisedShopper(scenario: ShopperScenario): boolean {
  return getProfile(scenario).group === 'Recognised';
}

export function getCashbackBalance(scenario: ShopperScenario): number {
  if (!isRecognisedShopper(scenario)) return 0;
  return CASHBACK_BALANCES[scenario] ?? 0;
}

export function hasCashbackBalance(scenario: ShopperScenario): boolean {
  return getCashbackBalance(scenario) > 0;
}

export function cashbackAmount(orderTotal: number): number {
  return Math.round(orderTotal * CASHBACK_RATE * 100) / 100;
}

export function cashbackPercentLabel(): string {
  return `${Math.round(CASHBACK_RATE * 100)}%`;
}

/** e.g. "Yours now: $33.90 AUD instant cashback" */
export function cashbackActivatedLabel(
  orderTotal: number,
  currency: CheckoutCurrency = 'AUD',
): string {
  return `Yours now: ${moneyLabel(cashbackAmount(orderTotal), currency)} instant cashback`;
}

/** Compact badge text, e.g. "Instant 5% back now · $33.90" */
export function cashbackBadgeLabel(
  orderTotal: number,
  currency: CheckoutCurrency = 'AUD',
): string {
  return `Instant ${cashbackPercentLabel()} back now · ${money(cashbackAmount(orderTotal), currency)}`;
}

/** Supporting line under recommended method. Shopper-facing: instant credit, not a later offer. */
export function cashbackOfferDetail(
  orderTotal: number,
  _reason: string,
  currency: CheckoutCurrency = 'AUD',
): string {
  return `${moneyLabel(cashbackAmount(orderTotal), currency)} (${cashbackPercentLabel()}) is credited to your balance the moment this payment succeeds. No waiting.`;
}
