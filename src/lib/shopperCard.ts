import type { CheckoutCurrency, InsightSignal, ShopperScenario } from '../types';
import { getCashbackBalance } from './cashback';
import { getProfile, SCENARIO_IDS, SHOPPER_PROFILES } from './profiles';

export interface ShopperCardModel {
  id: ShopperScenario;
  name: string;
  story: string;
  group: 'Recognised' | 'Guest';
  identityTitle: string;
  location: string;
  market: string;
  currency: CheckoutCurrency;
  payTo: string;
  cashback: number;
  photo: string;
  attributes: InsightSignal[];
}

function displayName(label: string, shortName: string): { name: string; story: string } {
  const parts = label.split(/\s+[—–-]\s+/);
  if (parts.length >= 2) {
    return { name: parts[0], story: parts.slice(1).join(', ') };
  }
  return { name: shortName, story: label };
}

function agreementLabel(currency: CheckoutCurrency, hasAgreement: boolean, bankLabel?: string): string {
  if (hasAgreement) {
    if (bankLabel) return bankLabel;
    if (currency === 'USD') return 'Pay by bank on file';
    if (currency === 'IDR') return 'DANA on file';
    return 'PayTo on file';
  }
  if (currency === 'USD' || currency === 'IDR') return 'None on file';
  return 'No PayTo mandate';
}

export function getShopperCard(id: ShopperScenario): ShopperCardModel {
  const profile = getProfile(id);
  const { name, story } = displayName(profile.label, profile.shortName);
  const currency = profile.currency ?? 'AUD';
  const market = profile.market ?? (currency === 'USD' ? 'United States' : currency === 'IDR' ? 'Indonesia' : 'Australia');

  return {
    id,
    name,
    story,
    group: profile.group,
    identityTitle: profile.identityTitle,
    location: `${profile.delivery.suburb}, ${profile.delivery.state} ${profile.delivery.postcode}`,
    market,
    currency,
    payTo: agreementLabel(currency, profile.hasPayToAgreement, profile.payToBankLabel),
    cashback: getCashbackBalance(id),
    photo: `/shoppers/${id}.png`,
    attributes: profile.recognitionSignals.slice(0, 3),
  };
}

export const US_SHOPPERS = SCENARIO_IDS.filter((id) => SHOPPER_PROFILES[id].currency === 'USD').map(
  getShopperCard,
);

export const AU_SHOPPERS = SCENARIO_IDS.filter(
  (id) => (SHOPPER_PROFILES[id].currency ?? 'AUD') === 'AUD',
).map(getShopperCard);

export const ID_SHOPPERS = SCENARIO_IDS.filter((id) => SHOPPER_PROFILES[id].currency === 'IDR').map(
  getShopperCard,
);

export const ALL_SHOPPERS = [...US_SHOPPERS, ...AU_SHOPPERS, ...ID_SHOPPERS];

/** US and AU first. Used for the opening featured shopper. */
export const PRIORITY_SHOPPERS = [...US_SHOPPERS, ...AU_SHOPPERS];

export function pickRandomPriorityShopper(): ShopperCardModel {
  return PRIORITY_SHOPPERS[Math.floor(Math.random() * PRIORITY_SHOPPERS.length)];
}

export function findShopperCard(id: ShopperScenario): ShopperCardModel {
  return ALL_SHOPPERS.find((shopper) => shopper.id === id) ?? pickRandomPriorityShopper();
}
