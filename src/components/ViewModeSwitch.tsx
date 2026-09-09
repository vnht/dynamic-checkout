import { Link, useLocation } from 'react-router-dom';

export function ViewModeSwitch() {
  const { pathname } = useLocation();
  const onMerchant = pathname.startsWith('/merchant');

  return (
    <header className="demo-header" role="banner">
      <div className="demo-header__inner">
        <div className="demo-header__brand">
          <Link to="/" className="demo-header__logo-link">
            <img
              src="/brand/hello-clever-logo-white.svg"
              alt="Hello Clever"
              className="demo-header__logo"
            />
          </Link>
          <span className="demo-header__divider" aria-hidden="true" />
          <span className="demo-header__product">
            {onMerchant ? 'Merchant portal' : 'Dynamic Checkout'}
          </span>
        </div>
        <nav className="demo-header__nav" aria-label="Demo view">
          <div className="demo-header__toggle" role="group" aria-label="Consumer or merchant view">
            <Link
              to="/"
              className={`demo-header__option ${!onMerchant ? 'is-active' : ''}`}
              aria-current={!onMerchant ? 'page' : undefined}
            >
              Consumer
            </Link>
            <Link
              to="/merchant"
              className={`demo-header__option ${onMerchant ? 'is-active' : ''}`}
              aria-current={onMerchant ? 'page' : undefined}
            >
              Merchant
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
