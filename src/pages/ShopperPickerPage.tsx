import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { moneyLabel } from '../lib/format';
import {
  AU_SHOPPERS,
  findShopperCard,
  ID_SHOPPERS,
  pickRandomPriorityShopper,
  US_SHOPPERS,
  type ShopperCardModel,
} from '../lib/shopperCard';
import type { ShopperScenario } from '../types';

const MARKET_FLAG: Record<string, { src: string; alt: string }> = {
  'United States': { src: '/flags/us.svg', alt: 'United States' },
  Australia: { src: '/flags/au.svg', alt: 'Australia' },
  Indonesia: { src: '/flags/id.svg', alt: 'Indonesia' },
};

const MARKET_GROUPS = [
  { title: 'United States', flag: '/flags/us.svg', shoppers: US_SHOPPERS },
  { title: 'Australia', flag: '/flags/au.svg', shoppers: AU_SHOPPERS },
  { title: 'Indonesia', flag: '/flags/id.svg', shoppers: ID_SHOPPERS },
];

function MarketFlag({ market }: { market: string }) {
  const flag = MARKET_FLAG[market] ?? MARKET_FLAG.Australia;
  return <img className="shopper-card__flag" src={flag.src} alt={flag.alt} />;
}

function ShopperAttributes({
  shopper,
  checkoutMode,
}: {
  shopper: ShopperCardModel;
  checkoutMode: 'standard' | 'cashback';
}) {
  return (
    <dl className="shopper-card__attrs">
      <div>
        <dt>Market</dt>
        <dd>{shopper.market}</dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>{shopper.location}</dd>
      </div>
      <div>
        <dt>Bank agreement</dt>
        <dd>{shopper.payTo}</dd>
      </div>
      {checkoutMode === 'cashback' && (
        <div>
          <dt>Cashback</dt>
          <dd>{shopper.cashback > 0 ? moneyLabel(shopper.cashback, shopper.currency) : 'None'}</dd>
        </div>
      )}
      {shopper.attributes.map((attr) => (
        <div key={attr.id}>
          <dt>{attr.label}</dt>
          <dd>{attr.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ShopperPickerPage() {
  const { setScenario, checkoutMode } = useDemo();
  const navigate = useNavigate();
  const [featuredId, setFeaturedId] = useState<ShopperScenario>(
    () => pickRandomPriorityShopper().id,
  );
  const [switchOpen, setSwitchOpen] = useState(false);
  const switchRef = useRef<HTMLDivElement>(null);
  const shopper = findShopperCard(featuredId);

  useEffect(() => {
    if (!switchOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!switchRef.current?.contains(event.target as Node)) setSwitchOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSwitchOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [switchOpen]);

  const showShopper = (id: ShopperScenario) => {
    setFeaturedId(id);
    setSwitchOpen(false);
  };

  const continueAs = () => {
    setScenario(shopper.id);
    navigate('/checkout');
  };

  return (
    <div className="picker-page">
      <div className="picker-page__stage">
        <header className="picker-hero">
          <p className="picker-hero__kicker">Dynamic Checkout demo</p>
          <h1 className="picker-hero__title">Meet this customer</h1>
          <p className="picker-hero__lede">
            A shopper profile is ready. Attributes drive recognition on the next screens.
          </p>
        </header>

        <article className="shopper-feature">
          <div className="shopper-feature__bar">
            <span className={`shopper-card__group shopper-card__group--${shopper.group.toLowerCase()}`}>
              {shopper.group}
            </span>
            <div className="shopper-switch" ref={switchRef}>
              <button
                type="button"
                className="shopper-switch__button"
                aria-expanded={switchOpen}
                aria-haspopup="listbox"
                onClick={() => setSwitchOpen((open) => !open)}
              >
                Switch shopper
              </button>
              {switchOpen && (
                <div className="shopper-switch__menu" role="listbox" aria-label="Choose a shopper">
                  {MARKET_GROUPS.map((group) => (
                    <section key={group.title}>
                      <h3 className="shopper-switch__heading">
                        <img className="picker-section-flag" src={group.flag} alt="" />
                        {group.title}
                      </h3>
                      {group.shoppers.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          role="option"
                          aria-selected={option.id === shopper.id}
                          className={
                            option.id === shopper.id
                              ? 'shopper-switch__option shopper-switch__option--current'
                              : 'shopper-switch__option'
                          }
                          onClick={() => showShopper(option.id)}
                        >
                          <img className="shopper-switch__photo" src={option.photo} alt="" />
                          <span>
                            <strong>{option.name}</strong>
                            <em>{option.story}</em>
                          </span>
                        </button>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </div>
          </div>

          <img className="shopper-feature__photo" src={shopper.photo} alt="" />
          <h2 className="shopper-card__name shopper-feature__name">
            <MarketFlag market={shopper.market} />
            <span>{shopper.name}</span>
          </h2>
          <p className="shopper-card__story">{shopper.story}</p>
          <p className="shopper-card__identity">{shopper.identityTitle}</p>
          <ShopperAttributes shopper={shopper} checkoutMode={checkoutMode} />
          <button type="button" className="btn btn--primary btn--full shopper-feature__cta" onClick={continueAs}>
            Continue as {shopper.name}
          </button>
        </article>
      </div>
    </div>
  );
}
