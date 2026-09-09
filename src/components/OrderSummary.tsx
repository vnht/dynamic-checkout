import { useDemo } from '../context/DemoContext';
import { cartSubtotal, lineTotal } from '../lib/cart';
import { money, moneyLabel } from '../lib/format';

interface Props {
  showCta?: boolean;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onCta?: () => void;
  ctaLoading?: boolean;
  showTrust?: boolean;
  showMethods?: boolean;
}

export function OrderSummary({
  showCta,
  ctaLabel,
  ctaDisabled,
  onCta,
  ctaLoading,
  showTrust,
  showMethods,
}: Props) {
  const { items, total, currency } = useDemo();
  const subtotal = cartSubtotal(items);

  return (
    <aside className="card-surface sticky-summary" aria-label="Order summary">
      <h2 className="section-title">Order summary</h2>
      {items.map((item) => (
        <div className="order-summary__row order-summary__row--item" key={item.id}>
          <img
            className="order-summary__thumb"
            src={item.imageSrc}
            alt=""
            width={40}
            height={40}
          />
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>{money(lineTotal(item), currency)}</span>
        </div>
      ))}
      <div className="order-summary__row">
        <span>Subtotal</span>
        <span>{money(subtotal, currency)}</span>
      </div>
      <div className="order-summary__row">
        <span>Standard delivery</span>
        <span>Free</span>
      </div>
      <div className="order-summary__total">
        <span>Total</span>
        <span>{moneyLabel(total, currency)}</span>
      </div>
      <p className="gst-note">{currency === 'AUD' ? 'Includes GST' : 'Includes tax'}</p>

      {showCta && (
        <button
          type="button"
          className="btn btn--primary btn--full"
          style={{ marginTop: '1.25rem' }}
          disabled={ctaDisabled || ctaLoading}
          onClick={onCta}
        >
          {ctaLoading ? 'Processing…' : ctaLabel}
        </button>
      )}

      {showTrust && (
        <p className="trust-line">
          {currency === 'USD'
            ? 'Secure payment · Easy returns · US support'
            : currency === 'IDR'
              ? 'Secure payment · Easy returns · Indonesia support'
              : 'Secure payment · Easy returns · Australian support'}
        </p>
      )}

      {showMethods && (
        <div className="method-preview" aria-label="Accepted payment methods">
          <img className="method-chip-logo" src="/payments/card.svg" alt="Card" />
          {currency === 'IDR' ? (
            <>
              <img className="method-chip-logo" src="/payments/qris.svg" alt="QRIS" />
              <img className="method-chip-logo" src="/payments/dana.svg" alt="DANA" />
            </>
          ) : currency === 'USD' ? (
            <>
              <img className="method-chip-logo" src="/payments/klarna.svg" alt="Klarna" />
              <img className="method-chip-logo" src="/payments/paybybank.svg" alt="Pay by bank" />
              <img className="method-chip-logo method-chip-logo--wide" src="/payments/paypal.svg" alt="PayPal" />
            </>
          ) : (
            <>
              <img className="method-chip-logo" src="/payments/afterpay.svg" alt="Afterpay" />
              <img className="method-chip-logo" src="/payments/payid.svg" alt="PayID" />
              <img className="method-chip-logo" src="/payments/payto.svg" alt="PayTo" />
            </>
          )}
        </div>
      )}
    </aside>
  );
}
