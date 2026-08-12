import { useDemo } from '../context/DemoContext';
import { cartSubtotal, lineTotal } from '../lib/cart';
import { money, moneyAudLabel } from '../lib/format';

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
  const { items, total } = useDemo();
  const subtotal = cartSubtotal(items);

  return (
    <aside className="card-surface sticky-summary" aria-label="Order summary">
      <h2 className="section-title">Order summary</h2>
      {items.map((item) => (
        <div className="order-summary__row" key={item.id}>
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>{money(lineTotal(item))}</span>
        </div>
      ))}
      <div className="order-summary__row">
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div className="order-summary__row">
        <span>Standard delivery</span>
        <span>Free</span>
      </div>
      <div className="order-summary__total">
        <span>Total</span>
        <span>{moneyAudLabel(total)}</span>
      </div>
      <p className="gst-note">Includes GST</p>

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
        <p className="trust-line">Secure payment · Easy returns · Australian support</p>
      )}

      {showMethods && (
        <div className="method-preview" aria-label="Accepted payment methods">
          <span className="method-chip">Card</span>
          <span className="method-chip">PayID</span>
          <span className="method-chip">PayTo</span>
          <span className="method-chip">Afterpay</span>
        </div>
      )}
    </aside>
  );
}
