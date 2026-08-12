import { useEffect, useMemo, useRef, useState } from 'react';
import { money } from '../../lib/format';
import {
  LIVE_RUN_EVENTS,
  applyLiveDelta,
  initialLiveSnapshot,
  type LiveRunEvent,
  type LiveRunSnapshot,
} from '../lib/liveRunScript';

interface LiveRunSimulatorProps {
  paused?: boolean;
  onExplainDecision: () => void;
  onCompleteWindow: () => void;
  onSafetyPause: () => void;
}

type RunState = 'idle' | 'running' | 'paused' | 'done';

export function LiveRunSimulator({
  paused,
  onExplainDecision,
  onCompleteWindow,
  onSafetyPause,
}: LiveRunSimulatorProps) {
  const [runState, setRunState] = useState<RunState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [snap, setSnap] = useState<LiveRunSnapshot>(() => initialLiveSnapshot());
  const [feed, setFeed] = useState<LiveRunEvent[]>([]);
  const [runKey, setRunKey] = useState(0);
  const applied = useRef(new Set<string>());
  const startedAt = useRef<number | null>(null);

  const progress = useMemo(() => {
    const end = LIVE_RUN_EVENTS[LIVE_RUN_EVENTS.length - 1]?.atMs ?? 1;
    return Math.min(100, Math.round((elapsed / end) * 100));
  }, [elapsed]);

  const start = () => {
    applied.current = new Set();
    startedAt.current = performance.now();
    setSnap(initialLiveSnapshot());
    setFeed([]);
    setElapsed(0);
    setRunState('running');
    setRunKey((k) => k + 1);
  };

  useEffect(() => {
    // Auto-start when the live stage mounts.
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paused && runState === 'running') setRunState('paused');
  }, [paused, runState]);

  useEffect(() => {
    if (runState !== 'running') return;

    let frame = 0;
    const tick = () => {
      if (!startedAt.current) return;
      const ms = performance.now() - startedAt.current;
      setElapsed(ms);

      for (const event of LIVE_RUN_EVENTS) {
        if (ms >= event.atMs && !applied.current.has(event.id)) {
          applied.current.add(event.id);
          setFeed((prev) => [event, ...prev].slice(0, 8));
          if (event.delta) {
            setSnap((prev) => applyLiveDelta(prev, event.delta));
          }
          if (event.kind === 'complete') {
            setRunState('done');
          }
        }
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [runState, runKey]);

  return (
    <div className="ga-live" key={runKey}>
      <div className="ga-live__status">
        <span
          className={`ga-live__pill ${
            runState === 'running' ? 'is-live' : runState === 'done' ? 'is-done' : 'is-paused'
          }`}
        >
          {runState === 'running' && 'Live run in progress'}
          {runState === 'paused' && 'Run paused'}
          {runState === 'done' && 'Live run ready to close'}
          {runState === 'idle' && 'Ready to simulate'}
        </span>
        <span className="ga-live__pct">{progress}%</span>
      </div>

      <div className="ga-live__track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="ga-chips">
        <div className="ga-chip">
          <strong>{snap.offersSent.toLocaleString('en-AU')}</strong>
          <span>Offers sent</span>
        </div>
        <div className="ga-chip">
          <strong>{snap.redemptions.toLocaleString('en-AU')}</strong>
          <span>Redemptions</span>
        </div>
        <div className="ga-chip">
          <strong>{money(snap.available)}</strong>
          <span>Liability free</span>
        </div>
        <div className="ga-chip">
          <strong>{snap.adaptiveShare}%</strong>
          <span>Adaptive share</span>
        </div>
      </div>

      <p className="mp-hint" style={{ marginBottom: '0.65rem' }}>
        Mix {snap.controlShare}/{snap.fixedShare}/{snap.adaptiveShare} · Reserved{' '}
        {money(snap.reserved)} · Consumed {money(snap.consumed)}
      </p>

      <div className="ga-live__feed" aria-live="polite">
        {feed.length === 0 && (
          <p className="mp-hint">Spinning up Instant cashback…</p>
        )}
        {feed.map((event) => (
          <article key={event.id} className={`ga-live__event ga-live__event--${event.kind}`}>
            <header>
              <span className="ga-live__kind">{labelFor(event.kind)}</span>
              <strong>{event.title}</strong>
            </header>
            <p>{event.detail}</p>
          </article>
        ))}
      </div>

      <div className="ga__actions" style={{ marginTop: '0.75rem' }}>
        {runState === 'running' && (
          <button type="button" className="mp-btn mp-btn--sm" onClick={() => setRunState('paused')}>
            Pause sim
          </button>
        )}
        {(runState === 'paused' || runState === 'idle') && (
          <button
            type="button"
            className="mp-btn mp-btn--sm mp-btn--primary"
            onClick={() => {
              if (runState === 'idle') start();
              else {
                startedAt.current = performance.now() - elapsed;
                setRunState('running');
              }
            }}
          >
            {runState === 'idle' ? 'Start live run' : 'Resume sim'}
          </button>
        )}
        <button type="button" className="mp-btn mp-btn--sm" onClick={start}>
          Replay from start
        </button>
        <button type="button" className="mp-btn mp-btn--sm" onClick={onExplainDecision}>
          Explain decision
        </button>
        <button
          type="button"
          className="mp-btn mp-btn--sm mp-btn--danger"
          onClick={onSafetyPause}
        >
          Trip safety pause
        </button>
        {(runState === 'done' || progress > 60) && (
          <button type="button" className="mp-btn mp-btn--sm mp-btn--primary" onClick={onCompleteWindow}>
            Close window · report
          </button>
        )}
      </div>
    </div>
  );
}

function labelFor(kind: LiveRunEvent['kind']): string {
  switch (kind) {
    case 'qualify':
      return 'Qualify';
    case 'skip':
      return 'Skip';
    case 'offer':
      return 'Offer';
    case 'redeem':
      return 'Redeem';
    case 'allocate':
      return 'Allocate';
    case 'liability':
      return 'Ledger';
    case 'warn':
      return 'Watch';
    case 'complete':
      return 'Ready';
  }
}
