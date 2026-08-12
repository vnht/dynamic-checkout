import { Link } from 'react-router-dom';
import { DecisionDrawer } from '../components/DecisionDrawer';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function DecisionsPage() {
  const { fixture, setSelectedDecisionId } = useAgenticGrowth();
  const rows = [fixture.allocation, fixture.hypotheticalAllocation];

  return (
    <div>
      <p className="mp-hint">
        <Link to="/merchant/agentic-growth">← Agentic Growth</Link>
      </p>
      <h1 className="mp-page-title">Decisions</h1>
      <p className="mp-lead">
        Allocation decisions use the DEC-CIR-… explanation format. Observation decisions never
        mutate live offer counts.
      </p>

      <section className="mp-panel">
        <table className="mp-table">
          <thead>
            <tr>
              <th>Decision</th>
              <th>Date</th>
              <th>Mode</th>
              <th>Shares</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.date}</td>
                <td>
                  {d.mode}
                  {d.provisional ? (
                    <span className="mp-label-tag">Provisional</span>
                  ) : (
                    <span className="mp-label-tag">Live</span>
                  )}
                </td>
                <td>
                  {d.armShares.control}/{d.armShares.fixed}/{d.armShares.adaptive}
                </td>
                <td>
                  <button
                    type="button"
                    className="mp-btn mp-btn--sm"
                    onClick={() => setSelectedDecisionId(d.id)}
                  >
                    Explain
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <DecisionDrawer />
    </div>
  );
}
