import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem } from '../components/CartItem';
import { OrderSummary } from '../components/OrderSummary';
import { useDemo } from '../context/DemoContext';
import { trackEvent } from '../lib/analytics';
import { moneyAudLabel } from '../lib/format';

export function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    total,
    cartEmpty,
    startCheckout,
    scenario,
    resetDemo,
  } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    trackEvent({
      name: 'cart_viewed',
      scenario,
      orderTotal: total,
      status: 'viewed',
    });
    // intentionally once on mount for demo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goCheckout = () => {
    startCheckout();
    navigate('/checkout');
  };

  return (
    <div className="page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/cart">Home</Link>
        <span aria-hidden="true">/</span>
        <span>Cart</span>
      </nav>
      <h1 className="page-title">Your cart</h1>

      {cartEmpty ? (
        <div className="card-surface empty-cart">
          <h2 className="section-title">Your cart is empty</h2>
          <p>Add electronics to continue to checkout.</p>
          <button type="button" className="btn btn--primary" onClick={resetDemo}>
            Restore demo cart
          </button>
        </div>
      ) : (
        <div className="two-col">
          <div className="card-surface">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantity={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
            <p style={{ margin: '1rem 0 0', color: 'var(--hc-ink-700)' }}>
              Free standard delivery · 2-4 business days
            </p>
          </div>
          <OrderSummary
            showCta
            ctaLabel="Secure checkout"
            ctaDisabled={cartEmpty}
            onCta={goCheckout}
            showTrust
            showMethods
          />
        </div>
      )}

      {!cartEmpty && (
        <div className="sticky-bar sticky-bar--cart">
          <div className="sticky-bar__inner">
            <strong>{moneyAudLabel(total)}</strong>
            <button type="button" className="btn btn--primary" onClick={goCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
