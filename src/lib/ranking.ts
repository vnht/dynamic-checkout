import type { CheckoutMode, PaymentMethod, PaymentOption, ShopperScenario } from '../types';
import { METHOD_LABELS } from './constants';
import { cashbackBadgeLabel, cashbackOfferDetail } from './cashback';
import { money } from './format';
import { getCashbackReason, getProfile } from './profiles';

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

export function buildPaymentOptions(
  scenario: ShopperScenario,
  selected: PaymentMethod,
  overridden: boolean,
  cartTotal: number,
  checkoutMode: CheckoutMode = 'standard',
  amountDue: number = cartTotal,
): PaymentOption[] {
  const profile = getProfile(scenario);
  const currency = profile.currency ?? 'AUD';
  const instalmentText = `4 payments of ${money(amountDue / 4, currency)}`;
  const recommendedId = profile.ranking[0]?.id;
  const cashbackReason = getCashbackReason(scenario);

  return profile.ranking.map((def, index) => {
    const isSelected = def.id === selected;
    let badge: PaymentOption['badge'];
    if (isSelected && overridden && selected !== recommendedId) {
      badge = 'your_choice';
    } else if (index === 0) {
      badge = 'recommended';
    } else if (def.saved) {
      badge = 'saved';
    }

    const isRecommended = index === 0;
    const showCashback = checkoutMode === 'cashback' && isRecommended;

    return {
      id: def.id,
      label: METHOD_LABELS[def.id],
      supportingText: def.id === 'afterpay' || def.id === 'klarna' ? instalmentText : SUPPORTING[def.id],
      eligible: true,
      rank: index + 1,
      reason: def.reason,
      reasonCode: def.reasonCode,
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

export function defaultMethodForScenario(scenario: ShopperScenario): PaymentMethod {
  return getProfile(scenario).ranking[0]?.id ?? 'card';
}
