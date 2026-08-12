import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { trackEvent, getAnalyticsEvents, clearAnalyticsEvents } from '../lib/analytics';
import { afterpayInstalment, cartTotal, isCartEmpty } from '../lib/cart';
import {
  CONSENT_TEXT_VERSION,
  DEFAULT_CART,
  ESTIMATED_DELIVERY,
  MERCHANT_NAME,
  ORDER_NUMBER,
  STORAGE_KEYS,
} from '../lib/constants';
import { money } from '../lib/format';
import { getProfile } from '../lib/profiles';
import { buildPaymentOptions, defaultMethodForScenario } from '../lib/ranking';
import {
  clearCheckoutDraft,
  loadPaymentChoice,
  loadScenario,
  resetDemoStorage,
  saveCheckoutDraft,
  savePaymentChoice,
  saveScenario,
} from '../lib/storage';
import {
  firstErrorKey,
  isDeclineCard,
  isSuccessCard,
  validateCard,
  validateContact,
  validateDelivery,
} from '../lib/validation';
import type {
  AnalyticsEvent,
  CardDetails,
  CartLineItem,
  CheckoutMode,
  ContactDetails,
  DeliveryDetails,
  DemoInsight,
  FieldErrors,
  OrderReceipt,
  PaymentMethod,
  PaymentOption,
  PaymentStatus,
  PayToIdentifierType,
  PromotionalConsentRecord,
  ShopperScenario,
} from '../types';

function loadCheckoutMode(): CheckoutMode {
  const value = localStorage.getItem(STORAGE_KEYS.checkoutMode);
  return value === 'cashback' ? 'cashback' : 'standard';
}

function loadConsentRecord(): PromotionalConsentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.promotionalConsent);
    return raw ? (JSON.parse(raw) as PromotionalConsentRecord) : null;
  } catch {
    return null;
  }
}

