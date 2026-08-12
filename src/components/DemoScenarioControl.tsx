import { useDemo } from '../context/DemoContext';
import { cashbackActivatedLabel } from '../lib/cashback';
import { SCENARIO_IDS, SHOPPER_PROFILES } from '../lib/profiles';
import type { CheckoutMode, ShopperScenario } from '../types';

const RECOGNISED = SCENARIO_IDS.filter((id) => SHOPPER_PROFILES[id].group === 'Recognised');
const GUESTS = SCENARIO_IDS.filter((id) => SHOPPER_PROFILES[id].group === 'Guest');

export function DemoScenarioControl() {
  const {
    scenario,
    setScenario,
    checkoutMode,
    setCheckoutMode,
    total,
    resetDemo,
    analytics,
    analyticsOpen,
    setAnalyticsOpen,
    demoPanelOpen,
    setDemoPanelOpen,
  } = useDemo();

  const active = SHOPPER_PROFILES[scenario];

  return (
    <div className="demo-toolbar">
      {demoPanelOpen && (
        <div className="demo-drawer demo-drawer--wide" role="dialog" aria-label="Demo developer controls">
          <h2>Demo controls</h2>
          <p>Not a consumer control. Switch shopper profiles to see ranking and recognition change.</p>

          <fieldset className="demo-fieldset">
            <legend>Checkout mode</legend>
            <label className="demo-radio">
              <input
                type="radio"
                name="checkoutMode"
                checked={checkoutMode === 'standard'}
                onChange={() => setCheckoutMode('standard')}
              />
              Standard
            </label>
            <label className="demo-radio">
              <input
                type="radio"
                name="checkoutMode"
                checked={checkoutMode === 'cashback'}
                onChange={() => setCheckoutMode('cashback' as CheckoutMode)}
              />
              Cashback-enabled
            </label>
            <p className="demo-hint">
              Cashback mode adds eligibility callouts on the recommended method and confirmation
              consent. Ranking and prices stay the same.
            </p>
          </fieldset>

          <label htmlFor="scenario">Customer profile ({SCENARIO_IDS.length})</label>
          <select
            className="select"
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value as ShopperScenario)}
          >
            <optgroup label="Recognised">
              {RECOGNISED.map((id) => (
                <option key={id} value={id}>
                  {SHOPPER_PROFILES[id].label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Guest">
              {GUESTS.map((id) => (
                <option key={id} value={id}>
                  {SHOPPER_PROFILES[id].label}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="demo-profile-chip" aria-live="polite">
            <strong>{active.identityTitle}</strong>
            <span>Lead: {active.ranking[0]?.id.toUpperCase()}</span>
            <span>{active.hasPayToAgreement ? 'PayTo mandate on file' : 'No PayTo mandate'}</span>
            {checkoutMode === 'cashback' && active.cashbackReason && (
              <span className="demo-profile-chip__cashback">
                <strong>{cashbackActivatedLabel(total)}</strong>
                <br />
                Why them: {active.cashbackReason}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn--dark btn--sm" onClick={resetDemo}>
              Reset demo
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setAnalyticsOpen(!analyticsOpen)}
            >
              {analyticsOpen ? 'Hide analytics' : 'Show analytics'}
            </button>
          </div>

          {analyticsOpen && (
            <div className="analytics-list" style={{ marginTop: '0.85rem' }} aria-live="polite">
              {analytics.length === 0 && <div>No events yet.</div>}
              {[...analytics].reverse().map((event) => (
                <div key={event.id}>
                  <strong>{event.name}</strong>
                  <div>
                    {new Date(event.timestamp).toLocaleTimeString('en-AU')} · {event.scenario}
                    {event.method ? ` · ${event.method}` : ''}
                    {event.status ? ` · ${event.status}` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        className="demo-toolbar__toggle"
        aria-expanded={demoPanelOpen}
        onClick={() => setDemoPanelOpen(!demoPanelOpen)}
      >
        Demo tools
      </button>
    </div>
  );
}
