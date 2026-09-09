import type { CheckoutCurrency } from '../types';

export const money = (amount: number, currency: CheckoutCurrency = 'AUD'): string => {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Math.round(amount * 15000));
  }
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-AU', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const moneyLabel = (amount: number, currency: CheckoutCurrency = 'AUD'): string =>
  currency === 'IDR' ? money(amount, currency) : `${money(amount, currency)} ${currency}`;

export const moneyAudLabel = (amount: number): string => moneyLabel(amount, 'AUD');

export const formatDateAu = (date: Date): string =>
  new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace(/ /g, ' ');

export const formatCountdown = (totalSeconds: number): string => {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const formatMobileAu = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
};

export const formatMobileUs = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const formatMobileId = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
  return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
};

export const formatMobile = (value: string, currency: CheckoutCurrency = 'AUD'): string => {
  if (currency === 'USD') return formatMobileUs(value);
  if (currency === 'IDR') return formatMobileId(value);
  return formatMobileAu(value);
};

export const maskCard = (last4 = '4242'): string => `Visa ending ${last4}`;
