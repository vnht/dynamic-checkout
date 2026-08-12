interface Props {
  merchant: string;
  amount: string;
  purpose: string;
  frequency: string;
}

export function BankAuthorisationWaiting({
  merchant,
  amount,
  purpose,
  frequency,
}: Props) {
  return (
    <div className="card-surface" style={{ marginBottom: '1rem', background: 'var(--hc-ink-25)' }}>
      <h3 className="section-title" style={{ fontSize: '1rem' }}>
        Waiting for bank authorisation
      </h3>
      <dl className="receipt-grid" style={{ marginTop: 0 }}>
        <div style={{ display: 'contents' }}>
          <dt>Merchant</dt>
          <dd>{merchant}</dd>
          <dt>Amount</dt>
          <dd>{amount}</dd>
          <dt>Purpose</dt>
          <dd>{purpose}</dd>
          <dt>Frequency</dt>
          <dd>{frequency}</dd>
        </div>
      </dl>
    </div>
  );
}
