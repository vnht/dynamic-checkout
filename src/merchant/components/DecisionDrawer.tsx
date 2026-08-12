import { money } from '../../lib/format';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function DecisionDrawer() {
  const { selectedDecisionId, setSelectedDecisionId, fixture, sim } = useAgenticGrowth();
  if (!selectedDecisionId) return null;

  const decision =
    fixture.allocation.id === selectedDecisionId
      ? fixture.allocation
      : fixture.hypotheticalAllocation.id === selectedDecisionId
        ? fixture.hypotheticalAllocation
        : fixture.allocation;

  return (
    <>
      <button
        type="button"
        className="mp-drawer-backdrop"
        aria-label="Close decision drawer"
        onClick={() => setSelectedDecisionId(null)}
      />
      <aside className="mp-drawer" role="dialog" aria-label="Allocation decision">
        <h2>{decision.id}</h2>
        <p className="mp-hint">
          Date {decision.date} · Mode {decision.mode}
          {decision.provisional ? (
            <span className="mp-label-tag">Provisional</span>
          ) : (
            <span className="mp-label-tag">Live</span>
          )}
        </p>
        <h3>Arm shares</h3>
        <ul>
          <li>Control: {decision.armShares.control}%</li>
          <li>Fixed: {decision.armShares.fixed}%</li>
          <li>Adaptive: {decision.armShares.adaptive}%</li>
        </ul>
        <h3>Explanation</h3>
        {sim.explanationUnavailable ? (
          <p>Explanation unavailable for this decision.</p>
        ) : (
          <ol>
            {decision.rationale.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        )}
        <h3>Liability snapshot</h3>
        <p className="mp-hint">
          Authorised {money(fixture.ledger.authorised)} · Reserved {money(fixture.ledger.reserved)} ·
          Consumed {money(fixture.ledger.netConsumed)} · Available {money(fixture.ledger.available)}
        </p>
        <div className="mp-actions">
          <button type="button" className="mp-btn" onClick={() => setSelectedDecisionId(null)}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
