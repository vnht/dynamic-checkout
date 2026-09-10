import { useDemo } from '../../context/DemoContext';
import {
  MERCHANT_LEGAL,
  ORDER_NUMBER,
  PAYID_ADDRESS,
} from '../../lib/constants';
import { moneyAudLabel } from '../../lib/format';
import { CopyField } from '../CopyField';
import { CountdownTimer } from '../CountdownTimer';
import { DemoSimulationControls } from '../DemoSimulationControls';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function PayIDPanel() {
  const {
    amountDue,
    startPayId,
    payIdWaiting,
    simulatePayId,
    paymentStatus,
    statusMessage,
    countdownSeconds,
    selectMethod,
  } = useDemo();

  if (!payIdWaiting && paymentStatus !== 'timed_out' && paymentStatus !== 'mismatched') {
    return (
      <div id="payment-panel-payid" role="region" aria-label="PayID payment details">
        <p style={{ marginTop: 0 }}>
          <strong>Pay from your banking app.</strong>
        </p>
        <p>Usually received in under a minute.</p>
        <p>Check the recipient name before you send.</p>
        <p className="field__hint">
          Selecting PayID does not pull funds automatically. You complete the transfer in your bank
          app. Security checks can delay a transfer.
        </p>
        <button
          type="button"
          className="btn btn--primary btn--full"
          onClick={() => startPayId()}
        >
          Show PayID payment details
        </button>
      </div>
    );
  }

  return (
    <div id="payment-panel-payid" role="region" aria-label="PayID payment instructions">
      <p className="modal__eyebrow">Payment instructions</p>
      <CopyField label="PayID" value={PAYID_ADDRESS} />
      <div className="copy-field">
        <span>Recipient name</span>
        <div className="copy-field__value">{MERCHANT_LEGAL}</div>
      </div>
      <CopyField label="Amount" value={moneyAudLabel(amountDue)} />
      <CopyField label="Description" value={ORDER_NUMBER} />
      <p className="field__hint">Expires in 10 minutes.</p>

      <ol className="steps">
        <li>Open your banking app.</li>
        <li>Choose PayID and enter the PayID shown.</li>
        <li>Confirm the recipient is {MERCHANT_LEGAL}.</li>
        <li>
          Enter exactly {moneyAudLabel(amountDue)} and description {ORDER_NUMBER}.
        </li>
        <li>Return here while we confirm the payment.</li>
      </ol>

      <p className="status-banner status-banner--info" role="status">
        Waiting for payment
      </p>

      <CountdownTimer seconds={countdownSeconds} label="Payment window" />

      <div
        className="card-surface"
        style={{ background: 'var(--hc-ink-25)', marginBottom: '0.75rem' }}
        aria-label="Non-scannable demo QR placeholder"
      >
        <p style={{ margin: 0, textAlign: 'center', color: 'var(--hc-ink-700)' }}>
          QR placeholder · Non-scannable demo only
        </p>
      </div>

      <PaymentStatusMessage
        message={statusMessage}
        tone={
          paymentStatus === 'mismatched'
            ? 'error'
            : paymentStatus === 'timed_out'
              ? 'warning'
              : 'info'
        }
      />

      {paymentStatus === 'timed_out' && (
        <div className="demo-sim__actions" style={{ marginBottom: '0.75rem' }}>
          <button
            type="button"
            className="btn btn--dark btn--sm"
            onClick={() => simulatePayId('check_again')}
          >
            Check again
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => selectMethod('card')}
          >
            Choose another method
          </button>
          <button type="button" className="btn btn--ghost btn--sm">
            Contact support
          </button>
        </div>
      )}

      {paymentStatus === 'mismatched' && (
        <div className="demo-sim__actions" style={{ marginBottom: '0.75rem' }}>
          <button type="button" className="btn btn--ghost btn--sm">
            Contact support
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => selectMethod('card')}
          >
            Choose another method
          </button>
        </div>
      )}

      <DemoSimulationControls
        hint="Simulate payer-initiated transfer outcomes. No funds are moved."
        actions={[
          { label: 'Simulate payment received', onClick: () => simulatePayId('received') },
          {
            label: 'Simulate wrong amount',
            onClick: () => simulatePayId('wrong_amount'),
            variant: 'ghost',
          },
          {
            label: 'Simulate timeout',
            onClick: () => simulatePayId('timeout'),
            variant: 'ghost',
          },
        ]}
      />
    </div>
  );
}
