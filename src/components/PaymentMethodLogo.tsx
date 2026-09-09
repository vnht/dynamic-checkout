import type { PaymentMethod } from '../types';

const LOGOS: Record<PaymentMethod, { src: string; alt: string }> = {
  card: { src: '/payments/card.svg', alt: 'Visa, Mastercard and American Express' },
  afterpay: { src: '/payments/afterpay.svg', alt: 'Afterpay' },
  klarna: { src: '/payments/klarna.svg', alt: 'Klarna' },
  payto: { src: '/payments/payto.svg', alt: 'PayTo' },
  payid: { src: '/payments/payid.svg', alt: 'PayID' },
  paybybank: { src: '/payments/paybybank.svg', alt: 'Pay by bank' },
  paypal: { src: '/payments/paypal.svg', alt: 'PayPal' },
  applepay: { src: '/payments/applepay.svg', alt: 'Apple Pay' },
  googlepay: { src: '/payments/googlepay.svg', alt: 'Google Pay' },
  qris: { src: '/payments/qris.svg', alt: 'QRIS' },
  dana: { src: '/payments/dana.svg', alt: 'DANA' },
};

export function PaymentMethodLogo({ method }: { method: PaymentMethod }) {
  const logo = LOGOS[method];
  return (
    <span className={`payment-row__logo payment-row__logo--${method}`}>
      <img src={logo.src} alt="" />
    </span>
  );
}
