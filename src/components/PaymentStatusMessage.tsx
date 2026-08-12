interface Props {
  message: string | null;
  tone?: 'info' | 'error' | 'success' | 'warning';
}

export function PaymentStatusMessage({ message, tone = 'info' }: Props) {
  if (!message) return null;
  return (
    <div className={`status-banner status-banner--${tone}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
