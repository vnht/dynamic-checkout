import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutSection } from '../components/CheckoutSection';
import { ContactForm } from '../components/ContactForm';
import { DeliveryForm } from '../components/DeliveryForm';
import { OrderSummary } from '../components/OrderSummary';
import { useDemo } from '../context/DemoContext';
import { moneyAudLabel } from '../lib/format';

export function CheckoutPage() {
  const { cartEmpty, total, validateCheckoutForms } = useDemo();
  const navigate = useNavigate();
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    if (cartEmpty) navigate('/cart');
  }, [cartEmpty, navigate]);

  const continueToPayment = () => {
    if (!validateCheckoutForms()) return;
    navigate('/pay');
  };

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/cart">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/cart">Cart</Link>
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
        <span>{moneyAudLabel(total)}</span>
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

          <div className="card-surface checkout-section checkout-continue">
            <h2 className="section-title">Payment</h2>
            <p className="checkout-continue__copy">
              Next you'll open the Hello Clever payment gateway to choose Card, PayID, PayTo or
              Afterpay. Your cart and delivery details stay with Circuit & Co.
            </p>
            <div className="method-preview" aria-label="Accepted payment methods">
              <span className="method-chip">Card</span>
              <span className="method-chip">PayID</span>
              <span className="method-chip">PayTo</span>
              <span className="method-chip">Afterpay</span>
            </div>
            <button
              type="button"
              className="btn btn--primary btn--full"
              style={{ marginTop: '1.25rem' }}
              onClick={continueToPayment}
            >
              Continue to secure payment
            </button>
            <p className="trust-line">Encrypted payment page · Powered by Hello Clever</p>
          </div>
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
    </div>
  );
}
