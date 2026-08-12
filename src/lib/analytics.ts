import type { AnalyticsEvent, PaymentMethod, ShopperScenario } from '../types';
import { STORAGE_KEYS } from './constants';

const MAX_EVENTS = 100;

function readEvents(): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.analytics);
    return raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]) {
  localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(events.slice(-MAX_EVENTS)));
}

export function trackEvent(input: {
  name: string;
  scenario: ShopperScenario;
  method?: PaymentMethod | null;
  recommendationReasonCode?: string | null;
  orderTotal: number;
  status?: string | null;
}): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    timestamp: new Date().toISOString(),
    scenario: input.scenario,
    method: input.method ?? null,
    recommendationReasonCode: input.recommendationReasonCode ?? null,
    orderTotal: input.orderTotal,
    status: input.status ?? null,
  };
  const next = [...readEvents(), event];
  writeEvents(next);
  return event;
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return readEvents();
}

export function clearAnalyticsEvents() {
  localStorage.removeItem(STORAGE_KEYS.analytics);
}