interface DemoContextValue {
  scenario: ShopperScenario;
  setScenario: (scenario: ShopperScenario) => void;
  checkoutMode: CheckoutMode;
  setCheckoutMode: (mode: CheckoutMode) => void;
  promotionalConsent: PromotionalConsentRecord | null;
  recordPromotionalConsent: (optedIn: boolean) => void;
  items: CartLineItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  total: number;
  instalment: number;
  cartEmpty: boolean;
  contact: ContactDetails;
  setContact: (next: ContactDetails) => void;
  delivery: DeliveryDetails;
  setDelivery: (next: DeliveryDetails) => void;
  fieldErrors: FieldErrors;
  setFieldErrors: (errors: FieldErrors) => void;
  selectedMethod: PaymentMethod;
  selectMethod: (method: PaymentMethod) => void;
  overridden: boolean;
  paymentOptions: PaymentOption[];
  paymentStatus: PaymentStatus;
  statusMessage: string | null;
  card: CardDetails;
  setCard: (card: CardDetails) => void;
  payToIdType: PayToIdentifierType;
  setPayToIdType: (type: PayToIdentifierType) => void;
  payToIdentifier: string;
  setPayToIdentifier: (value: string) => void;
  afterpayOpen: boolean;
  setAfterpayOpen: (open: boolean) => void;
  payIdWaiting: boolean;
  payToWaiting: boolean;
  payToForceNew: boolean;
  setPayToForceNew: (value: boolean) => void;
  countdownSeconds: number;
  receipt: OrderReceipt | null;
  insight: DemoInsight | null;
  analytics: AnalyticsEvent[];
  demoPanelOpen: boolean;
  setDemoPanelOpen: (open: boolean) => void;
  analyticsOpen: boolean;
  setAnalyticsOpen: (open: boolean) => void;
  startCheckout: () => void;
  validateCheckoutForms: () => boolean;
  startCardPayment: () => Promise<void>;
  startAfterpay: () => boolean;
  confirmAfterpay: () => void;
  cancelAfterpay: () => void;
  startPayTo: () => Promise<void>;
  simulatePayTo: (outcome: 'approved' | 'rejected' | 'timeout') => void;
  startPayId: () => boolean;
  simulatePayId: (outcome: 'received' | 'wrong_amount' | 'timeout' | 'check_again') => void;
  clearStatusMessage: () => void;
  resetDemo: () => void;
  focusField: (name: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const initialScenario = loadScenario() ?? 'recognised';
  const initialProfile = getProfile(initialScenario);
  const savedChoice = loadPaymentChoice();

  const [scenario, setScenarioState] = useState<ShopperScenario>(initialScenario);
  const [checkoutMode, setCheckoutModeState] = useState<CheckoutMode>(() => loadCheckoutMode());
  const [promotionalConsent, setPromotionalConsent] = useState<PromotionalConsentRecord | null>(
    () => loadConsentRecord(),
  );
  const [items, setItems] = useState<CartLineItem[]>(DEFAULT_CART.map((i) => ({ ...i })));
  const [contact, setContactState] = useState<ContactDetails>({ ...initialProfile.contact });
  const [delivery, setDeliveryState] = useState<DeliveryDetails>({
    ...initialProfile.delivery,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    savedChoice?.scenario === initialScenario
      ? savedChoice.method
      : defaultMethodForScenario(initialScenario),
  );
  const [overridden, setOverridden] = useState(
    savedChoice?.scenario === initialScenario ? savedChoice.overridden : false,
  );
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [card, setCard] = useState<CardDetails>({ ...initialProfile.cardPrefill });
  const [payToIdType, setPayToIdType] = useState<PayToIdentifierType>('mobile');
  const [payToIdentifier, setPayToIdentifier] = useState(initialProfile.contact.mobile);
  const [afterpayOpen, setAfterpayOpen] = useState(false);
  const [payIdWaiting, setPayIdWaiting] = useState(false);
  const [payToWaiting, setPayToWaiting] = useState(false);
  const [payToForceNew, setPayToForceNew] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(0);
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [insight, setInsight] = useState<DemoInsight | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>(() => getAnalyticsEvents());
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const countdownRef = useRef<number | null>(null);
  const rankedOnce = useRef(false);

  const total = cartTotal(items);
  const instalment = afterpayInstalment(items);
  const cartEmpty = isCartEmpty(items);

  const recommendedMethod = defaultMethodForScenario(scenario);

  const paymentOptions = useMemo(
    () => buildPaymentOptions(scenario, selectedMethod, overridden, total, checkoutMode),
    [scenario, selectedMethod, overridden, total, checkoutMode],
  );

  const log = useCallback(
    (
      name: string,
      extras?: {
        method?: PaymentMethod | null;
        reasonCode?: string | null;
        status?: string | null;
      },
    ) => {
      const event = trackEvent({
        name,
        scenario,
        method: extras?.method ?? selectedMethod,
        recommendationReasonCode:
          extras?.reasonCode ??
          paymentOptions.find((o) => o.rank === 1)?.reasonCode ??
          null,
        orderTotal: total,
        status: extras?.status ?? paymentStatus,
      });
      setAnalytics((prev) => [...prev.slice(-99), event]);
    },
    [scenario, selectedMethod, paymentOptions, total, paymentStatus],
  );

  useEffect(() => {
    saveScenario(scenario);
  }, [scenario]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.checkoutMode, checkoutMode);
  }, [checkoutMode]);

  useEffect(() => {
    savePaymentChoice({ method: selectedMethod, overridden, scenario });
  }, [selectedMethod, overridden, scenario]);

  const setCheckoutMode = (mode: CheckoutMode) => {
    setCheckoutModeState(mode);
    if (mode === 'standard') {
      setPromotionalConsent(null);
      localStorage.removeItem(STORAGE_KEYS.promotionalConsent);
      localStorage.removeItem(STORAGE_KEYS.agenticGrowthHandoff);
    }
  };

  const recordPromotionalConsent = (optedIn: boolean) => {
    if (!receipt) return;
    const record: PromotionalConsentRecord = {
      id: `consent-${Date.now()}`,
      merchant: MERCHANT_NAME,
      channel: 'email',
      consentTextVersion: CONSENT_TEXT_VERSION,
      timestamp: new Date().toISOString(),
      profileId: scenario,
      orderNumber: receipt.orderNumber,
      paymentMethod: receipt.method,
      optedIn,
    };
    setPromotionalConsent(record);
    localStorage.setItem(STORAGE_KEYS.promotionalConsent, JSON.stringify(record));
    if (optedIn) {
      localStorage.setItem(
        STORAGE_KEYS.agenticGrowthHandoff,
        JSON.stringify({
          orderNumber: receipt.orderNumber,
          total: receipt.total,
          profileId: scenario,
          emailConsent: true,
          settledAt: record.timestamp,
          merchant: MERCHANT_NAME,
        }),
      );
    }
  };

