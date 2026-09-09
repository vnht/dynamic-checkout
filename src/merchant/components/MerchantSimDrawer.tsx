import { DynamicCheckoutModeControl } from '../../components/DynamicCheckoutModeControl';
import { useDemo } from '../../context/DemoContext';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function MerchantSimDrawer() {
  const { checkoutMode } = useDemo();
  const { simDrawerOpen, setSimDrawerOpen, resetDemo } = useAgenticGrowth();
  const withAgentic = checkoutMode === 'cashback';

  return (
    <div className="mp-sim-toolbar">
      {simDrawerOpen && (
        <div className="mp-sim-drawer" role="dialog" aria-label="Demo tools">
          <h2>Demo tools</h2>
          <DynamicCheckoutModeControl variant="dark" />
          {withAgentic && (
            <>
              <p>Start the merchant story from the Circuit &amp; Co. insight.</p>
              <div className="mp-actions">
                <button
                  type="button"
                  className="mp-btn mp-btn--primary"
                  onClick={() => {
                    resetDemo();
                    setSimDrawerOpen(false);
                  }}
                >
                  Start over from insight
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <button
        type="button"
        className="mp-sim-toggle"
        aria-expanded={simDrawerOpen}
        onClick={() => setSimDrawerOpen(!simDrawerOpen)}
      >
        Demo tools
      </button>
    </div>
  );
}
