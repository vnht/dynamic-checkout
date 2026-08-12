import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DemoScenarioControl } from './components/DemoScenarioControl';
import { MerchantHeader } from './components/MerchantHeader';
import { PaymentGatewayHeader } from './components/PaymentGatewayHeader';
import { ViewModeSwitch } from './components/ViewModeSwitch';
import { DemoProvider } from './context/DemoContext';
import { MerchantPortalShell } from './merchant/MerchantPortalShell';
import { AgenticGrowthPage } from './merchant/pages/AgenticGrowthPage';
import { AudiencePage } from './merchant/pages/AudiencePage';
import { AuditPage } from './merchant/pages/AuditPage';
import { DecisionsPage } from './merchant/pages/DecisionsPage';
import { OverviewPage } from './merchant/pages/OverviewPage';
import { SafetyPage } from './merchant/pages/SafetyPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { PaymentGatewayPage } from './pages/PaymentGatewayPage';

function ConsumerShell() {
  const { pathname } = useLocation();
  const onGateway = pathname.startsWith('/pay');

  return (
    <div className={`app-shell ${onGateway ? 'app-shell--gateway' : ''}`}>
      {onGateway ? <PaymentGatewayHeader /> : <MerchantHeader />}
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/cart" replace />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pay" element={<PaymentGatewayPage />} />
          <Route path="/order/confirmed" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/cart" replace />} />
        </Routes>
      </main>
      <DemoScenarioControl />
    </div>
  );
}

function AppRoutes() {
  const { pathname } = useLocation();
  const onMerchant = pathname.startsWith('/merchant');

  return (
    <div className="demo-root">
      <ViewModeSwitch />
      {onMerchant ? (
        <Routes>
          <Route path="/merchant" element={<MerchantPortalShell />}>
            <Route index element={<OverviewPage />} />
            <Route path="agentic-growth" element={<AgenticGrowthPage />} />
            <Route path="agentic-growth/audience" element={<AudiencePage />} />
            <Route path="agentic-growth/decisions" element={<DecisionsPage />} />
            <Route path="agentic-growth/safety" element={<SafetyPage />} />
            <Route path="agentic-growth/audit" element={<AuditPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/merchant" replace />} />
        </Routes>
      ) : (
        <ConsumerShell />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </DemoProvider>
  );
}
