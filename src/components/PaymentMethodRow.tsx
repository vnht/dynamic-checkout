import type { ReactNode } from 'react';
import type { PaymentOption } from '../types';
import { PaymentMethodLogo } from './PaymentMethodLogo';
import { RecommendationBadge } from './RecommendationBadge';

interface Props {
  option: PaymentOption;
  expanded: boolean;
  onSelect: () => void;
  children?: ReactNode;
}

export function PaymentMethodRow({ option, expanded, onSelect, children }: Props) {
  const panelId = `payment-panel-${option.id}`;
  const labelId = `payment-label-${option.id}`;

  return (
    <div className={`payment-row ${option.selected ? 'payment-row--selected' : ''}`}>
      <div
        className="payment-row__header"
        role="radio"
        aria-checked={option.selected}
        aria-labelledby={labelId}
        aria-controls={panelId}
        aria-expanded={expanded}
        tabIndex={option.selected ? 0 : -1}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <PaymentMethodLogo method={option.id} />
        <span>
          <span className="payment-row__title" id={labelId}>
            {option.label}
            {option.badge === 'recommended' && option.reason ? (
              <RecommendationBadge kind="recommended" text={option.reason} />
            ) : (
              <RecommendationBadge kind={option.badge} />
            )}
            {option.cashbackLabel && (
              <span className="badge badge--cashback">{option.cashbackLabel}</span>
            )}
            {option.capabilityNote && (
              <span className="badge badge--demo">{option.capabilityNote}</span>
            )}
          </span>
          <p className="payment-row__support">
            {option.detailLine ?? option.supportingText}
          </p>
          {option.cashbackReason && (
            <p className="payment-row__cashback">
              <span className="payment-row__cashback-kicker">Instant cashback</span>{' '}
              {option.cashbackReason}
            </p>
          )}
        </span>
        <span className="radio-visual" aria-hidden="true" />
      </div>
      {expanded && <div className="payment-row__body">{children}</div>}
    </div>
  );
}
