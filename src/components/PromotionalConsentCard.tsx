import { MERCHANT_NAME } from '../lib/constants';
import type { PromotionalConsentRecord } from '../types';

interface PromotionalConsentCardProps {
  consent: PromotionalConsentRecord | null;
  onOptIn: () => void;
  onDecline: () => void;
}

export function PromotionalConsentCard({ consent, onOptIn, onDecline }: PromotionalConsentCardProps) {
  if (consent?.optedIn) {
    return (
      <div className="consent-card consent-card--done card-surface" role="status">
        <h2 className="section-title">You&apos;re signed up for {MERCHANT_NAME} offers</h2>
        <p>
          Hello Clever will email Circuit &amp; Co. offers on their behalf. You can unsubscribe anytime
          from any message.
        </p>
      </div>
    );
  }

  if (consent && !consent.optedIn) {
    return (
      <div className="consent-card consent-card--done card-surface" role="status">
        <h2 className="section-title">No offer emails</h2>
        <p>We won&apos;t send promotional Circuit &amp; Co. offers for this order.</p>
      </div>
    );
  }

  return (
    <div className="consent-card card-surface">
      <h2 className="section-title">Get {MERCHANT_NAME} offers</h2>
      <p>
        Optionally get a ping when more instant cashback drops, plus Circuit &amp; Co. offers. Off by
        default. You choose.
      </p>
      <p className="consent-card__meta">
        Hello Clever sends these emails for Circuit &amp; Co. See{' '}
        <a href="#terms" onClick={(e) => e.preventDefault()}>
          terms
        </a>
        .
      </p>
      <div className="consent-card__actions">
        <button type="button" className="btn btn--primary" onClick={onOptIn}>
          Sign me up
        </button>
        <button type="button" className="btn btn--ghost" onClick={onDecline}>
          Not now
        </button>
      </div>
    </div>
  );
}
