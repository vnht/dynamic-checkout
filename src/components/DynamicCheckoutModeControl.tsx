import { Link, useLocation } from 'react-router-dom';
import { CleverAiMark } from './CleverAiMark';
import { PaymentMethodLogo } from './PaymentMethodLogo';
import { useDemo } from '../context/DemoContext';
import { METHOD_LABELS } from '../lib/constants';
import type { CheckoutMode, PaymentMethod } from '../types';

const CATALOG_PREVIEW: PaymentMethod[] = [
  'card',
  'afterpay',
  'payid',
  'paypal',
  'applepay',
  'payto',
];

const MODES: {
  id: CheckoutMode;
  title: string;
  copy: string;
}[] = [
  {
    id: 'normal',
    title: 'Normal Checkout',
    copy: 'Everyone sees the same payment methods, in the same order.',
  },
  {
    id: 'dynamic',
    title: 'Dynamic Checkout',
    copy: 'ranks the rails so each shopper sees the method that fits them first.',
  },
  {
    id: 'cashback',
    title: 'Dynamic Checkout with Agentic Growth',
    copy: 'ranks the rails, then incentivises the 42 so we gain them back.',
  },
];

export function DynamicCheckoutModeControl({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { checkoutMode, setCheckoutMode } = useDemo();
  const onMerchant = useLocation().pathname.startsWith('/merchant');
  const ranked = checkoutMode === 'dynamic' || checkoutMode === 'cashback';
  const on = checkoutMode === 'cashback';

  return (
    <div className={`dc-mode${variant === 'dark' ? ' dc-mode--dark' : ''}${on ? ' is-on' : ''}`}>
      <h2 className="dc-mode__title">How checkout appears</h2>
      <p className="dc-mode__lede">
        {ranked
          ? on
            ? 'Dynamic Checkout ranks from the shopper profile. Agentic Growth then incentivises the slice that needs a reason to stay.'
            : 'Dynamic Checkout ranks rails from the shopper profile. Every shopper still sees every method. The one that fits them best simply leads.'
          : 'One catalog for everyone. Same methods, same order, no shopper profile in the mix.'}
      </p>

      <div className={`dc-mode__viz${ranked ? '' : ' is-plain'}`}>
        <div className="dc-mode__ranked" aria-hidden={!ranked}>
          <div className="dc-pipe">
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

          <div className="dc-why">
            <p className="dc-why__kicker">Of every 100 customers</p>
            <div className="dc-why__split">
              <b className="is-vip">22</b>
              <b className="is-regular">26</b>
              <b className="is-value">10</b>
              <b className={on ? 'is-live is-pulse' : 'is-risk'}>42</b>
            </div>
            <p className="dc-why__legend">
              <span>
                <i className="is-vip" />
                VIP
              </span>
              <span>
                <i className="is-regular" />
                Returning
              </span>
              <span>
                <i className="is-value" />
                Value-seeker
              </span>
              <span>
                <i className={on ? 'is-live' : 'is-risk'} />
                {on ? 'Churn risk, gained' : 'Churn risk, ranked'}
              </span>
            </p>
            <p className={`dc-why__outcome${on ? ' is-on' : ' is-ranked'}`}>
              {on
                ? 'We rank the rails, then incentivise the 42. We gain them back. The other 58 stay as they are.'
                : 'We rank the rails so each shopper sees the method that fits them first. The 58 convert on preference. The 42 still get a ranked checkout.'}
            </p>
          </div>
        </div>

        {!ranked && (
          <figure className="dc-mode__plain">
            <ul className="dc-mode__catalog">
              {CATALOG_PREVIEW.map((method) => (
                <li key={method}>
                  <PaymentMethodLogo method={method} />
                  <span>{METHOD_LABELS[method]}</span>
                </li>
              ))}
            </ul>
            <figcaption>Same crowded list for every shopper. No ranking.</figcaption>
          </figure>
        )}
      </div>

      <div className="dc-mode__cards" role="radiogroup" aria-label="Demo mode">
        {MODES.map((mode) => {
          const active = checkoutMode === mode.id;
          const cleverCopy = mode.id !== 'normal';
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={active}
              className={`dc-mode__card${mode.id === 'cashback' ? ' dc-mode__card--on' : ''}${
                active ? ' is-active' : ''
              }`}
              onClick={() => setCheckoutMode(mode.id)}
            >
              <strong>
                {mode.title}
                {mode.id === 'dynamic' && <span className="dc-mode__default">Default</span>}
              </strong>
              <em>
                {cleverCopy && <CleverAiMark size="sm" />}
                {cleverCopy ? ` ${mode.copy}` : mode.copy}
              </em>
            </button>
          );
        })}
      </div>

      {!onMerchant && (
        <Link to="/merchant" className="dc-mode__setup">
          Merchant View
        </Link>
      )}
    </div>
  );
}
