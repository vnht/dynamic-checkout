import { useDemo } from '../../context/DemoContext';
import { moneyLabel } from '../../lib/format';
import { getProfile } from '../../lib/profiles';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function DanaPanel() {
  const { scenario, amountDue, currency, startDana, paymentStatus, statusMessage } = useDemo();
  const profile = getProfile(scenario);
  const linked = profile.hasPayToAgreement;
  const walletLabel = profile.payToBankLabel ?? 'DANA wallet';
  const loading = paymentStatus === 'authorising';

  return (
    <div id="payment-panel-dana" role="region" aria-label="DANA">
      {linked ? (
        <p className="field__hint">{walletLabel} is ready to pay this order.</p>
      ) : (
        <p className="field__hint">Continue to DANA to approve this payment, then return here.</p>
      )}
      <PaymentStatusMessage message={statusMessage} />
      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void startDana()}
      >
        {loading ? 'Opening DANA…' : `Pay ${moneyLabel(amountDue, currency)} with DANA`}
      </button>
    </div>
  );
}
