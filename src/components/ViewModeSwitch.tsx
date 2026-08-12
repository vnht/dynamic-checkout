import { Link, useLocation } from 'react-router-dom';

export function ViewModeSwitch() {
  const { pathname } = useLocation();
  const onMerchant = pathname.startsWith('/merchant');

  return (
    <div className="view-mode-switch" role="navigation" aria-label="Demo view">
      <div className="view-mode-switch__inner">
        <span className="view-mode-switch__label">Demo view</span>
        <div className="view-mode-switch__toggle" role="group" aria-label="Consumer or merchant view">
          <Link
            to="/cart"
            className={`view-mode-switch__option ${!onMerchant ? 'is-active' : ''}`}
            aria-current={!onMerchant ? 'page' : undefined}
          >
            Consumer
          </Link>
          <Link
            to="/merchant"
            className={`view-mode-switch__option ${onMerchant ? 'is-active' : ''}`}
            aria-current={onMerchant ? 'page' : undefined}
          >
            Merchant
          </Link>
        </div>
      </div>
    </div>
  );
}
