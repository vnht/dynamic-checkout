import { useEffect, useState, type KeyboardEvent } from 'react';
import { useDemo } from '../context/DemoContext';
import type { PaymentMethod, PaymentOption } from '../types';
import { PaymentMethodRow } from './PaymentMethodRow';
import { AfterpayPanel } from './payment/AfterpayPanel';
import { CardPaymentPanel } from './payment/CardPaymentPanel';
import { PayByBankPanel } from './payment/PayByBankPanel';
import { PayIDPanel } from './payment/PayIDPanel';
import { DanaPanel } from './payment/DanaPanel';
import { PayPalPanel } from './payment/PayPalPanel';
import { PayToPanel } from './payment/PayToPanel';
import { QrisPanel } from './payment/QrisPanel';
import { WalletPayPanel } from './payment/WalletPayPanel';

export function PaymentMethodList() {
  const { paymentOptions, selectMethod, selectedMethod, overridden, checkoutMode } = useDemo();
  const ranked = checkoutMode !== 'normal';
  const recommended = ranked ? paymentOptions.find((o) => o.rank === 1) : undefined;
  const others = paymentOptions.filter((o) => o.rank !== 1);
  const selectedIsOther = Boolean(recommended && selectedMethod !== recommended.id);
  const [othersOpen, setOthersOpen] = useState(selectedIsOther || overridden);

  useEffect(() => {
    // Collapse alternatives again when the recommendation context changes
    setOthersOpen(selectedIsOther);
  }, [recommended?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedIsOther) setOthersOpen(true);
  }, [selectedIsOther]);

  const ordered = paymentOptions;
  const onKeyNav = (event: KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = ordered.findIndex((o) => o.id === selectedMethod);
    const delta = event.key === 'ArrowDown' ? 1 : -1;
    const next = ordered[(index + delta + ordered.length) % ordered.length];
    if (recommended && next.id !== recommended.id) setOthersOpen(true);
    selectMethod(next.id);
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[aria-labelledby="payment-label-${next.id}"]`)
        ?.focus();
    });
  };

  const panel = (id: PaymentMethod) => {
    switch (id) {
      case 'card':
        return <CardPaymentPanel />;
      case 'afterpay':
        return <AfterpayPanel brand="afterpay" />;
      case 'klarna':
        return <AfterpayPanel brand="klarna" />;
      case 'payto':
        return <PayToPanel />;
      case 'payid':
        return <PayIDPanel />;
      case 'paybybank':
        return <PayByBankPanel />;
      case 'paypal':
        return <PayPalPanel />;
      case 'applepay':
        return <WalletPayPanel brand="applepay" />;
      case 'googlepay':
        return <WalletPayPanel brand="googlepay" />;
      case 'qris':
        return <QrisPanel />;
      case 'dana':
        return <DanaPanel />;
    }
  };

  const renderRow = (option: PaymentOption) => (
    <PaymentMethodRow
      key={option.id}
      option={option}
      expanded={option.selected}
      onSelect={() => {
        if (recommended && option.id !== recommended.id) setOthersOpen(true);
        selectMethod(option.id);
      }}
    >
      {panel(option.id)}
    </PaymentMethodRow>
  );

  return (
    <>
      <div
        className="payment-list"
        role="radiogroup"
        aria-label="Payment methods"
        onKeyDown={onKeyNav}
      >
        {ranked ? (
          <>
            {recommended && renderRow(recommended)}
            <details
              className="payment-others"
              open={othersOpen}
              onToggle={(e) => setOthersOpen((e.target as HTMLDetailsElement).open)}
            >
              <summary className="payment-others__summary">
                <span>Other methods</span>
                <span className="payment-others__count">
                  {others.map((o) => o.label).join(' · ')}
                </span>
              </summary>
              <div className="payment-others__list">{others.map(renderRow)}</div>
            </details>
          </>
        ) : (
          paymentOptions.map(renderRow)
        )}
      </div>
      <p className="secure-note">Your payment details are encrypted and securely processed.</p>
    </>
  );
}
