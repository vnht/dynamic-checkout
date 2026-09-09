import { NavLink, Outlet } from 'react-router-dom';
import { CircuitCoMark } from '../components/CircuitCoMark';
import { useDemo } from '../context/DemoContext';
import { AgenticGrowthProvider, useAgenticGrowth } from './context/AgenticGrowthContext';
import { MerchantAgenticSetup } from './components/MerchantAgenticSetup';
import './merchant.css';

function ShellInner() {
  const { checkoutMode } = useDemo();
  const { setPhase } = useAgenticGrowth();
  const withAgentic = checkoutMode === 'cashback';

  return (
    <div className="merchant-shell">
      <aside className="merchant-nav" aria-label="Merchant navigation">
        <div className="merchant-nav__brand">
          <CircuitCoMark />
          <div>
            <strong>Circuit &amp; Co.</strong>
            <span>Merchant Owner</span>
          </div>
        </div>
        <ul className="merchant-nav__list">
          <li>
            <NavLink to="/merchant" end onClick={() => setPhase('opportunity_found')}>
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
        <div className="merchant-content">
          {withAgentic ? <Outlet /> : <MerchantAgenticSetup />}
        </div>
      </div>

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
