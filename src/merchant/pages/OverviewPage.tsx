import { Link } from 'react-router-dom';
import { GrowthAgent } from '../components/GrowthAgent';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';
import { agentTurnFor } from '../lib/agentScript';

export function OverviewPage() {
  const { fixture, handoff, setPhase, emitSimEvent } = useAgenticGrowth();
  const turn = agentTurnFor(fixture.phase);
  const { insight } = fixture;
  const isFirstStep = fixture.phase === 'opportunity_found';

  return (
    <div className="ga-page">
      <GrowthAgent
        turn={turn}
        actions={
          <>
            <Link className="mp-btn mp-btn--primary" to="/merchant/agentic-growth">
              Continue with me
            </Link>
            <button
              type="button"
              className="mp-btn"
              onClick={() => {
                setPhase('opportunity_found');
                emitSimEvent('open_insight', 'opportunity_found');
              }}
            >
              Restart from detection
            </button>
          </>
        }
      >
        {isFirstStep && (
          <div className="ga-chips">
            {insight.stats.map((stat) => (
              <div
                key={stat.id}
                className={stat.id === 'risk' ? 'ga-chip ga-chip--hero' : 'ga-chip'}
              >
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
                <em>{stat.detail}</em>
              </div>
            ))}
          </div>
        )}

        {handoff && (
          <p className="mp-hint">
            I also picked up a consumer consent handoff for order{' '}
            <strong>{String(handoff.orderNumber)}</strong> ({String(handoff.profileId)}).
          </p>
        )}
      </GrowthAgent>
    </div>
  );
}
