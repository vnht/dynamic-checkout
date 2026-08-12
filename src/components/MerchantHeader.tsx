import { Link } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';

export function MerchantHeader() {
  const { items } = useDemo();
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="merchant-header">
      <div className="merchant-header__inner">
        <Link to="/cart" className="merchant-wordmark" aria-label="Circuit & Co. home">
          <span className="merchant-wordmark__mark" aria-hidden="true">
            C
          </span>
          <span>Circuit & Co.</span>
        </Link>
        <div className="merchant-header__actions">
          <button type="button" className="header-icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="header-icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M4 20c1.5-3.5 4.2-5 8-5s6.5 1.5 8 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <Link to="/cart" className="header-icon-btn" aria-label={`Cart, ${count} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6h15l-1.5 9h-12L6 6z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M6 6L5 3H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            <span className="cart-count">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
