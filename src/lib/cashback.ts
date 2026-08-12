import { CASHBACK_RATE } from './constants';
import { money, moneyAudLabel } from './format';

export function cashbackAmount(orderTotal: number): number {
  return Math.round(orderTotal * CASHBACK_RATE * 100) / 100;
}

export function cashbackPercentLabel(): string {
  return `${Math.round(CASHBACK_RATE * 100)}%`;
}

/** e.g. "Instant cashback!!! 5% — A$33.90 AUD back" */
export function cashbackActivatedLabel(orderTotal: number): string {
  return `Instant cashback!!! ${cashbackPercentLabel()} — ${moneyAudLabel(cashbackAmount(orderTotal))} back`;
}

/** Compact badge text, e.g. "Instant cashback 5% · $33.90" */
export function cashbackBadgeLabel(orderTotal: number): string {
  return `Instant cashback ${cashbackPercentLabel()} · ${money(cashbackAmount(orderTotal))}`;
}

/** Supporting line under recommended method. */
export function cashbackOfferDetail(orderTotal: number, reason: string): string {
  return `${moneyAudLabel(cashbackAmount(orderTotal))} (${cashbackPercentLabel()}) hits as soon as this payment settles. ${reason}`;
}
