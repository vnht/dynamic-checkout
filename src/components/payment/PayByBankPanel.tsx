import { useDemo } from '../../context/DemoContext';
import { moneyLabel } from '../../lib/format';
import { getProfile } from '../../lib/profiles';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function PayByBankPanel() {
  const {
    scenario,
    amountDue,
    currency,
    startPayByBank,
    paymentStatus,
    statusMessage,
  } = useDemo();
  const profile = getProfile(scenario);
  const linked = profile.hasPayToAgreement;
  const bankLabel = profile.payToBankLabel ?? 'Linked bank account';
  const loading = paymentStatus === 'authorising';

  return (
    <div id="payment-panel-paybybank" role="region" aria-label="Pay by bank">
      {linked ? (
        <p className="field__hint">{bankLabel} is ready to debit this order.</p>
      ) : (
        <p className="field__hint">
          You will confirm a one-off ACH debit from your bank. No card details needed.
        </p>
      )}
      <PaymentStatusMessage message={statusMessage} />
      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void startPayByBank()}
      >
        {loading ? 'Confirming with your bank…' : `Pay ${moneyLabel(amountDue, currency)}`}
      </button>
    </div>
  );
}
