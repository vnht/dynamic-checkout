import { useEffect, useRef } from 'react';
import { formatCountdown } from '../lib/format';

interface Props {
  seconds: number;
  label: string;
}

export function CountdownTimer({ seconds, label }: Props) {
  const liveRef = useRef<HTMLSpanElement>(null);
  const lastAnnRef = useRef<number>(-1);

  useEffect(() => {
    const thresholds = [120, 60, 30, 10, 0];
    if (thresholds.includes(seconds) && lastAnnRef.current !== seconds) {
      lastAnnRef.current = seconds;
      if (liveRef.current) {
        liveRef.current.textContent =
          seconds === 0
            ? `${label} expired`
            : `${label}: ${formatCountdown(seconds)} remaining`;
      }
    }
  }, [seconds, label]);

  return (
    <div className="waiting-card">
      <div className="countdown" aria-hidden="true">
        {formatCountdown(seconds)}
      </div>
      <span className="sr-only" aria-live="polite" ref={liveRef} />
      <p className="field__hint">{label}</p>
    </div>
  );
}