  useEffect(() => {
    saveCheckoutDraft({ contact, delivery });
  }, [contact, delivery]);

  useEffect(() => {
    if (!rankedOnce.current) {
      rankedOnce.current = true;
      log('payment_methods_ranked', {
        method: selectedMethod,
        reasonCode: paymentOptions.find((o) => o.rank === 1)?.reasonCode,
        status: 'ranked',
      });
    }
  }, [log, paymentOptions, selectedMethod]);

  useEffect(() => {
    if (countdownSeconds <= 0) {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
      return;
    }
    countdownRef.current = window.setInterval(() => {
      setCountdownSeconds((s) => {
        if (s <= 1) {
          if (countdownRef.current) window.clearInterval(countdownRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (countdownRef.current) window.clearInterval(countdownRef.current);
    };
  }, [countdownSeconds > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const setScenario = (next: ShopperScenario) => {
    const profile = getProfile(next);
    clearCheckoutDraft();
    setScenarioState(next);
    setOverridden(false);
    const method = defaultMethodForScenario(next);
    setSelectedMethod(method);
    setContactState({ ...profile.contact });
    setDeliveryState({ ...profile.delivery });
    setFieldErrors({});
    setStatusMessage(null);
    setPaymentStatus('idle');
    setCard({ ...profile.cardPrefill });
    setPayToIdType('mobile');
    setPayToIdentifier(profile.contact.mobile);
    setPayIdWaiting(false);
    setPayToWaiting(false);
    setPayToForceNew(false);
    setAfterpayOpen(false);
    setReceipt(null);
    setInsight(null);
    rankedOnce.current = false;
    log('scenario_changed', { method, status: next });
  };

  const setContact = (next: ContactDetails) => setContactState(next);
  const setDelivery = (next: DeliveryDetails) => setDeliveryState(next);

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, Math.min(9, quantity)) } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const selectMethod = (method: PaymentMethod) => {
    const isOverride = method !== recommendedMethod;
    setSelectedMethod(method);
    setOverridden(isOverride);
    setStatusMessage(null);
    setPaymentStatus('idle');
    setPayIdWaiting(false);
    setPayToWaiting(false);
    log('payment_method_selected', { method, status: 'selected' });
    if (isOverride) {
      log('recommended_method_overridden', {
        method,
        reasonCode: paymentOptions.find((o) => o.rank === 1)?.reasonCode,
        status: 'overridden',
      });
    }
  };

  const focusField = (name: string) => {
    window.requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[name="${name}"]`);
      el?.focus();
    });
  };

  const validateCheckoutForms = () => {
    const errors = {
      ...validateContact(contact),
      ...validateDelivery(delivery),
    };
    setFieldErrors(errors);
    const first = firstErrorKey(errors);
    if (first) {
      focusField(first);
      setPaymentStatus('idle');
      return false;
    }
    return true;
  };

  const buildInsight = (method: PaymentMethod, detail: string): DemoInsight => {
    const recommended = paymentOptions.find((o) => o.rank === 1);
    return {
      scenario,
      recommendedMethod: recommended?.id ?? recommendedMethod,
      recommendationReason: recommended?.reason ?? '',
      finalMethod: method,
      overridden: method !== (recommended?.id ?? recommendedMethod),
      consumerOutcome: detail,
      processingRoute:
        method === 'card'
          ? 'Card network via Hello Clever Dynamic Checkout'
          : method === 'afterpay'
            ? 'Afterpay BNPL rail'
            : method === 'payto'
              ? 'PayTo agreement rail (NPP)'
              : 'PayID push payment (NPP)',
      settlementExpectation:
        method === 'afterpay'
          ? 'Merchant settlement per Afterpay agreement'
          : method === 'card'
            ? 'Standard card settlement cycle'
            : 'Near-real-time NPP settlement expectation',
      reconciliationStatus: 'Matched · Demo order HC10482',
    };
  };

  const completeOrder = (method: PaymentMethod, methodDetail: string) => {
    const profile = getProfile(scenario);
    const first = delivery.firstName.trim();
    const name = first || profile.shortName;
    const order: OrderReceipt = {
      orderNumber: ORDER_NUMBER,
      total,
      method,
      methodDetail,
      email: contact.email || profile.contact.email || 'shopper@example.com',
      delivery: { ...delivery },
      estimatedDelivery: ESTIMATED_DELIVERY,
      shopperName: name || undefined,
      afterpayFirstPayment: method === 'afterpay' ? instalment : undefined,
    };
    setReceipt(order);
    setInsight(buildInsight(method, methodDetail));
    setPaymentStatus('succeeded');
    setPayIdWaiting(false);
    setPayToWaiting(false);
    setAfterpayOpen(false);
    setCountdownSeconds(0);
    log('payment_succeeded', { method, status: 'succeeded' });
    log('order_confirmed', { method, status: 'confirmed' });
  };

  const startCheckout = () => {
    log('checkout_started', { status: 'started' });
  };

  const startCardPayment = async () => {
    if (!validateCheckoutForms()) return;
    const cardErrors = validateCard(card);
    setFieldErrors((prev) => ({ ...prev, ...cardErrors }));
    const first = firstErrorKey(cardErrors);
    if (first) {
      focusField(first);
      return;
    }
    setPaymentStatus('authorising');
    setStatusMessage('Processing card...');
    log('payment_authorisation_started', { method: 'card', status: 'authorising' });
    await delay(900);
    setStatusMessage('Running a short security check...');
    await delay(700);

    if (isDeclineCard(card.number)) {
      setPaymentStatus('declined');
      setStatusMessage(
        'This card was declined. Try another card or choose a different payment method.',
      );
      log('payment_failed', { method: 'card', status: 'declined' });
      return;
    }

    if (isSuccessCard(card.number)) {
      completeOrder('card', 'Paid with Visa ending 4242');
      return;
    }

    setPaymentStatus('declined');
    setStatusMessage(
      'Use demo card 4242 4242 4242 4242 for success, or 4000 0000 0000 0002 for a decline.',
    );
    log('payment_failed', { method: 'card', status: 'declined' });
  };

  const startAfterpay = () => {
    if (!validateCheckoutForms()) return false;
    setAfterpayOpen(true);
    setPaymentStatus('authorising');
    log('payment_authorisation_started', { method: 'afterpay', status: 'authorising' });
    return true;
  };

  const confirmAfterpay = () => {
    completeOrder('afterpay', `Afterpay schedule confirmed · First payment ${money(instalment)}`);
  };

  const cancelAfterpay = () => {
    setAfterpayOpen(false);
    setPaymentStatus('cancelled');
    setStatusMessage('Afterpay checkout was cancelled. No payment was taken.');
    log('payment_authorisation_cancelled', { method: 'afterpay', status: 'cancelled' });
  };

  const startPayToSmart = async () => {
    if (!validateCheckoutForms()) return;

    const profile = getProfile(scenario);
    const useExisting = profile.hasPayToAgreement && !payToForceNew;

    if (useExisting) {
      setPaymentStatus('authorising');
      setStatusMessage('Confirming with your bank...');
      log('payment_authorisation_started', { method: 'payto', status: 'authorising' });
      await delay(1200);
      completeOrder(
        'payto',
        profile.payToReceiptDetail ?? 'Paid from linked bank account',
      );
      return;
    }

    if (!payToIdentifier.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        payToIdentifier: 'Enter a bank identifier to create the PayTo agreement.',
      }));
      focusField('payToIdentifier');
      return;
    }

    setPayToWaiting(true);
    setPaymentStatus('waiting');
    setCountdownSeconds(120);
    setStatusMessage(null);
    log('payment_authorisation_started', { method: 'payto', status: 'waiting' });
  };

  const simulatePayTo = (outcome: 'approved' | 'rejected' | 'timeout') => {
    if (outcome === 'approved') {
      completeOrder('payto', 'PayTo agreement authorised');
      return;
    }
    if (outcome === 'rejected') {
      setPayToWaiting(false);
      setPaymentStatus('declined');
      setCountdownSeconds(0);
      setStatusMessage("The PayTo agreement wasn't authorised. No payment was taken.");
      log('payment_failed', { method: 'payto', status: 'declined' });
      return;
    }
    setPaymentStatus('timed_out');
    setCountdownSeconds(0);
    setStatusMessage(
      "We haven't confirmed the PayTo authorisation yet. You can check again or choose another method.",
    );
    log('payment_timed_out', { method: 'payto', status: 'timed_out' });
  };

  const startPayId = () => {
    if (!validateCheckoutForms()) return false;
    setPayIdWaiting(true);
    setPaymentStatus('waiting');
    setCountdownSeconds(600);
    setStatusMessage(null);
    log('payment_authorisation_started', { method: 'payid', status: 'waiting' });
    return true;
  };

  const simulatePayId = (outcome: 'received' | 'wrong_amount' | 'timeout' | 'check_again') => {
    if (outcome === 'received') {
      completeOrder('payid', `PayID payment received · Reference ${ORDER_NUMBER}`);
      return;
    }
    if (outcome === 'wrong_amount') {
      setPaymentStatus('mismatched');
      setStatusMessage(
        "We received a payment that doesn't match this order. Contact support or choose another method.",
      );
      log('payment_failed', { method: 'payid', status: 'mismatched' });
      return;
    }
    if (outcome === 'check_again') {
      setPaymentStatus('waiting');
      setStatusMessage('Still waiting for payment. Complete the transfer in your banking app.');
      return;
    }
    setPaymentStatus('timed_out');
    setCountdownSeconds(0);
    setStatusMessage("We haven't received the payment yet.");
    log('payment_timed_out', { method: 'payid', status: 'timed_out' });
  };

  const clearStatusMessage = () => setStatusMessage(null);

  const resetDemo = () => {
    const profile = getProfile('recognised');
    resetDemoStorage();
    clearAnalyticsEvents();
    setScenarioState('recognised');
    setItems(DEFAULT_CART.map((i) => ({ ...i })));
    setContactState({ ...profile.contact });
    setDeliveryState({ ...profile.delivery });
    setFieldErrors({});
    setSelectedMethod(defaultMethodForScenario('recognised'));
    setOverridden(false);
    setPaymentStatus('idle');
    setStatusMessage(null);
    setCard({ ...profile.cardPrefill });
    setPayToIdType('mobile');
    setPayToIdentifier(profile.contact.mobile);
    setAfterpayOpen(false);
    setPayIdWaiting(false);
    setPayToWaiting(false);
    setPayToForceNew(false);
    setCountdownSeconds(0);
    setReceipt(null);
    setInsight(null);
    setAnalytics([]);
    setPromotionalConsent(null);
    rankedOnce.current = false;
    clearCheckoutDraft();
    localStorage.removeItem(STORAGE_KEYS.promotionalConsent);
    localStorage.removeItem(STORAGE_KEYS.agenticGrowthHandoff);
  };

  const value: DemoContextValue = {
    scenario,
    setScenario,
    checkoutMode,
    setCheckoutMode,
    promotionalConsent,
    recordPromotionalConsent,
    items,
    updateQuantity,
    removeItem,
    total,
    instalment,
    cartEmpty,
    contact,
    setContact,
    delivery,
    setDelivery,
    fieldErrors,
    setFieldErrors,
    selectedMethod,
    selectMethod,
    overridden,
    paymentOptions,
    paymentStatus,
    statusMessage,
    card,
    setCard,
    payToIdType,
    setPayToIdType,
    payToIdentifier,
    setPayToIdentifier,
    afterpayOpen,
    setAfterpayOpen,
    payIdWaiting,
    payToWaiting,
    payToForceNew,
    setPayToForceNew,
    countdownSeconds,
    receipt,
    insight,
    analytics,
    demoPanelOpen,
    setDemoPanelOpen,
    analyticsOpen,
    setAnalyticsOpen,
    startCheckout,
    validateCheckoutForms,
    startCardPayment,
    startAfterpay,
    confirmAfterpay,
    cancelAfterpay,
    startPayTo: startPayToSmart,
    simulatePayTo,
    startPayId,
    simulatePayId,
    clearStatusMessage,
    resetDemo,
    focusField,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
