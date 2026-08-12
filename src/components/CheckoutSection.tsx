import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  id?: string;
}

export function CheckoutSection({ title, children, id }: Props) {
  return (
    <section className="card-surface checkout-section" aria-labelledby={id}>
      <h2 className="section-title" id={id}>
        {title}
      </h2>
      {children}
    </section>
  );
}
