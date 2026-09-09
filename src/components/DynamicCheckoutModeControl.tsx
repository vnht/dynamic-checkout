import { Link, useLocation } from 'react-router-dom';
import { CleverAiMark } from './CleverAiMark';
import { useDemo } from '../context/DemoContext';

export function DynamicCheckoutModeControl({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { checkoutMode, setCheckoutMode } = useDemo();
  const onMerchant = useLocation().pathname.startsWith('/merchant');
  const on = checkoutMode === 'cashback';

  return (
    <div className={`dc-mode${variant === 'dark' ? ' dc-mode--dark' : ''}${on ? ' is-on' : ''}`}>
      <h3 className="dc-mode__title">Catalyse the next purchase</h3>
      <p className="dc-mode__lede">
        <CleverAiMark size="sm" /> ranks checkout from the shopper profile. Agentic Growth
        incentivises the slice that would otherwise walk.
      </p>

      <div className="dc-pipe" aria-hidden="true">
        <div className="dc-pipe__step">
          <span>1</span>
          Profile
        </div>
        <i />
        <div className="dc-pipe__step dc-pipe__step--rank is-live">
          <span>2</span>
          Rank
        </div>
        <i />
        <div className={`dc-pipe__step dc-pipe__step--boost${on ? ' is-live' : ''}`}>
          <span>3</span>
          Incentivise
        </div>
        <i />
        <div className="dc-pipe__step">
          <span>4</span>
          Pay
        </div>
      </div>

      <div className="dc-why" aria-hidden="true">
        <p className="dc-why__kicker">Customer segmentation</p>
        <div className="dc-why__split">
          <b className="is-vip">22</b>
          <b className="is-regular">26</b>
          <b className="is-value">10</b>
          <b className={on ? 'is-live is-pulse' : 'is-risk'}>42</b>
        </div>
        <p className="dc-why__legend">
          <i className="is-vip" /> VIP
          <i className="is-regular" /> Returning
          <i className="is-value" /> Value-seeker
          <i className={on ? 'is-live' : 'is-risk'} />
          {on ? 'Churn, gained' : 'Churn, could lose'}
        </p>
        <p className={`dc-why__outcome${on ? ' is-on' : ''}`}>
          {on
            ? 'We choose to incentivise the 42 who would churn. We gain them back. The other 58 stay as they are.'
            : 'We could lose the 42 who churn. No incentive, so they walk. The other 58 stay as they are.'}
        </p>
      </div>

      <div className="dc-mode__cards" role="radiogroup" aria-label="Agentic Growth mode">
        <button
          type="button"
          role="radio"
          aria-checked={!on}
          className={`dc-mode__card${!on ? ' is-active' : ''}`}
          onClick={() => setCheckoutMode('standard')}
        >
          <strong>Without Agentic Growth</strong>
          <em>
            <CleverAiMark size="sm" /> ranks the rails. We lose the 42 who churn. No incentive.
          </em>
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={on}
          className={`dc-mode__card dc-mode__card--on${on ? ' is-active' : ''}`}
          onClick={() => setCheckoutMode('cashback')}
        >
          <strong>With Agentic Growth</strong>
          <em>
            <CleverAiMark size="sm" /> ranks, then incentivises the 42 we would have lost. We gain
            them back.
          </em>
        </button>
      </div>

      {!onMerchant && (
        <Link to="/merchant" className="dc-mode__setup">
          Set up Agentic Growth
        </Link>
      )}
    </div>
  );
}
