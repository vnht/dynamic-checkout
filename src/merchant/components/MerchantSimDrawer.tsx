import { useAgenticGrowth } from '../context/AgenticGrowthContext';
import type { DemoPhase, MerchantRole, SimFlags } from '../types';

const SIM_TOGGLES: { key: keyof SimFlags; label: string }[] = [
  { key: 'evidenceFail', label: 'Evidence gate fail' },
  { key: 'budgetExhausted', label: 'Budget exhaustion' },
  { key: 'missingConsent', label: 'Missing consent' },
  { key: 'deliveryFailure', label: 'Delivery failure' },
  { key: 'ledgerBreach', label: 'Ledger breach' },
  { key: 'explanationUnavailable', label: 'Explanation unavailable' },
  { key: 'lateReversal', label: 'Late reversal' },
];

export function MerchantSimDrawer() {
  const {
    simDrawerOpen,
    setSimDrawerOpen,
    phase,
    setPhase,
    role,
    setRole,
    sim,
    setSimFlag,
    phases,
    replayTodayDecision,
    resetDemo,
    emitSimEvent,
  } = useAgenticGrowth();

  return (
    <div className="mp-sim-toolbar">
      {simDrawerOpen && (
        <div className="mp-sim-drawer" role="dialog" aria-label="Merchant simulation controls">
          <h2>Merchant sim drawer</h2>
          <p>Developer-only. Replaces the whole fixture set by phase.</p>

          <label htmlFor="mp-phase">Demo phase</label>
          <select
            id="mp-phase"
            value={phase}
            onChange={(e) => {
              setPhase(e.target.value as DemoPhase);
              emitSimEvent('phase_change', e.target.value);
            }}
          >
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <label htmlFor="mp-role">Role</label>
          <select
            id="mp-role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value as MerchantRole);
              emitSimEvent('role_change', e.target.value);
            }}
          >
            <option value="growth_manager">Growth Manager</option>
            <option value="merchant_owner">Merchant Owner</option>
          </select>

          <div style={{ marginTop: '0.75rem' }}>
            {SIM_TOGGLES.map((t) => (
              <label key={t.key} className="mp-sim-check">
                <input
                  type="checkbox"
                  checked={sim[t.key]}
                  onChange={(e) => {
                    setSimFlag(t.key, e.target.checked);
                    emitSimEvent(t.key, String(e.target.checked));
                  }}
                />
                {t.label}
              </label>
            ))}
          </div>

          <div className="mp-actions">
            <button
              type="button"
              className="mp-btn mp-btn--sm"
              onClick={() => {
                setPhase('live_adaptive');
                emitSimEvent('live_run_start', 'live_adaptive');
              }}
            >
              Simulate live run
            </button>
            <button
              type="button"
              className="mp-btn mp-btn--sm"
              onClick={() => {
                replayTodayDecision();
              }}
            >
              Replay today&apos;s decision
            </button>
            <button
              type="button"
              className="mp-btn mp-btn--sm"
              onClick={() => {
                resetDemo();
              }}
            >
              Reset / complete
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        className="mp-sim-toggle"
        aria-expanded={simDrawerOpen}
        onClick={() => setSimDrawerOpen(!simDrawerOpen)}
      >
        Sim controls
      </button>
    </div>
  );
}
