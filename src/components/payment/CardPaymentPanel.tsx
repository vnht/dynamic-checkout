import { useDemo } from '../../context/DemoContext';
import { formatCardNumber, formatExpiry, moneyAudLabel } from '../../lib/format';
import { PaymentStatusMessage } from '../PaymentStatusMessage';

export function CardPaymentPanel() {
  const {
    card,
    setCard,
    total,
    startCardPayment,
    paymentStatus,
    statusMessage,
    fieldErrors,
  } = useDemo();

  const loading = paymentStatus === 'authorising';

  return (
    <div id="payment-panel-card" role="region" aria-label="Card payment details">
      <div className="network-marks" aria-label="Accepted networks">
        <span className="network-mark">Visa</span>
        <span className="network-mark">Mastercard</span>
        <span className="network-mark">Amex</span>
      </div>
      <p className="field__hint">
        Demo success: 4242 4242 4242 4242 · Demo decline: 4000 0000 0000 0002
      </p>

      <div className="field">
        <label htmlFor="cardNumber">Card number</label>
        <input
          className="input"
          id="cardNumber"
          name="cardNumber"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          value={card.number}
          aria-invalid={Boolean(fieldErrors.cardNumber)}
          aria-describedby={fieldErrors.cardNumber ? 'cardNumber-error' : undefined}
          onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
        />
        {fieldErrors.cardNumber && (
          <span className="field__error" id="cardNumber-error" role="alert">
            {fieldErrors.cardNumber}
          </span>
        )}
      </div>

      <div className="field">
        <label htmlFor="cardName">Name on card</label>
        <input
          className="input"
          id="cardName"
          name="cardName"
          autoComplete="cc-name"
          placeholder="MIA CHEN"
          value={card.name}
          aria-invalid={Boolean(fieldErrors.cardName)}
          onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
        />
        {fieldErrors.cardName && (
          <span className="field__error" role="alert">
            {fieldErrors.cardName}
          </span>
        )}
      </div>

      <div className="form-grid form-grid--2">
        <div className="field">
          <label htmlFor="cardExpiry">Expiry MM/YY</label>
          <input
            className="input"
            id="cardExpiry"
            name="cardExpiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="12/30"
            value={card.expiry}
            aria-invalid={Boolean(fieldErrors.cardExpiry)}
            onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
          />
          {fieldErrors.cardExpiry && (
            <span className="field__error" role="alert">
              {fieldErrors.cardExpiry}
            </span>
          )}
        </div>
        <div className="field">
          <label htmlFor="cardCvc">Security code</label>
          <input
            className="input"
            id="cardCvc"
            name="cardCvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={card.cvc}
            aria-invalid={Boolean(fieldErrors.cardCvc)}
            onChange={(e) =>
              setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })
            }
          />
          {fieldErrors.cardCvc && (
            <span className="field__error" role="alert">
              {fieldErrors.cardCvc}
            </span>
          )}
        </div>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={card.saveCard}
          onChange={(e) => setCard({ ...card, saveCard: e.target.checked })}
        />
        <span>Save this card securely for next time</span>
      </label>

      <PaymentStatusMessage
        message={statusMessage}
        tone={paymentStatus === 'declined' ? 'error' : 'info'}
      />

      <button
        type="button"
        className="btn btn--primary btn--full"
        disabled={loading}
        onClick={() => void startCardPayment()}
      >
        {loading ? 'Processing card…' : `Pay ${moneyAudLabel(total)}`}
      </button>
    </div>
  );
}
