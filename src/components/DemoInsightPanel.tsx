import { useDemo } from '../context/DemoContext';
import { METHOD_LABELS } from '../lib/constants';
import { SCENARIO_LABELS } from '../lib/profiles';

export function DemoInsightPanel() {
  const { insight } = useDemo();
  if (!insight) return null;

  return (
    <details className="insight card-surface">
      <summary>Demo insight</summary>
      <div className="insight__body">
        <p>
          <strong>Scenario:</strong> {SCENARIO_LABELS[insight.scenario]}
        </p>
        <p>
          <strong>Recommended method:</strong> {METHOD_LABELS[insight.recommendedMethod]}
          {insight.recommendationReason ? ` · ${insight.recommendationReason}` : ''}
        </p>
        <p>
          <strong>Final method selected:</strong> {METHOD_LABELS[insight.finalMethod]}
        </p>
        <p>
          <strong>Recommendation overridden:</strong> {insight.overridden ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Simulated consumer outcome:</strong> {insight.consumerOutcome}
        </p>
        <p>
          <strong>Processing route:</strong> {insight.processingRoute}
        </p>
        <p>
          <strong>Settlement expectation:</strong> {insight.settlementExpectation}
        </p>
        <p>
          <strong>Reconciliation status:</strong> {insight.reconciliationStatus}
        </p>
        <p className="disclaimer">
          Illustrative demo data. No real payment was processed.
        </p>
      </div>
    </details>
  );
}
