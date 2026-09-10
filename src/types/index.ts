export type ShopperScenario =
  | 'recognised'
  | 'guest'
  | 'student_afterpay'
  | 'payid_privacy'
  | 'corporate_card'
  | 'mobile_guest'
  | 'afterpay_regular'
  | 'regional_payto'
  | 'new_to_au'
  | 'senior_saved_card'
  | 'vip_repeat'
  | 'card_friction'
  | 'usd_card'
  | 'usd_afterpay'
  | 'usd_paypal'
  | 'usd_applepay'
  | 'usd_googlepay'
  | 'usd_bank'
  | 'usd_guest'
  | 'id_dana'
  | 'id_qris'
  | 'id_card'
  | 'id_guest';

export type CheckoutCurrency = 'AUD' | 'USD' | 'IDR';

export type CheckoutMarket = 'Australia' | 'United States' | 'Indonesia';

export type PaymentMethod =
  | 'payto'
  | 'card'
  | 'afterpay'
  | 'klarna'
  | 'payid'
  | 'paybybank'
  | 'paypal'
  | 'applepay'
  | 'googlepay'
  | 'qris'
  | 'dana';

export type PaymentStatus =
  | 'idle'
  | 'validating'
  | 'authorising'
  | 'waiting'
  | 'succeeded'
  | 'cancelled'
  | 'declined'
  | 'timed_out'
  | 'mismatched';

export type AppScreen = 'checkout' | 'payment' | 'confirmation';

export type CheckoutMode = 'normal' | 'dynamic' | 'cashback';

export type PayToIdentifierType = 'mobile' | 'email' | 'bsb';

export interface PromotionalConsentRecord {
  id: string;
  merchant: string;
  channel: 'email';
  consentTextVersion: string;
  timestamp: string;
  profileId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  optedIn: boolean;
}

export interface PaymentOption {
  id: PaymentMethod;
  label: string;
  supportingText: string;
  eligible: boolean;
  rank: number;
  reason?: string;
  reasonCode?: string;
  selected: boolean;
  badge?: 'recommended' | 'your_choice' | 'saved';
  detailLine?: string;
  /** Shown on recommended method when checkout mode is cashback. */
  cashbackLabel?: string;
  cashbackReason?: string;
  /** Demo-only capability, e.g. Card AFT. Not a shopper-facing method name. */
  capabilityNote?: string;
}

export interface CartLineItem {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  unitPrice: number;
  imageSrc: string;
  imageAlt: string;
}

export interface ContactDetails {
  email: string;
  mobile: string;
  smsUpdates: boolean;
}

export interface DeliveryDetails {
  firstName: string;
  lastName: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
  saveCard: boolean;
}

export interface FieldErrors {
  [key: string]: string | undefined;
}

export interface OrderReceipt {
  orderNumber: string;
  total: number;
  method: PaymentMethod;
  methodDetail: string;
  email: string;
  delivery: DeliveryDetails;
  estimatedDelivery: string;
  shopperName?: string;
  afterpayFirstPayment?: number;
  cashbackApplied?: number;
}

export interface DemoInsight {
  scenario: ShopperScenario;
  recommendedMethod: PaymentMethod;
  recommendationReason: string;
  finalMethod: PaymentMethod;
  overridden: boolean;
  consumerOutcome: string;
  processingRoute: string;
  settlementExpectation: string;
  reconciliationStatus: string;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  timestamp: string;
  scenario: ShopperScenario;
  method?: PaymentMethod | null;
  recommendationReasonCode?: string | null;
  orderTotal: number;
  status?: string | null;
}

export interface PersistedPaymentChoice {
  method: PaymentMethod;
  overridden: boolean;
  scenario: ShopperScenario;
}

export interface InsightSignal {
  id: string;
  label: string;
  value: string;
  weight: 'high' | 'medium' | 'low';
}

export interface InsightStep {
  id: string;
  title: string;
  detail: string;
}

export interface MethodScore {
  id: PaymentMethod;
  label: string;
  score: number;
  factors: string[];
}
