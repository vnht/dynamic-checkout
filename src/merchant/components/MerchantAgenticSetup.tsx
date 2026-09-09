import { CleverAiMark } from '../../components/CleverAiMark';
import { useDemo } from '../../context/DemoContext';

export function MerchantAgenticSetup() {
  const { setCheckoutMode } = useDemo();

  return (
    <div className="mp-setup">
      <p className="mp-setup__kicker">Dynamic Checkout</p>
      <h1 className="mp-page-title">Agentic Growth is not enabled</h1>
      <p className="mp-lead">
        Circuit &amp; Co. is live on Dynamic Checkout.{' '}
        <CleverAiMark size="sm" /> already ranks each shopper&apos;s rails. Turn on Agentic Growth
        to incentivise customers based on their profile and catalyse the next purchase.
      </p>
      <div className="mp-panel mp-setup__panel">
        <h2>What changes</h2>
        <ul className="mp-setup__list">
          <li>
            <CleverAiMark size="sm" /> keeps ranking Dynamic Checkout from each shopper profile.
          </li>
          <li>Eligible shoppers see a profile-based incentive at pay.</li>
          <li>Ineligible traffic stays on ranked checkout with no offer.</li>
          <li>
            <CleverAiMark size="sm" /> drafts the Instant cashback program from merchant evidence.
          </li>
        </ul>
        <button
          type="button"
          className="mp-btn mp-btn--primary"
          onClick={() => setCheckoutMode('cashback')}
        >
          Enable Agentic Growth
        </button>
      </div>
    </div>
  );
}
