import { Link } from 'react-router-dom';
import { CleverAiMark } from '../../components/CleverAiMark';
import { cashbackAmount, cashbackPercentLabel } from '../../lib/cashback';
import { money, moneyAudLabel } from '../../lib/format';
import { DecisionDrawer } from '../components/DecisionDrawer';
import { GrowthAgent } from '../components/GrowthAgent';
import { LiveApprovalModal } from '../components/LiveApprovalModal';
import { LiveRunSimulator } from '../components/LiveRunSimulator';
import { MessagePreview } from '../components/MessagePreview';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';
import { agentTurnFor } from '../lib/agentScript';

export function AgenticGrowthPage() {
  const {
    fixture,
    phase,
    canApproveCharter,
    canApproveLive,
    approveCharter,
    setLiveApprovalOpen,
    setMessagePreviewOpen,
    setSelectedDecisionId,
    setPhase,
    isOwner,
    resumeOffers,
    appendAudit,
  } = useAgenticGrowth();

  const startLiveSimulation = () => {
    setPhase('live_adaptive');
  };

  const turn = agentTurnFor(phase);
  const readinessBlocked = fixture.readiness.some((r) => r.status === 'fail');
  const { insight, charter } = fixture;
  const exampleReward = cashbackAmount(fixture.qualificationExample.firstOrderAud);

  const stage = (() => {
    switch (phase) {
      case 'opportunity_found':
        return (
          <>
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
            <div className="mp-elig-split">
              <div className="mp-elig-split__bar">
                <span style={{ width: `${insight.eligibleSharePct}%` }} />
              </div>
              <p className="mp-hint">
                I’m only proposing Instant cashback for{' '}
                <strong>{insight.eligibleSharePct}%</strong> of buyers.{' '}
                <strong>{insight.ineligibleSharePct}%</strong> stay on standard checkout.
              </p>
            </div>
          </>
        );
      case 'charter_review':
        return (
          <>
            <div className="ga-charter">
              <div>
                <span className="ga-charter__k">Program</span>
                <strong>
                  Instant cashback {cashbackPercentLabel()} · {charter.windowDays} days
                </strong>
              </div>
              <div>
                <span className="ga-charter__k">Example</span>
                <strong>
                  Mia {moneyAudLabel(678)} → {moneyAudLabel(exampleReward)}
                </strong>
              </div>
              <div>
                <span className="ga-charter__k">Budget</span>
                <strong>{money(charter.budgetAud)} · cap {money(charter.safetyLimits.maxRewardAud)}</strong>
              </div>
              <div>
                <span className="ga-charter__k">Split</span>
                <strong>
                  {charter.experimentSplit.control}/{charter.experimentSplit.fixed}/
                  {charter.experimentSplit.adaptive}
                </strong>
              </div>
            </div>
            <ul className="mp-elig-list">
              {insight.eligibilityRules
                .filter((r) => r.required)
                .map((rule) => (
                  <li key={rule.id}>
                    <span className="mp-badge mp-badge--ok">Gate</span> {rule.label}
                  </li>
                ))}
            </ul>
            <div className="ga-readiness">
              {fixture.readiness.map((item) => (
                <div key={item.id} className={`ga-readiness__row is-${item.status}`}>
                  <span>{item.label}</span>
                  <span className="mp-badge">{item.status}</span>
                </div>
              ))}
            </div>
          </>
        );
      case 'observation':
        return (
          <div className="ga-monitor">
            <button
              type="button"
              className="ga-monitor__card"
              onClick={() => setSelectedDecisionId(fixture.allocation.id)}
            >
              <span className="mp-label-tag">Actual</span>
              <strong>Fixed charter mix</strong>
              <span>
                {fixture.allocation.armShares.control}/
                {fixture.allocation.armShares.fixed}/
                {fixture.allocation.armShares.adaptive}
              </span>
            </button>
            <button
              type="button"
              className="ga-monitor__card ga-monitor__card--hyp"
              onClick={() => setSelectedDecisionId(fixture.hypotheticalAllocation.id)}
            >
              <span className="mp-label-tag">Hypothetical</span>
              <strong>What I’d shift next</strong>
              <span>
                {fixture.hypotheticalAllocation.armShares.control}/
                {fixture.hypotheticalAllocation.armShares.fixed}/
                {fixture.hypotheticalAllocation.armShares.adaptive}
              </span>
            </button>
          </div>
        );
      case 'evidence_gate_passed':
        return (
          <ul className="ga-gate">
            {fixture.evidenceGate.map((row) => (
              <li key={row.id} className={row.passed ? 'is-pass' : 'is-fail'}>
                <span>{row.criterion}</span>
                <strong>{row.passed ? 'Clear' : 'Blocked'}</strong>
              </li>
            ))}
          </ul>
        );
      case 'live_adaptive':
        return (
          <LiveRunSimulator
            onExplainDecision={() => setSelectedDecisionId(fixture.allocation.id)}
            onCompleteWindow={() => {
              appendAudit({
                actor: 'growth_agent',
                action: 'window_closed',
                detail: 'Live run simulation closed; reporting window one.',
              });
              setPhase('window_complete');
            }}
            onSafetyPause={() => {
              appendAudit({
                actor: 'growth_agent',
                action: 'safety_pause_simulated',
                detail: 'Agent tripped a safety pause during the live run simulation.',
              });
              setPhase('safety_pause');
            }}
          />
        );
      case 'safety_pause':
        return (
          <>
            {fixture.pauseReason && <p className="ga-alert">{fixture.pauseReason}</p>}
            <p className="mp-hint">
              I stopped new Instant cashback offers. Existing offers stay immutable. Resume when
              you’ve reviewed the limit.
            </p>
            <div className="ga-chips">
              <div className="ga-chip">
                <strong>{fixture.metrics.offersSent.toLocaleString('en-AU')}</strong>
                <span>Offers sent</span>
              </div>
              <div className="ga-chip">
                <strong>{money(fixture.ledger.available)}</strong>
                <span>Liability free</span>
              </div>
            </div>
          </>
        );
      case 'window_complete':
      case 'second_window_complete':
        return (
          <>
            {fixture.metrics.secondPurchaseLiftPp != null && (
              <p className="ga-lift">
                Lift vs control: <strong>+{fixture.metrics.secondPurchaseLiftPp}pp</strong>
              </p>
            )}
            <ul className="ga-learn">
              {fixture.learningNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        );
      default:
        return null;
    }
  })();

  const actions = (() => {
    switch (phase) {
      case 'opportunity_found':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              onClick={() => setPhase('charter_review')}
            >
              Yes, draft Instant cashback setup
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/audience">
              Who would qualify?
            </Link>
          </>
        );
      case 'charter_review':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              disabled={readinessBlocked || !canApproveCharter}
              onClick={approveCharter}
              title={
                readinessBlocked
                  ? 'I’m still waiting on readiness'
                  : !isOwner
                    ? 'I need Merchant Owner to approve'
                    : undefined
              }
            >
              Approve charter and start monitoring
            </button>
            <button type="button" className="mp-btn" onClick={() => setMessagePreviewOpen(true)}>
              Preview the offer I’d send
            </button>
            {readinessBlocked && (
              <p className="mp-hint">I’m blocked on budget authorisation.</p>
            )}
          </>
        );
      case 'observation':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              onClick={() => setPhase('evidence_gate_passed')}
            >
              Show me the evidence check
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/decisions">
              Decision log
            </Link>
          </>
        );
      case 'evidence_gate_passed':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              onClick={startLiveSimulation}
            >
              Simulate the live run
            </button>
            <button
              type="button"
              className="mp-btn"
              disabled={!fixture.evidencePassed || (!canApproveLive && !fixture.liveApproved)}
              onClick={() => setLiveApprovalOpen(true)}
              title={
                !isOwner ? 'Owner approval path (optional in this demo)' : undefined
              }
            >
              Owner approve first
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/safety">
              Safety limits
            </Link>
          </>
        );
      case 'live_adaptive':
        return (
          <>
            <Link className="mp-btn" to="/merchant/agentic-growth/safety">
              Safety
            </Link>
            <Link className="mp-btn" to="/merchant/agentic-growth/decisions">
              Decisions
            </Link>
          </>
        );
      case 'safety_pause':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              disabled={!isOwner}
              onClick={resumeOffers}
            >
              Resume offers
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/safety">
              Open incident
            </Link>
          </>
        );
      case 'window_complete':
        return (
          <>
            <button
              type="button"
              className="mp-btn mp-btn--primary"
              onClick={() => setPhase('second_window_complete')}
            >
              Show window two learning
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/audit">
              Audit trail
            </Link>
          </>
        );
      case 'second_window_complete':
        return (
          <>
            <button type="button" className="mp-btn mp-btn--primary" onClick={() => setPhase('opportunity_found')}>
              Start over with me
            </button>
            <Link className="mp-btn" to="/merchant/agentic-growth/audit">
              Audit trail
            </Link>
          </>
        );
      default:
        return null;
    }
  })();

  return (
    <div className="ga-page">
      <GrowthAgent turn={turn} actions={actions}>
        {stage}
      </GrowthAgent>

      <p className="ga-footnote">
        <CleverAiMark size="sm" /> · Circuit &amp; Co. Instant cashback · Not all customers eligible
      </p>

      <DecisionDrawer />
      <MessagePreview />
      <LiveApprovalModal />
    </div>
  );
}
