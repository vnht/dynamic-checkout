import { cashbackAmount, cashbackPercentLabel } from '../../lib/cashback';
import { money, moneyAudLabel } from '../../lib/format';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function QualificationDrawer() {
  const { qualificationOpen, setQualificationOpen, fixture } = useAgenticGrowth();
  if (!qualificationOpen) return null;
  const ex = fixture.qualificationExample;
  const reward = cashbackAmount(ex.firstOrderAud);

  return (
    <>
      <button
        type="button"
        className="mp-drawer-backdrop"
        aria-label="Close qualification drawer"
        onClick={() => setQualificationOpen(false)}
      />
      <aside className="mp-drawer" role="dialog" aria-label="Qualification example">
        <h2>Eligible · {ex.name}</h2>
        <p>
          First order {money(ex.firstOrderAud)} · {ex.daysSincePurchase} days since purchase
        </p>
        <p className="mp-recommend" style={{ marginTop: '0.75rem' }}>
          <strong>Instant cashback {cashbackPercentLabel()}:</strong> {moneyAudLabel(reward)}
        </p>
        <p>
          Email consent: {ex.emailConsent ? 'Yes' : 'No'} · Payment settled:{' '}
          {ex.paymentSettled ? 'Yes' : 'No'}
        </p>
        <p>
          Result:{' '}
          <span className={`mp-badge ${ex.qualified ? 'mp-badge--ok' : 'mp-badge--danger'}`}>
            {ex.qualified ? 'Qualified' : 'Not qualified'}
          </span>
        </p>
        <h3>Reasons</h3>
        <ul>
          {ex.reasons.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <div className="mp-actions">
          <button type="button" className="mp-btn" onClick={() => setQualificationOpen(false)}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
