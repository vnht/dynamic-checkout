import type { CheckoutMode, PaymentMethod, PaymentOption, ShopperScenario } from '../types';
import { cashbackBadgeLabel, cashbackOfferDetail } from './cashback';
import { money } from './format';
import { getCashbackReason, getProfile } from './profiles';

const SUPPORTING: Record<PaymentMethod, string> = {
  card: 'Visa, Mastercard and American Express',
  afterpay: '4 payments of $169.50',
  payto: 'Pay directly from your bank account',
  payid: 'Complete payment in your banking app',
};

export function buildPaymentOptions(
  scenario: ShopperScenario,
  selected: PaymentMethod,
  overridden: boolean,
  cartTotal: number,
  checkoutMode: CheckoutMode = 'standard',
): PaymentOption[] {
  const profile = getProfile(scenario);
  const instalmentText = `4 payments of ${money(cartTotal / 4)}`;
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
      label:
        def.id === 'card'
          ? 'Card'
          : def.id === 'afterpay'
            ? 'Afterpay'
            : def.id === 'payto'
              ? 'PayTo'
              : 'PayID',
      supportingText: def.id === 'afterpay' ? instalmentText : SUPPORTING[def.id],
      eligible: true,
      rank: index + 1,
      reason: def.reason,
      reasonCode: def.reasonCode,
      detailLine: def.detailLine,
      selected: isSelected,
      badge,
      cashbackLabel: showCashback ? cashbackBadgeLabel(cartTotal) : undefined,
      cashbackReason: showCashback ? cashbackOfferDetail(cartTotal, cashbackReason) : undefined,
    };
  });
}

export function defaultMethodForScenario(scenario: ShopperScenario): PaymentMethod {
  return getProfile(scenario).ranking[0]?.id ?? 'card';
}
