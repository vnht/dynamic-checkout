import { NavLink, Outlet } from 'react-router-dom';
import { AgenticGrowthProvider, useAgenticGrowth } from './context/AgenticGrowthContext';
import { MerchantSimDrawer } from './components/MerchantSimDrawer';
import './merchant.css';

function ShellInner() {
  const { role } = useAgenticGrowth();

  return (
    <div className="merchant-shell">
      <aside className="merchant-nav" aria-label="Merchant navigation">
        <div className="merchant-nav__brand">
          <strong>Hello Clever</strong>
          <span>Merchant portal</span>
        </div>
        <ul className="merchant-nav__list">
          <li>
            <NavLink to="/merchant" end>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/merchant/agentic-growth">Agentic Growth</NavLink>
          </li>
          <li>
            <span className="is-disabled" title="Placeholder in this demo">
              Payments
            </span>
          </li>
          <li>
            <span className="is-disabled" title="Placeholder in this demo">
              Customers
            </span>
          </li>
          <li>
            <span className="is-disabled" title="Placeholder in this demo">
              Settings
            </span>
          </li>
        </ul>
      </aside>

      <div className="merchant-main">
        <header className="merchant-topbar">
          <div className="merchant-topbar__workspace">
            Workspace · <strong>Circuit &amp; Co.</strong>
          </div>
          <div className="merchant-topbar__workspace">
            Role:{' '}
            <strong>{role === 'merchant_owner' ? 'Merchant Owner' : 'Growth Manager'}</strong>
          </div>
        </header>
        <div className="merchant-content">
          <Outlet />
        </div>
      </div>

      <MerchantSimDrawer />
    </div>
  );
}

export function MerchantPortalShell() {
  return (
    <AgenticGrowthProvider>
      <ShellInner />
    </AgenticGrowthProvider>
  );
}
