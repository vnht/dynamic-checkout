import type {
  ContactDetails,
  DeliveryDetails,
  PersistedPaymentChoice,
  ShopperScenario,
} from '../types';
import { STORAGE_KEYS } from './constants';
import { isShopperScenario } from './profiles';

export function loadScenario(): ShopperScenario | null {
  const value = localStorage.getItem(STORAGE_KEYS.scenario);
  return isShopperScenario(value) ? value : null;
}

export function saveScenario(scenario: ShopperScenario) {
  localStorage.setItem(STORAGE_KEYS.scenario, scenario);
}

export function loadPaymentChoice(): PersistedPaymentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.paymentChoice);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedPaymentChoice;
    if (!isShopperScenario(parsed.scenario)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePaymentChoice(choice: PersistedPaymentChoice) {
  localStorage.setItem(STORAGE_KEYS.paymentChoice, JSON.stringify(choice));
}

export function clearPaymentChoice() {
  localStorage.removeItem(STORAGE_KEYS.paymentChoice);
}

export interface CheckoutDraft {
  contact: ContactDetails;
  delivery: DeliveryDetails;
}

export function loadCheckoutDraft(): CheckoutDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.checkoutDraft);
    return raw ? (JSON.parse(raw) as CheckoutDraft) : null;
  } catch {
    return null;
  }
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  localStorage.setItem(STORAGE_KEYS.checkoutDraft, JSON.stringify(draft));
}

export function clearCheckoutDraft() {
  localStorage.removeItem(STORAGE_KEYS.checkoutDraft);
}

export function resetDemoStorage() {
  clearPaymentChoice();
  clearCheckoutDraft();
  localStorage.removeItem(STORAGE_KEYS.scenario);
  localStorage.removeItem(STORAGE_KEYS.analytics);
  localStorage.removeItem(STORAGE_KEYS.checkoutMode);
  sessionStorage.removeItem(STORAGE_KEYS.checkoutMode);
}
