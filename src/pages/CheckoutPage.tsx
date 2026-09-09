import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutSection } from '../components/CheckoutSection';
import { ContactForm } from '../components/ContactForm';
import { DeliveryForm } from '../components/DeliveryForm';
import { OrderSummary } from '../components/OrderSummary';
import { useDemo } from '../context/DemoContext';
import { moneyLabel } from '../lib/format';

export function CheckoutPage() {
  const { total, currency, validateCheckoutForms, startCheckout } = useDemo();
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    startCheckout();
    // once on mount for demo analytics
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const continueToPayment = () => {
    if (!validateCheckoutForms()) return;
    navigate('/pay');
  };

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Customers</Link>
        <span aria-hidden="true">/</span>
        <span>Checkout</span>
      </nav>
      <h1 className="page-title">Checkout</h1>

      <button
        type="button"
        className="mobile-summary-toggle"
        aria-expanded={summaryOpen}
        onClick={() => setSummaryOpen((v) => !v)}
      >
        <span>Order summary</span>
        <span>{moneyLabel(total, currency)}</span>
      </button>
      {summaryOpen && (
        <div className="mobile-summary-panel">
          <OrderSummary />
        </div>
      )}

      <div className="two-col">
        <div>
          <CheckoutSection title="Contact" id="contact-heading">
            <ContactForm />
          </CheckoutSection>
          <CheckoutSection title="Delivery" id="delivery-heading">
            <DeliveryForm />
          </CheckoutSection>
        </div>
        <div className="sticky-summary desktop-only-summary">
          <OrderSummary
            showCta
            ctaLabel="Continue to secure payment"
            onCta={continueToPayment}
            showTrust
            showMethods
          />
        </div>
      </div>

      <div className="sticky-bar sticky-bar--checkout">
        <div className="sticky-bar__inner">
          <strong>{moneyLabel(total, currency)}</strong>
          <button type="button" className="btn btn--primary" onClick={continueToPayment}>
            Continue to payment
          </button>
        </div>
      </div>
    </div>
  );
}
