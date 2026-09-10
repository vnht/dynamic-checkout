import type { CheckoutMode, PaymentMethod, PaymentOption, ShopperScenario } from '../types';
import { METHOD_LABELS } from './constants';
import { cashbackBadgeLabel, cashbackOfferDetail } from './cashback';
import { money } from './format';
import { getCashbackReason, getProfile, type ShopperProfile } from './profiles';

const SUPPORTING: Record<PaymentMethod, string> = {
  card: 'Visa, Mastercard and American Express',
  afterpay: '4 payments of $169.50',
  klarna: '4 payments of $169.50',
  payto: 'Pay directly from your bank account',
  payid: 'Complete payment in your banking app',
  paybybank: 'Pay directly from your bank account',
  paypal: 'Check out with your PayPal account',
  applepay: 'Pay with Face ID or Touch ID',
  googlepay: 'Pay with your Google account',
  qris: 'Scan with any QRIS app',
  dana: 'Pay from your DANA balance',
};

const MARKET_CATALOG: Record<string, PaymentMethod[]> = {
  AUD: ['card', 'afterpay', 'payid', 'payto'],
  USD: ['card', 'applepay', 'googlepay', 'paypal', 'klarna', 'paybybank'],
  IDR: ['card', 'qris', 'dana'],
};

function catalogIds(profile: ShopperProfile): PaymentMethod[] {
  const catalog = MARKET_CATALOG[profile.currency ?? 'AUD'] ?? MARKET_CATALOG.AUD;
  const available = new Set(profile.ranking.map((def) => def.id));
  const extras = profile.ranking.map((def) => def.id).filter((id) => !catalog.includes(id));
  return [...catalog.filter((id) => available.has(id)), ...extras];
}

export function isRankedCheckout(mode: CheckoutMode): boolean {
  return mode === 'dynamic' || mode === 'cashback';
}

export function buildPaymentOptions(
  scenario: ShopperScenario,
  selected: PaymentMethod,
  overridden: boolean,
  cartTotal: number,
  checkoutMode: CheckoutMode = 'dynamic',
  amountDue: number = cartTotal,
): PaymentOption[] {
  const profile = getProfile(scenario);
  const currency = profile.currency ?? 'AUD';
  const instalmentText = `4 payments of ${money(amountDue / 4, currency)}`;
  const ranked = isRankedCheckout(checkoutMode);
  const defs = ranked
    ? profile.ranking
    : catalogIds(profile).map((id) => {
        const match = profile.ranking.find((def) => def.id === id);
        return {
          id,
          detailLine: match?.detailLine,
          saved: match?.saved,
        };
      });
  const recommendedId = ranked ? defs[0]?.id : undefined;
  const cashbackReason = getCashbackReason(scenario);

  return defs.map((def, index) => {
    const isSelected = def.id === selected;
    let badge: PaymentOption['badge'];
    if (ranked && isSelected && overridden && selected !== recommendedId) {
      badge = 'your_choice';
    } else if (ranked && index === 0) {
      badge = 'recommended';
    } else if (def.saved) {
      badge = 'saved';
    }

    const isRecommended = ranked && index === 0;
    const showCashback = checkoutMode === 'cashback' && isRecommended;

    return {
      id: def.id,
      label: METHOD_LABELS[def.id],
      supportingText: def.id === 'afterpay' || def.id === 'klarna' ? instalmentText : SUPPORTING[def.id],
      eligible: true,
      rank: index + 1,
      reason: ranked ? def.reason : undefined,
      reasonCode: ranked ? def.reasonCode : undefined,
      detailLine: def.detailLine,
      selected: isSelected,
      badge,
      cashbackLabel: showCashback ? cashbackBadgeLabel(cartTotal, currency) : undefined,
      cashbackReason: showCashback
        ? cashbackOfferDetail(cartTotal, cashbackReason, currency)
        : undefined,
      capabilityNote: def.id === 'card' ? 'AFT supported' : undefined,
    };
  });
}

export function defaultMethodForScenario(
  scenario: ShopperScenario,
  checkoutMode: CheckoutMode = 'dynamic',
): PaymentMethod {
  const profile = getProfile(scenario);
  if (!isRankedCheckout(checkoutMode)) {
    return catalogIds(profile)[0] ?? 'card';
  }
  return profile.ranking[0]?.id ?? 'card';
}
