import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { DemoScenarioControl } from './components/DemoScenarioControl';
import { MerchantHeader } from './components/MerchantHeader';
import { ViewModeSwitch } from './components/ViewModeSwitch';
import { DemoProvider } from './context/DemoContext';
import { MerchantPortalShell } from './merchant/MerchantPortalShell';
import { AgenticGrowthPage } from './merchant/pages/AgenticGrowthPage';
import { AudiencePage } from './merchant/pages/AudiencePage';
import { AuditPage } from './merchant/pages/AuditPage';
import { DecisionsPage } from './merchant/pages/DecisionsPage';
import { SafetyPage } from './merchant/pages/SafetyPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { PaymentGatewayPage } from './pages/PaymentGatewayPage';
import { ShopperPickerPage } from './pages/ShopperPickerPage';

function ConsumerShell() {
  const { pathname } = useLocation();
  const onGateway = pathname.startsWith('/pay');
  const onPicker = pathname === '/';

  return (
    <div
      className={`app-shell ${onGateway ? 'app-shell--gateway' : ''} ${onPicker ? 'app-shell--picker' : ''}`}
    >
      {!onGateway && !onPicker && <MerchantHeader />}
      <main>
        <Routes>
          <Route path="/" element={<ShopperPickerPage />} />
          <Route path="/cart" element={<Navigate to="/checkout" replace />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/pay" element={<PaymentGatewayPage />} />
          <Route path="/order/confirmed" element={<ConfirmationPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!onPicker && <DemoScenarioControl />}
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
            <Route index element={<AgenticGrowthPage />} />
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
