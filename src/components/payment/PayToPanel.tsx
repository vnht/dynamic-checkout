import { useDemo } from '../../context/DemoContext';
import { MERCHANT_NAME } from '../../lib/constants';
import { moneyAudLabel } from '../../lib/format';
import { getProfile } from '../../lib/profiles';
import { CountdownTimer } from '../CountdownTimer';
import { DemoSimulationControls } from '../DemoSimulationControls';
import { PaymentStatusMessage } from '../PaymentStatusMessage';
import { BankAuthorisationWaiting } from './BankAuthorisationWaiting';

export function PayToPanel() {
  const {
    scenario,
    amountDue,
    startPayTo,
    payToWaiting,
    simulatePayTo,
    paymentStatus,
    statusMessage,
    payToIdType,
    setPayToIdType,
    payToIdentifier,
    setPayToIdentifier,
    payToForceNew,
    setPayToForceNew,
    fieldErrors,
    countdownSeconds,
    selectMethod,
  } = useDemo();

  const profile = getProfile(scenario);
  const existingAgreement = profile.hasPayToAgreement && !payToForceNew;
  const bankLabel = profile.payToBankLabel ?? 'Linked bank account';
  const loading = paymentStatus === 'authorising' && !payToWaiting;

  if (payToWaiting || paymentStatus === 'timed_out') {
    return (
      <div id="payment-panel-payto" role="region" aria-label="PayTo authorisation">
        <BankAuthorisationWaiting
          merchant={MERCHANT_NAME}
          amount={moneyAudLabel(amountDue)}
          purpose="Order payment"
          frequency="Once"
        />
        <CountdownTimer seconds={countdownSeconds} label="Authorisation window" />
        <p>Open your banking app and authorise the PayTo agreement.</p>
        <PaymentStatusMessage
          message={statusMessage}
          tone={paymentStatus === 'timed_out' ? 'warning' : 'info'}
        />
        {paymentStatus === 'timed_out' && (
          <div className="demo-sim__actions" style={{ marginBottom: '0.75rem' }}>
            <button
              type="button"
              className="btn btn--dark btn--sm"
              onClick={() => simulatePayTo('approved')}
            >
              I've approved it, check again
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
          hint="Authorisation happens in the shopper's bank environment. No bank login is collected here."
          actions={[
            { label: 'Simulate approval', onClick: () => simulatePayTo('approved') },
            {
              label: 'Simulate rejection',
              onClick: () => simulatePayTo('rejected'),
              variant: 'ghost',
            },
            {
              label: 'Simulate timeout',
              onClick: () => simulatePayTo('timeout'),
              variant: 'ghost',
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div id="payment-panel-payto" role="region" aria-label="PayTo payment details">
      {existingAgreement ? (
        <>
          <p style={{ marginTop: 0 }}>
            <strong>{bankLabel}</strong>
          </p>
          <p className="field__hint">PayTo agreement active</p>
          <p>Fast bank payment · No card details.</p>
          <button type="button" className="btn--link" onClick={() => setPayToForceNew(true)}>
            Use a different bank account
          </button>
          <PaymentStatusMessage
            message={statusMessage}
            tone={paymentStatus === 'declined' ? 'error' : 'info'}
          />
          <button
            type="button"
            className="btn btn--primary btn--full"
            style={{ marginTop: '0.75rem' }}
            disabled={loading}
            onClick={() => void startPayTo()}
          >
            {loading ? 'Confirming with your bank…' : `Pay ${moneyAudLabel(amountDue)} with PayTo`}
          </button>
        </>
      ) : (
        <>
          <p style={{ marginTop: 0 }}>
            {MERCHANT_NAME} will create a one-off PayTo agreement for {moneyAudLabel(amountDue)}. Review
            and authorise it in your banking app before any money is taken.
          </p>
          <p className="field__hint">
            Payments are processed fast, 24/7. A simulated security hold may delay confirmation.
          </p>

          <div className="segmented" role="group" aria-label="Bank identifier type">
            <button
              type="button"
              aria-pressed={payToIdType === 'mobile'}
              onClick={() => {
                setPayToIdType('mobile');
                setPayToIdentifier('0412 345 678');
              }}
            >
              Mobile PayID
            </button>
            <button
              type="button"
              aria-pressed={payToIdType === 'email'}
              onClick={() => {
                setPayToIdType('email');
                setPayToIdentifier('mia.chen@example.com');
              }}
            >
              Email PayID
            </button>
            <button
              type="button"
              aria-pressed={payToIdType === 'bsb'}
              onClick={() => {
                setPayToIdType('bsb');
                setPayToIdentifier('012-003 12345678');
              }}
            >
              BSB & account
            </button>
          </div>

          <div className="field">
            <label htmlFor="payToIdentifier">
              {payToIdType === 'mobile'
                ? 'Mobile PayID'
                : payToIdType === 'email'
                  ? 'Email PayID'
                  : 'BSB and account number'}
            </label>
            <input
              className="input"
              id="payToIdentifier"
              name="payToIdentifier"
              value={payToIdentifier}
              aria-invalid={Boolean(fieldErrors.payToIdentifier)}
              onChange={(e) => setPayToIdentifier(e.target.value)}
            />
            {fieldErrors.payToIdentifier && (
              <span className="field__error" role="alert">
                {fieldErrors.payToIdentifier}
              </span>
            )}
          </div>

          {profile.hasPayToAgreement && (
            <button type="button" className="btn--link" onClick={() => setPayToForceNew(false)}>
              Use saved {bankLabel}
            </button>
          )}

          <PaymentStatusMessage
            message={statusMessage}
            tone={paymentStatus === 'declined' ? 'error' : 'info'}
          />

          <button
            type="button"
            className="btn btn--primary btn--full"
            onClick={() => void startPayTo()}
          >
            Create PayTo agreement
          </button>
        </>
      )}
    </div>
  );
}
