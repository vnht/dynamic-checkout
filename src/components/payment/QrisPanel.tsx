import { useDemo } from '../../context/DemoContext';
import { moneyLabel } from '../../lib/format';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function QrisPanel() {
  const { amountDue, currency, startQris, paymentStatus, statusMessage } = useDemo();
  const loading = paymentStatus === 'authorising';

  return (
    <div id="payment-panel-qris" role="region" aria-label="QRIS">
      <p className="field__hint">
        Scan with any QRIS app: GoPay, OVO, DANA, ShopeePay and others.
      </p>
      <div className="qris-frame" aria-hidden="true">
        <img src="/payments/qris.svg" alt="" width={72} height={72} />
        <p>Demo QRIS code · Not scannable</p>
      </div>
      <PaymentStatusMessage message={statusMessage} />
      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void startQris()}
      >
        {loading ? 'Waiting for QRIS payment…' : `Confirm ${moneyLabel(amountDue, currency)} paid`}
      </button>
    </div>
  );
}
