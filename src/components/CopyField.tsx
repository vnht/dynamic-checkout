import { useId, useState } from 'react';

interface Props {
  label: string;
  value: string;
}

export function CopyField({ label, value }: Props) {
  const id = useId();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="copy-field">
      <label htmlFor={id}>{label}</label>
      <div className="copy-field__row">
        <div className="copy-field__value" id={id}>
          {value}
        </div>
        <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
          Copy
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </div>
  );
}
