import { useDemo } from '../context/DemoContext';
import { METHOD_LABELS } from '../lib/constants';
import { cashbackActivatedLabel, cashbackAmount } from '../lib/cashback';
import { buildCustomerInsight } from '../lib/customerInsight';
import { moneyAudLabel } from '../lib/format';
import { getCashbackReason } from '../lib/profiles';

export function CustomerInsightPanel() {
  const { scenario, total, selectedMethod, overridden, paymentOptions, checkoutMode } = useDemo();
  const insight = buildCustomerInsight(scenario, total, selectedMethod, overridden);
  const recommended = paymentOptions.find((o) => o.rank === 1);
  const cashbackReason = checkoutMode === 'cashback' ? getCashbackReason(scenario) : null;
  const selectedOverride =
    overridden && selectedMethod !== insight.recommendedMethod
      ? METHOD_LABELS[selectedMethod]
      : null;

  const inputNodes = [
    {
      id: 'shopper',
      title: 'Shopper',
      lines: insight.recognitionSignals.slice(0, 3).map((s) => `${s.label}: ${s.value}`),
    },
    {
      id: 'cart',
      title: 'Cart / market',
      lines: insight.contextSignals.slice(0, 3).map((s) => `${s.label}: ${s.value}`),
    },
    {
      id: 'rails',
      title: 'Eligibility',
      lines: ['Card', 'Afterpay', 'PayTo', 'PayID'],
    },
  ];

  return (
    <section className="ci" aria-labelledby="customer-insight-heading">
      <header className="ci__bar">
        <div className="ci__bar-left">
          <span className="ci__tag">Demo lab</span>
          <h2 className="ci__title" id="customer-insight-heading">
            Customer Insight
          </h2>
          <span className="ci__meta">{insight.identityTitle}</span>
          <span className="ci__dot" aria-hidden="true" />
          <span className="ci__meta">
            Lead: {insight.recommendedLabel}
            {recommended?.reason ? ` · ${recommended.reason}` : ''}
          </span>
        </div>
        <p className="ci__bar-note">Illustrative ranking logic · not live decisioning</p>
      </header>

      <p className="ci__summary">{insight.identitySummary}</p>

      <div className="ci-flow" role="img" aria-label="Left to right decision flow">
        <div className="ci-flow__col ci-flow__col--inputs">
          <span className="ci-flow__label">1 · Inputs</span>
          <div className="ci-flow__stack">
            {inputNodes.map((node) => (
              <div key={node.id} className="ci-node">
                <strong>{node.title}</strong>
                <ul>
                  {node.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="ci-flow__arrow" aria-hidden="true">
          →
        </div>

        <div className="ci-flow__col ci-flow__col--process">
          <span className="ci-flow__label">2 · Process</span>
          <div className="ci-node ci-node--process">
            <strong>Ranking engine</strong>
            <ol>
              {insight.decisionSteps.map((step) => (
                <li key={step.id}>
                  <span>{step.title}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="ci-flow__arrow" aria-hidden="true">
          →
        </div>

        <div className="ci-flow__col ci-flow__col--scores">
          <span className="ci-flow__label">3 · Rank</span>
          <div className="ci-node ci-node--scores">
            <strong>Method scores</strong>
            <ul className="ci-scores">
              {insight.methodScores.map((method, index) => (
                <li
                  key={method.id}
                  className={
                    method.id === insight.recommendedMethod ? 'ci-scores__item--lead' : undefined
                  }
                >
                  <span>
                    {index + 1}. {method.label}
                  </span>
                  <span className="ci-scores__track" aria-hidden="true">
                    <span style={{ width: `${method.score}%` }} />
                  </span>
                  <span className="ci-scores__n">{method.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ci-flow__arrow" aria-hidden="true">
          →
        </div>

        <div className="ci-flow__col ci-flow__col--out">
          <span className="ci-flow__label">4 · Output</span>
          <div className="ci-node ci-node--out">
            <strong>Recommend {insight.recommendedLabel}</strong>
            <p>{insight.reasonHeadline}</p>
            <p className="ci-node__muted">{insight.outcomeNote}</p>
            {cashbackReason && (
              <p className="ci-node__cashback">
                <strong>{cashbackActivatedLabel(total)}</strong>
                <br />
                Pay on the recommended rail for instant cashback —{' '}
                {moneyAudLabel(cashbackAmount(total))} on a {moneyAudLabel(total)} cart.
                <br />
                {cashbackReason}
              </p>
            )}
            {selectedOverride && (
              <p className="ci-node__override">
                Selected now: {selectedOverride} (your choice)
              </p>
            )}
          </div>
          <div className="ci-node ci-node--guard">
            <strong>Guardrail</strong>
            <p>All methods stay visible and selectable</p>
          </div>
        </div>
      </div>

      <details className="ci-details">
        <summary>Why this ranking</summary>
        <p>{insight.reasonDetail}</p>
      </details>
    </section>
  );
}
