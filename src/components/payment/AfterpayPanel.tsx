import { useEffect, useId, useRef, useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { AFTERPAY_DATES } from '../../lib/constants';
import { money, moneyAudLabel } from '../../lib/format';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function AfterpayPanel() {
  const {
    instalment,
    total,
    startAfterpay,
    afterpayOpen,
    confirmAfterpay,
    cancelAfterpay,
    statusMessage,
    paymentStatus,
    contact,
  } = useDemo();
  const [termsOpen, setTermsOpen] = useState(false);
  const [signIn, setSignIn] = useState(contact.email || contact.mobile || '');
  const [step, setStep] = useState<'signin' | 'confirm'>('signin');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    setSignIn(contact.email || contact.mobile || '');
  }, [contact.email, contact.mobile]);

  useEffect(() => {
    if (!afterpayOpen) {
      setStep('signin');
      return;
    }
    previouslyFocused.current = document.activeElement as HTMLElement;
    const focusable = dialogRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cancelAfterpay();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const nodes = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [afterpayOpen, cancelAfterpay]);

  return (
    <div id="payment-panel-afterpay" role="region" aria-label="Afterpay payment details">
      <p style={{ marginTop: 0 }}>
        <strong>Pay in 4</strong> interest-free payments.
      </p>
      <p className="field__hint">Instalment amount is a demo calculation.</p>

      <div className="schedule" aria-label="Afterpay payment schedule">
        {AFTERPAY_DATES.map((item) => (
          <div className="schedule__item" key={item.dateKey}>
            <span>{item.label}</span>
            <strong>{money(instalment)}</strong>
          </div>
        ))}
      </div>

      <p>You'll complete your payment securely with Afterpay.</p>
      <button type="button" className="btn--link" onClick={() => setTermsOpen(true)}>
        View terms
      </button>

      <PaymentStatusMessage
        message={statusMessage}
        tone={paymentStatus === 'cancelled' ? 'warning' : 'info'}
      />

      <button
        type="button"
        className="btn btn--primary btn--full"
        style={{ marginTop: '0.75rem' }}
        onClick={() => startAfterpay()}
      >
        Continue with Afterpay
      </button>

      {termsOpen && (
        <div className="modal-backdrop" role="presentation" onClick={() => setTermsOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="afterpay-terms-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3 id="afterpay-terms-title" style={{ margin: 0 }}>
                Afterpay terms (demo)
              </h3>
              <button type="button" className="btn--link" onClick={() => setTermsOpen(false)}>
                Close
              </button>
            </div>
            <p>
              This is a plain-language demo modal. In production, Afterpay supplies merchant order
              limits, customer eligibility and the full terms experience.
            </p>
            <p>
              You agree to pay four equal instalments. Late fees may apply under Afterpay's real
              terms. No real agreement is created in this demo.
            </p>
          </div>
        </div>
      )}

      {afterpayOpen && (
        <div className="modal-backdrop" role="presentation">
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={dialogRef}
          >
            <p className="modal__eyebrow">Demo simulation</p>
            <div className="modal__header">
              <h3 id={titleId} style={{ margin: 0 }}>
                Afterpay
              </h3>
              <button type="button" className="btn--link" onClick={cancelAfterpay}>
                Cancel and return
              </button>
            </div>

            {step === 'signin' ? (
              <>
                <div className="field">
                  <label htmlFor="afterpaySignIn">Email or mobile</label>
                  <input
                    className="input"
                    id="afterpaySignIn"
                    value={signIn}
                    onChange={(e) => setSignIn(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn--dark btn--full"
                  onClick={() => setStep('confirm')}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="schedule">
                  {AFTERPAY_DATES.map((item) => (
                    <div className="schedule__item" key={item.dateKey}>
                      <span>{item.label}</span>
                      <strong>{money(instalment)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-summary__total">
                  <span>Order total</span>
                  <span>{moneyAudLabel(total)}</span>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--full"
                  style={{ marginTop: '1rem' }}
                  onClick={confirmAfterpay}
                >
                  Confirm and pay
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--full"
                  style={{ marginTop: '0.5rem' }}
                  onClick={cancelAfterpay}
                >
                  Cancel and return
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
