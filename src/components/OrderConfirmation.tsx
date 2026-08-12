import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { cashbackActivatedLabel, cashbackAmount } from '../lib/cashback';
import { moneyAudLabel } from '../lib/format';
import { DemoInsightPanel } from './DemoInsightPanel';
import { PromotionalConsentCard } from './PromotionalConsentCard';

export function OrderConfirmation() {
  const { receipt, checkoutMode, promotionalConsent, recordPromotionalConsent } = useDemo();

  if (!receipt) {
    return (
      <div className="confirm card-surface">
        <h1 className="page-title">No confirmed order</h1>
        <p>Complete checkout to see a confirmation.</p>
        <Link className="btn btn--primary" to="/cart">
          Back to cart
        </Link>
      </div>
    );
  }

  const thanks = receipt.shopperName
    ? `Thanks, ${receipt.shopperName}. Your order is confirmed.`
    : 'Your order is confirmed.';

  return (
    <div className="confirm">
      <div className="card-surface">
        <div className="confirm__icon" aria-hidden="true">
          ✓
        </div>
        <h1 className="page-title">{thanks}</h1>
        <p>A receipt has been sent to {receipt.email}.</p>

        <div className="receipt-grid">
          <dl>
            <dt>Order number</dt>
            <dd>{receipt.orderNumber}</dd>
            <dt>Total</dt>
            <dd>{moneyAudLabel(receipt.total)}</dd>
            <dt>Payment</dt>
            <dd>{receipt.methodDetail}</dd>
            <dt>Delivery</dt>
            <dd>
              {receipt.delivery.firstName} {receipt.delivery.lastName}
              <br />
              {receipt.delivery.street}
              <br />
              {receipt.delivery.suburb} {receipt.delivery.state} {receipt.delivery.postcode}
            </dd>
            <dt>Estimated delivery</dt>
            <dd>{receipt.estimatedDelivery}</dd>
          </dl>
        </div>

        {checkoutMode === 'cashback' && (
          <p className="cashback-eligibility" role="note">
            <strong>{cashbackActivatedLabel(receipt.total)}</strong>
            <br />
            Nice one — {moneyAudLabel(cashbackAmount(receipt.total))} instant cashback is unlocked
            for your next Circuit &amp; Co. shop (use within 14 days). Sign up below so we can send
            the offer.
          </p>
        )}

        <div className="confirm__actions">
          <button type="button" className="btn btn--primary">
            View order
          </button>
          <Link to="/cart" className="btn btn--ghost">
            Continue shopping
          </Link>
        </div>
      </div>

      {checkoutMode === 'cashback' && (
        <div style={{ marginTop: '1rem' }}>
          <PromotionalConsentCard
            consent={promotionalConsent}
            onOptIn={() => recordPromotionalConsent(true)}
            onDecline={() => recordPromotionalConsent(false)}
          />
        </div>
      )}

      <div className="card-surface" style={{ marginTop: '1rem', textAlign: 'left' }}>
        <h2 className="section-title">What happens next</h2>
        <ol className="steps">
          <li>We&apos;ll pack your electronics order.</li>
          <li>Standard delivery in 2-4 business days.</li>
          <li>Track updates will be sent to your email.</li>
        </ol>
      </div>

      <DemoInsightPanel />
    </div>
  );
}
