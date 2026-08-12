import { Link } from 'react-router-dom';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';
import { agentTurnFor } from '../lib/agentScript';

export function OverviewPage() {
  const { fixture, handoff, setPhase, emitSimEvent } = useAgenticGrowth();
  const turn = agentTurnFor(fixture.phase);

  return (
    <div className="ga-page">
      <div className="ga">
        <header className="ga__header">
          <div className="ga__avatar" aria-hidden="true">
            <span className="ga__pulse" />
            <span className="ga__mark">A</span>
          </div>
          <div>
            <p className="ga__name">Clever Growth Agent</p>
            <p className={`ga__activity ga__activity--${turn.activity}`}>
              <span className="ga__activity-dot" aria-hidden="true" />
              {turn.activityLabel} · Circuit &amp; Co.
            </p>
          </div>
        </header>

        <div className="ga__thread">
          <div className="ga__bubble">
            <p className="ga__greeting">{turn.greeting}</p>
            <p className="ga__line">
              I guide Instant cashback end-to-end: detect churn, recommend a targeted 5% program,
              monitor the run, and report lift — without spraying rewards to everyone.
            </p>
            <p className="ga__hint">{turn.primaryHint}</p>
          </div>

          <div className="ga__actions">
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
          </div>

          {handoff && (
            <div className="ga__stage">
              <p className="mp-hint">
                I also picked up a consumer consent handoff for order{' '}
                <strong>{String(handoff.orderNumber)}</strong> ({String(handoff.profileId)}).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
