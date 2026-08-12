import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomerInsightPanel } from '../components/CustomerInsightPanel';
import { OrderSummary } from '../components/OrderSummary';
import { PaymentMethodList } from '../components/PaymentMethodList';
import { useDemo } from '../context/DemoContext';
import { MERCHANT_NAME, ORDER_NUMBER } from '../lib/constants';
import { moneyAudLabel } from '../lib/format';
import { firstErrorKey, validateContact, validateDelivery } from '../lib/validation';

export function PaymentGatewayPage() {
  const {
    cartEmpty,
    paymentStatus,
    receipt,
    selectedMethod,
    total,
    paymentOptions,
    contact,
    delivery,
    setFieldErrors,
  } = useDemo();
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(true);

  useEffect(() => {
    if (cartEmpty) {
      navigate('/cart');
      return;
    }
    const errors = {
      ...validateContact(contact),
      ...validateDelivery(delivery),
    };
    if (firstErrorKey(errors)) {
      setFieldErrors(errors);
      navigate('/checkout');
    }
  }, [cartEmpty, contact, delivery, navigate, setFieldErrors]);

  useEffect(() => {
    if (paymentStatus === 'succeeded' && receipt) {
      try {
        sessionStorage.setItem('dcal.receipt', JSON.stringify(receipt));
      } catch {
        /* ignore */
      }
      navigate('/order/confirmed');
    }
  }, [paymentStatus, receipt, navigate]);

  const selected = paymentOptions.find((o) => o.id === selectedMethod);
  const shopperName = [delivery.firstName, delivery.lastName].filter(Boolean).join(' ');

  return (
    <div className="gateway-page">
      <div className="gateway-page__banner" role="status">
        <svg
          className="gateway-page__lock"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 11V8a4 4 0 118 0v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        You are on a secure Hello Clever payment page for {MERCHANT_NAME}.
      </div>

      <div className="page gateway-page__content">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/cart">Cart</Link>
          <span aria-hidden="true">/</span>
          <Link to="/checkout">Checkout</Link>
          <span aria-hidden="true">/</span>
          <span>Payment</span>
        </nav>

        <div className="gateway-page__intro">
          <h1 className="page-title">Choose how to pay</h1>
          <p className="gateway-page__sub">
            Order <strong>{ORDER_NUMBER}</strong>
            {shopperName ? ` · ${shopperName}` : ''} · {moneyAudLabel(total)}
          </p>
        </div>

        <button
          type="button"
          className="mobile-summary-toggle"
          aria-expanded={summaryOpen}
          onClick={() => setSummaryOpen((v) => !v)}
        >
          <span>Order summary</span>
          <span>{moneyAudLabel(total)}</span>
        </button>
        {summaryOpen && (
          <div className="mobile-summary-panel">
            <OrderSummary />
          </div>
        )}

        <div className="two-col">
          <section className="card-surface gateway-payment-card" aria-labelledby="gateway-payment-heading">
            <div className="gateway-payment-card__head">
              <h2 className="section-title" id="gateway-payment-heading">
                Payment methods
              </h2>
              <p className="gateway-payment-card__hint">
                Ranked for this shopper and cart. You can choose any eligible method.
              </p>
            </div>
            <PaymentMethodList />
          </section>

          <div className="sticky-summary desktop-only-summary">
            <OrderSummary />
            <div className="gateway-merchant-card card-surface">
              <h2 className="section-title">Merchant</h2>
              <p className="gateway-merchant-card__name">{MERCHANT_NAME}</p>
              <p className="field__hint">Australian electronics · Order {ORDER_NUMBER}</p>
              <p className="field__hint">
                Delivery to {delivery.suburb || '—'} {delivery.state} {delivery.postcode}
              </p>
              <Link to="/checkout" className="btn--link" style={{ paddingLeft: 0 }}>
                Edit contact or delivery
              </Link>
            </div>
          </div>
        </div>

        <CustomerInsightPanel />

        <p className="footer-note">
          Hello Clever Dynamic Checkout · Selected: {selected?.label ?? selectedMethod} ·{' '}
          {moneyAudLabel(total)}
        </p>
      </div>
    </div>
  );
}
