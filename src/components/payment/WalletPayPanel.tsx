import { useDemo } from '../../context/DemoContext';
import { moneyLabel } from '../../lib/format';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function WalletPayPanel({ brand }: { brand: 'applepay' | 'googlepay' }) {
  const { amountDue, currency, startApplePay, startGooglePay, paymentStatus, statusMessage } =
    useDemo();
  const loading = paymentStatus === 'authorising';
  const name = brand === 'applepay' ? 'Apple Pay' : 'Google Pay';
  const hint =
    brand === 'applepay'
      ? 'Confirm this payment with Face ID, Touch ID or your device passcode.'
      : 'Continue to Google Pay to approve this payment, then return here.';
  const start = brand === 'applepay' ? startApplePay : startGooglePay;

  return (
    <div id={`payment-panel-${brand}`} role="region" aria-label={name}>
      <p className="field__hint">{hint}</p>
      <PaymentStatusMessage message={statusMessage} />
      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void start()}
      >
        {loading ? `Connecting to ${name}…` : `Pay ${moneyLabel(amountDue, currency)} with ${name}`}
      </button>
    </div>
  );
}
