import { useEffect, useState, type FormEvent, type ReactNode } from 'react';

type GateState = 'loading' | 'locked' | 'open';

async function readSession() {
  const res = await fetch('/api/auth/session', { credentials: 'same-origin' });
  if (!res.ok) return false;
  const data = (await res.json()) as { unlocked?: boolean };
  return data.unlocked === true;
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GateState>('loading');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    readSession()
      .then((unlocked) => {
        if (!cancelled) setState(unlocked ? 'open' : 'locked');
      })
      .catch(() => {
        if (!cancelled) setState('locked');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('That password is not right.');
        setState('locked');
        return;
      }
      setPassword('');
      setState('open');
    } catch {
      setError('Could not reach the demo server. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (state === 'open') return children;

  return (
    <div className="gate">
      <div className="gate__stage">
        <header className="gate__hero">
          <img
            className="gate__logo"
            src="/brand/hello-clever-logo-white.svg"
            alt="Hello Clever"
          />
          <p className="gate__kicker">Private demo</p>
          <h1 className="gate__title">Enter the password</h1>
          <p className="gate__lede">
            This walkthrough is locked. Use the password from the Hello Clever team to continue.
          </p>
        </header>

        {state === 'locked' && (
          <form className="gate__card" onSubmit={onSubmit}>
            <label className="field" htmlFor="demo-password">
              <span>Password</span>
              <input
                id="demo-password"
                className="input"
                type="password"
                name="password"
                autoComplete="current-password"
                autoFocus
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'gate-error' : undefined}
              />
            </label>
            {error && (
              <p id="gate-error" className="field__error" role="alert">
                {error}
              </p>
            )}
            <button className="btn btn--primary btn--full" type="submit" disabled={submitting}>
              {submitting ? 'Checking…' : 'Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
