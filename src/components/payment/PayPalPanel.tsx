import { useDemo } from '../../context/DemoContext';
import { moneyLabel } from '../../lib/format';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function PayPalPanel() {
  const { amountDue, currency, startPayPal, paymentStatus, statusMessage } = useDemo();
  const loading = paymentStatus === 'authorising';

  return (
    <div id="payment-panel-paypal" role="region" aria-label="PayPal">
      <p className="field__hint">Continue to PayPal to approve this payment, then return here.</p>
      <PaymentStatusMessage message={statusMessage} />
      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void startPayPal()}
      >
        {loading ? 'Connecting to PayPal…' : `Pay ${moneyLabel(amountDue, currency)} with PayPal`}
      </button>
    </div>
  );
}
