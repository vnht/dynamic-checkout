import type {
  CartLineItem,
  ContactDetails,
  DeliveryDetails,
  PaymentMethod,
} from '../types';

export const ORDER_NUMBER = 'HC10482';
export const MERCHANT_NAME = 'Circuit & Co.';
export const MERCHANT_LEGAL = 'Circuit & Co. Pty Ltd';
export const PAYID_ADDRESS = 'circuitco+HC10482@payid.demo';
export const DEMO_PAYTO_MOBILE = '0412 345 678';
export const ESTIMATED_DELIVERY = '14-18 Aug 2026';

export const DEFAULT_CART: CartLineItem[] = [
  {
    id: 'nova-anc',
    name: 'Nova ANC Headphones',
    variant: 'Midnight',
    quantity: 1,
    unitPrice: 499,
    imageSrc: '/products/nova-anc-headphones.jpg',
    imageAlt: 'Nova ANC Headphones in Midnight',
  },
  {
    id: 'orbit-keyboard',
    name: 'Orbit Mechanical Keyboard',
    variant: 'Graphite, AU layout',
    quantity: 1,
    unitPrice: 179,
    imageSrc: '/products/orbit-mechanical-keyboard.jpg',
    imageAlt: 'Orbit Mechanical Keyboard in Graphite',
  },
];

export const DELIVERY_PRICE = 0;

/** Demo cashback rate applied to the order total when checkout mode is cashback. */
export const CASHBACK_RATE = 0.05;

export const RECOGNISED_CONTACT: ContactDetails = {
  email: 'mia.chen@example.com',
  mobile: '0412 345 678',
  smsUpdates: true,
};

export const RECOGNISED_DELIVERY: DeliveryDetails = {
  firstName: 'Mia',
  lastName: 'Chen',
  street: '88 Market Street',
  suburb: 'Sydney',
  state: 'NSW',
  postcode: '2000',
};

export const EMPTY_CONTACT: ContactDetails = {
  email: '',
  mobile: '',
  smsUpdates: false,
};

export const EMPTY_DELIVERY: DeliveryDetails = {
  firstName: '',
  lastName: '',
  street: '',
  suburb: '',
  state: '',
  postcode: '',
};

export const AU_STATES = [
  'ACT',
  'NSW',
  'NT',
  'QLD',
  'SA',
  'TAS',
  'VIC',
  'WA',
] as const;

export const AFTERPAY_DATES = [
  { label: 'Today', dateKey: 'today' },
  { label: '26 Aug 2026', dateKey: '2026-08-26' },
  { label: '09 Sep 2026', dateKey: '2026-09-09' },
  { label: '23 Sep 2026', dateKey: '2026-09-23' },
] as const;

export const US_STATES = [
  'CA',
  'IL',
  'NY',
  'TX',
  'WA',
] as const;

export const ID_PROVINCES = ['DKI Jakarta', 'West Java', 'East Java', 'Bali'] as const;

export const METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Card',
  afterpay: 'Afterpay',
  klarna: 'Klarna',
  payto: 'PayTo',
  payid: 'PayID',
  paybybank: 'Pay by bank',
  paypal: 'PayPal',
  applepay: 'Apple Pay',
  googlepay: 'Google Pay',
  qris: 'QRIS',
  dana: 'DANA',
};

export const STORAGE_KEYS = {
  paymentChoice: 'dcal.paymentChoice',
  scenario: 'dcal.scenario',
  analytics: 'dcal.analytics',
  checkoutDraft: 'dcal.checkoutDraft',
  checkoutMode: 'dcal.dynamicCheckout',
  promotionalConsent: 'dcal.promotionalConsent',
  agenticGrowthHandoff: 'dcal.agenticGrowthHandoff',
} as const;

export const CONSENT_TEXT_VERSION = 'CIR-EMAIL-OFFERS-2026-08-v1';

export const SUCCESS_CARD = '4242424242424242';
export const DECLINE_CARD = '4000000000000002';
