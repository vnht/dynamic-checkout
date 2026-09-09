import { Link } from 'react-router-dom';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function SafetyPage() {
  const {
    fixture,
    canStopOffers,
    stopNewOffers,
    resumeOffers,
    isOwner,
    phase,
  } = useAgenticGrowth();

  return (
    <div>
      <p className="mp-hint">
        <Link to="/merchant/agentic-growth">← Agentic Growth</Link>
      </p>
      <h1 className="mp-page-title">Safety &amp; stops</h1>
      <p className="mp-lead">
        Safety limits from the locked charter. Existing offers stay immutable after send when new
        offers are stopped.
      </p>

      {fixture.pauseReason && (
        <section className="mp-panel" style={{ marginBottom: '1rem' }}>
          <h2>Pause incident</h2>
          <p className={`mp-badge ${phase === 'safety_pause' ? 'mp-badge--danger' : 'mp-badge--warn'}`}>
            {fixture.pauseReason}
          </p>
        </section>
      )}

      <section className="mp-panel">
        <h2>Safety metrics</h2>
        <table className="mp-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Limit</th>
              <th>Current</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fixture.safety.map((row) => (
              <tr key={row.id}>
                <td>{row.label}</td>
                <td>{row.limit}</td>
                <td>{row.current}</td>
                <td>
                  <span
                    className={`mp-badge ${
                      row.status === 'ok'
                        ? 'mp-badge--ok'
                        : row.status === 'warn'
                          ? 'mp-badge--warn'
                          : 'mp-badge--danger'
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mp-actions">
          <button
            type="button"
            className="mp-btn mp-btn--danger"
            disabled={!canStopOffers}
            title={!isOwner ? 'Only Merchant Owner can stop new offers' : undefined}
            onClick={() => stopNewOffers('merchant')}
          >
            Merchant stop new offers
          </button>
          <button
            type="button"
            className="mp-btn mp-btn--danger"
            disabled={fixture.helloCleverStop}
            onClick={() => stopNewOffers('hello_clever')}
          >
            Hello Clever stop
          </button>
          {(fixture.merchantStop || fixture.helloCleverStop || phase === 'safety_pause') && (
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              disabled={!isOwner}
              onClick={resumeOffers}
            >
              Resume offers
            </button>
          )}
        </div>
        <p className="mp-hint">
          Merchant stop: {fixture.merchantStop ? 'active' : 'off'} · Hello Clever stop:{' '}
          {fixture.helloCleverStop ? 'active' : 'off'}
        </p>
      </section>
    </div>
  );
}
