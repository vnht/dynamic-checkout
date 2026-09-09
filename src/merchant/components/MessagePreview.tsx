import { useState } from 'react';
import { useAgenticGrowth } from '../context/AgenticGrowthContext';

export function MessagePreview() {
  const { messagePreviewOpen, setMessagePreviewOpen } = useAgenticGrowth();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  if (!messagePreviewOpen) return null;

  return (
    <>
      <button
        type="button"
        className="mp-drawer-backdrop"
        aria-label="Close message preview"
        onClick={() => setMessagePreviewOpen(false)}
      />
      <aside className="mp-drawer" role="dialog" aria-label="Message preview" style={{ width: 'min(560px, 100%)' }}>
        <h2>Offer email preview</h2>
        <div className="mp-actions" style={{ marginTop: 0 }}>
          <button
            type="button"
            className={`mp-btn mp-btn--sm ${viewport === 'desktop' ? 'mp-btn--primary' : ''}`}
            onClick={() => setViewport('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`mp-btn mp-btn--sm ${viewport === 'mobile' ? 'mp-btn--primary' : ''}`}
            onClick={() => setViewport('mobile')}
          >
            Mobile
          </button>
        </div>

        <div
          className={`mp-email-preview ${viewport === 'mobile' ? 'mp-email-preview--mobile' : ''}`}
          style={{ marginTop: '0.85rem' }}
        >
          <div className="mp-email-preview__chrome">
            From: Circuit &amp; Co. via Hello Clever · Subject: Instant cashback!!! A$33.90 is
            already yours
          </div>
          <div className="mp-email-preview__body">
            <strong>A$33.90 just landed in your balance</strong>
            <p>
              Your A$678 payment succeeded. <strong>5% instant cashback</strong> was credited the
              same second. No waiting. No next-order unlock. It&apos;s ready to spend now.
            </p>
            <button type="button" className="mp-btn mp-btn--primary mp-btn--sm">
              Spend it now
            </button>
          </div>
        </div>

        <div className="mp-panel" style={{ marginTop: '1rem' }}>
          <h3>Merchant-only send-time checks</h3>
          <ul>
            <li>Consent text version CIR-EMAIL-OFFERS-2026-08-v1 present</li>
            <li>Quiet hours respected (AU local)</li>
            <li>Duplicate suppression for existing live offers</li>
            <li>Existing offers immutable after send</li>
          </ul>
        </div>

        <div className="mp-actions">
          <button type="button" className="mp-btn" onClick={() => setMessagePreviewOpen(false)}>
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
