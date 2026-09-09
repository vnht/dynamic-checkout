import { Link } from 'react-router-dom';
import { cashbackAmount, cashbackPercentLabel } from '../../lib/cashback';
import { money, moneyAudLabel } from '../../lib/format';
import { GrowthAgent } from '../components/GrowthAgent';
import { QualificationDrawer } from '../components/QualificationDrawer';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function AudiencePage() {
  const { fixture, setQualificationOpen } = useAgenticGrowth();
  const { insight } = fixture;
  const totalSize = fixture.segments.reduce((s, seg) => s + seg.size, 0);
  const totalQualified = fixture.segments.reduce((s, seg) => s + seg.qualified, 0);

  return (
    <div className="ga-page">
      <p className="mp-hint" style={{ marginBottom: '0.75rem' }}>
        <Link to="/merchant/agentic-growth">← Back to agent</Link>
      </p>

      <GrowthAgent
        turn={{
          activity: 'detecting',
          activityLabel: 'Qualifying',
          greeting: `I’m filtering who can get ${cashbackPercentLabel()} Instant cashback.`,
          body: [
            'Not every customer is eligible. Consent, settlement, and window rules have to clear first.',
            `Right now that’s about ${insight.eligibleSharePct}% of recent buyers. The rest keep standard checkout.`,
          ],
          primaryHint: 'Tap an example and I’ll walk the gates.',
        }}
        actions={
          <button
            type="button"
            className="mp-btn mp-btn--primary"
            onClick={() => setQualificationOpen(true)}
          >
            Show Mia · {moneyAudLabel(cashbackAmount(678))}
          </button>
        }
      >
        <div className="mp-elig-split">
          <div className="mp-elig-split__bar">
            <span style={{ width: `${insight.eligibleSharePct}%` }} />
          </div>
          <p className="mp-hint">
            <strong>{insight.eligibleSharePct}% eligible</strong> ·{' '}
            <strong>{insight.ineligibleSharePct}% not eligible</strong>
          </p>
        </div>

        <ul className="mp-elig-list" style={{ marginTop: '0.75rem' }}>
          {insight.eligibilityRules.map((rule) => (
            <li key={rule.id}>
              <span className={`mp-badge ${rule.required ? 'mp-badge--ok' : ''}`}>
                {rule.required ? 'Gate' : 'Note'}
              </span>{' '}
              {rule.label}
            </li>
          ))}
        </ul>

        <table className="mp-table" style={{ marginTop: '0.85rem' }}>
          <thead>
            <tr>
              <th>Segment</th>
              <th>Qualified</th>
              <th>Excluded</th>
            </tr>
          </thead>
          <tbody>
            {fixture.segments.map((seg) => (
              <tr key={seg.id}>
                <td>
                  {seg.name}
                  <div className="mp-hint">{seg.description}</div>
                </td>
                <td>{seg.qualified.toLocaleString('en-AU')}</td>
                <td>{(seg.size - seg.qualified).toLocaleString('en-AU')}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>{totalQualified.toLocaleString('en-AU')}</td>
              <td>{(totalSize - totalQualified).toLocaleString('en-AU')}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '0.85rem' }}>
          <strong>Not eligible · {fixture.ineligibleExample.name}</strong>
          <p className="mp-hint">
            {money(fixture.ineligibleExample.firstOrderAud)} order · no promotional consent
          </p>
          <ul>
            {fixture.ineligibleExample.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </GrowthAgent>

      <QualificationDrawer />
    </div>
  );
}
