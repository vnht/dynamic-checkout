import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { cashbackActivatedLabel, cashbackAmount, cashbackPercentLabel } from '../lib/cashback';
import { moneyLabel } from '../lib/format';
import { DemoInsightPanel } from './DemoInsightPanel';
import { PromotionalConsentCard } from './PromotionalConsentCard';

export function OrderConfirmation() {
  const { receipt, checkoutMode, promotionalConsent, recordPromotionalConsent, currency } =
    useDemo();

  if (!receipt) {
    return (
      <div className="confirm card-surface">
        <h1 className="page-title">No confirmed order</h1>
        <p>Complete checkout to see a confirmation.</p>
        <Link className="btn btn--primary" to="/checkout">
          Back to checkout
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
            <dd>{moneyLabel(receipt.total, currency)}</dd>
            {receipt.cashbackApplied ? (
              <>
                <dt>Cashback</dt>
                <dd>−{moneyLabel(receipt.cashbackApplied, currency)}</dd>
              </>
            ) : null}
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
          <div className="cashback-now" role="status">
            <p className="cashback-now__kicker">Credited instantly</p>
            <p className="cashback-now__amount">{moneyLabel(cashbackAmount(receipt.total), currency)}</p>
            <p className="cashback-now__title">{cashbackActivatedLabel(receipt.total, currency)}</p>
            <p className="cashback-now__copy">
              The second your payment succeeded, {cashbackPercentLabel()} landed in your Hello Clever
              balance. It&apos;s already there. Spend it whenever you want.
            </p>
          </div>
        )}

        <div className="confirm__actions">
          <button type="button" className="btn btn--primary">
            View order
          </button>
          <Link to="/" className="btn btn--ghost">
            Choose another customer
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
