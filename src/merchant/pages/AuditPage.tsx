import { Link } from 'react-router-dom';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function AuditPage() {
  const { fixture } = useAgenticGrowth();
  const rows = [...fixture.audit].reverse();

  return (
    <div>
      <p className="mp-hint">
        <Link to="/merchant/agentic-growth">← Agentic Growth</Link>
      </p>
      <h1 className="mp-page-title">Audit log</h1>
      <p className="mp-lead">
        Append-only local list of program events for this demo workspace.
      </p>

      <section className="mp-panel">
        <table className="mp-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.timestamp).toLocaleString('en-AU')}</td>
                <td>{row.actor}</td>
                <td>{row.action}</td>
                <td>{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
