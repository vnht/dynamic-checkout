import { Link } from 'react-router-dom';
import { MERCHANT_NAME } from '../lib/constants';

export function PaymentGatewayHeader() {
  return (
    <header className="gateway-header">
      <div className="gateway-header__inner">
        <div className="gateway-header__brand">
          <img
            src="/brand/hello-clever-logo-white.svg"
            alt="Hello Clever"
            className="gateway-header__logo"
          />
          <span className="gateway-header__divider" aria-hidden="true" />
          <span className="gateway-header__product">Dynamic Checkout</span>
        </div>
        <div className="gateway-header__meta">
          <span className="gateway-header__paying">
            Paying <strong>{MERCHANT_NAME}</strong>
          </span>
          <Link to="/checkout" className="gateway-header__return">
            Return to checkout
          </Link>
        </div>
      </div>
    </header>
  );
}
