import { useDemo } from '../context/DemoContext';
import { money, moneyLabel } from '../lib/format';
import { getProfile } from '../lib/profiles';

export function CashbackBalanceCard() {
  const {
    scenario,
    cashbackBalance,
    applyCashback,
    setApplyCashback,
    cashbackApplied,
    amountDue,
    currency,
  } = useDemo();
  const profile = getProfile(scenario);

  return (
    <aside className="card-surface cashback-balance" aria-label="Cashback balance">
      <img
        src="/brand/hello-clever-logo-dark.svg"
        alt="Hello Clever"
        className="cashback-balance__logo"
      />
      <h2 className="cashback-balance__title">Ready to use now</h2>
      <p className="cashback-balance__available">{moneyLabel(cashbackBalance, currency)}</p>
      <p className="cashback-balance__who">
        Instant cashback for <strong>{profile.shortName}</strong> is already in your balance. Apply it
        on this payment.
      </p>

      <label className="checkbox-row cashback-balance__use">
        <input
          type="checkbox"
          checked={applyCashback}
          onChange={(e) => setApplyCashback(e.target.checked)}
        />
        <span>Use cashback to pay</span>
      </label>

      {applyCashback && cashbackApplied > 0 && (
        <dl className="cashback-balance__split">
          <div>
            <dt>Applied now</dt>
            <dd>−{money(cashbackApplied, currency)}</dd>
          </div>
          <div>
            <dt>Still to pay</dt>
            <dd>{money(amountDue, currency)}</dd>
          </div>
        </dl>
      )}
    </aside>
  );
}