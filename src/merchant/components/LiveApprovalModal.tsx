import { CleverAiMark } from '../../components/CleverAiMark';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function LiveApprovalModal() {
  const { liveApprovalOpen, setLiveApprovalOpen, approveLive, fixture } = useAgenticGrowth();
  if (!liveApprovalOpen) return null;

  return (
    <div className="mp-modal" role="dialog" aria-label="Approve live adaptive">
      <div className="mp-modal__card">
        <p className="ga__activity ga__activity--evaluating" style={{ marginBottom: '0.5rem' }}>
          <span className="ga__activity-dot" aria-hidden="true" />
          <CleverAiMark size="sm" />
        </p>
        <h2>Ready for me to go live?</h2>
        <p>
          Evidence gate is {fixture.evidencePassed ? 'clear' : 'not clear'}. If you approve, I’ll
          start mutating Instant cashback allocation within charter floors and daily move limits.
          Ineligible shoppers stay on standard checkout.
        </p>
        <div className="mp-actions">
          <button
            type="button"
            className="mp-btn mp-btn--primary"
            disabled={!fixture.evidencePassed}
            onClick={approveLive}
          >
            Yes, run adaptive live
          </button>
          <button type="button" className="mp-btn" onClick={() => setLiveApprovalOpen(false)}>
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
