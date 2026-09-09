import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CleverAiMark } from './CleverAiMark';
import { useDemo } from '../context/DemoContext';
import { METHOD_LABELS } from '../lib/constants';
import { cashbackActivatedLabel, cashbackAmount } from '../lib/cashback';
import { buildCustomerInsight } from '../lib/customerInsight';
import { moneyLabel } from '../lib/format';
import { getCashbackReason } from '../lib/profiles';

const THINKING = [
  'Reading shopper signals…',
  'Evaluating rails…',
  'Scoring methods…',
  'Recommendation ready',
];

export function CustomerInsightPanel() {
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const panelRef = useRef<HTMLElement>(null);
  const { scenario, total, selectedMethod, overridden, paymentOptions, checkoutMode, currency } =
    useDemo();
  const insight = buildCustomerInsight(scenario, total, selectedMethod, overridden);
  const recommended = paymentOptions.find((o) => o.rank === 1);
  const cashbackReason = checkoutMode === 'cashback' ? getCashbackReason(scenario) : null;
  const selectedOverride =
    overridden && selectedMethod !== insight.recommendedMethod
      ? METHOD_LABELS[selectedMethod]
      : null;

  useLayoutEffect(() => {
    if (!visible || !panelRef.current) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    panelRef.current.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [visible, scenario]);

  useEffect(() => {
    if (!visible) {
      setPlaying(false);
      setPhase(0);
      return;
    }
    setPlaying(false);
    setPhase(0);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const playTimer = window.setTimeout(() => setPlaying(true), reduceMotion ? 0 : 520);
    return () => clearTimeout(playTimer);
  }, [visible, scenario]);

  useEffect(() => {
    if (!playing) return;
    const timers = THINKING.map((_, index) =>
      window.setTimeout(() => setPhase(index), index * 700),
    );
    return () => timers.forEach(clearTimeout);
  }, [playing]);

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
      lines:
        currency === 'USD'
          ? ['Card · AFT supported', 'Klarna', 'Pay by bank', 'PayPal']
          : currency === 'IDR'
            ? ['Card · AFT supported', 'QRIS', 'DANA']
            : ['Card · AFT supported', 'Afterpay', 'PayTo', 'PayID'],
    },
  ];

  return (
    <div className="ci-lab">
      <hr className="ci-lab__rule" />
      <div className="ci-lab__controls">
        <div className="ci-lab__toggle">
          <span className="ci-lab__toggle-label" id="ci-lab-toggle-label">
            <CleverAiMark size="sm" />
            Customer Insight
          </span>
          <button
            type="button"
            className="ci-lab__switch"
            role="switch"
            aria-checked={visible}
            aria-labelledby="ci-lab-toggle-label"
            onClick={() => setVisible((open) => !open)}
          >
            <span className="ci-lab__switch-thumb" />
          </button>
        </div>
        <p className="ci-lab__disclaimer">
          Customer Insight is not part of the checkout layout.
          <br />
          It is shown here for the demo only.
        </p>
      </div>
      {visible && (
    <section
      ref={panelRef}
      className={`ci ${playing ? 'ci--play' : ''} ${phase < 3 ? 'ci--thinking' : 'ci--ready'}`}
      aria-labelledby="customer-insight-heading"
    >
      <header className="ci__bar">
        <span className="ci__scan" aria-hidden="true" />
        <div className="ci__bar-left">
          <span className="ci__tag">
            <span className="ci__live-orb" aria-hidden="true" />
            Demo lab
          </span>
          <h2 className="ci__title" id="customer-insight-heading">
            <CleverAiMark size="sm" />
            Customer Insight
          </h2>
          <span className="ci__meta">{insight.identityTitle}</span>
          <span className="ci__dot" aria-hidden="true" />
          <span className="ci__meta">
            Lead: {insight.recommendedLabel}
            {recommended?.reason ? ` · ${recommended.reason}` : ''}
          </span>
          {checkoutMode === 'cashback' && (
            <>
              <span className="ci__dot" aria-hidden="true" />
              <span className={`ci__case-pill ci__case-pill--${insight.cashbackCase.motive}`}>
                {insight.cashbackMotiveLabel}
              </span>
            </>
          )}
        </div>
        <p className="ci__bar-note" aria-live="polite">
          {phase < 3 ? THINKING[phase] : 'Illustrative ranking logic · not live decisioning'}
        </p>
      </header>

      <p className="ci__summary">{insight.identitySummary}</p>

      {checkoutMode === 'cashback' && (
      <aside
        className={`ci-cashback ci-cashback--${insight.cashbackCase.motive}`}
        aria-labelledby="ci-cashback-heading"
      >
        <div className="ci-cashback__top">
          <span className="ci-cashback__kicker">Why give cashback</span>
          <span className="ci-cashback__stakes">{insight.cashbackCase.stakesLabel}</span>
        </div>
        <h3 className="ci-cashback__headline" id="ci-cashback-heading">
          {insight.cashbackCase.headline}
        </h3>
        <p className="ci-cashback__detail">{insight.cashbackCase.detail}</p>
        <ul className="ci-cashback__signals">
          {insight.cashbackCase.signals.map((signal) => (
            <li key={signal.label}>
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </li>
          ))}
        </ul>
      </aside>
      )}

      <div className="ci-flow" role="img" aria-label="Left to right decision flow">
        <div className="ci-flow__col ci-flow__col--inputs">
          <span className="ci-flow__label">1 · Inputs</span>
          <div className="ci-flow__stack">
            {inputNodes.map((node) => (
              <div key={node.id} className={`ci-node ci-node--${node.id}`}>
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
                Pay on the recommended rail and {moneyLabel(cashbackAmount(total), currency)}{' '}
                credits instantly on this {moneyLabel(total, currency)} cart, not a later offer.
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
      )}
    </div>
  );
}
