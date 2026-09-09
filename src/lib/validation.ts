import type {
  CardDetails,
  CheckoutCurrency,
  ContactDetails,
  DeliveryDetails,
  FieldErrors,
} from '../types';
import { DECLINE_CARD, SUCCESS_CARD } from './constants';

export function validateContact(
  contact: ContactDetails,
  currency: CheckoutCurrency = 'AUD',
): FieldErrors {
  const errors: FieldErrors = {};
  if (!contact.email.trim()) {
    errors.email = 'Enter your email address so we can send your receipt.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    errors.email = 'Enter a valid email address, for example name@example.com.';
  }

  const mobileDigits = contact.mobile.replace(/\D/g, '');
  if (currency === 'USD') {
    if (!mobileDigits) {
      errors.mobile = 'Enter your mobile number.';
    } else if (mobileDigits.length !== 10) {
      errors.mobile = 'Use a 10-digit US mobile number.';
    }
  } else if (currency === 'IDR') {
    if (!mobileDigits) {
      errors.mobile = 'Enter your mobile number.';
    } else if (!/^08\d{8,11}$/.test(mobileDigits)) {
      errors.mobile = 'Use an Indonesian mobile number starting with 08.';
    }
  } else if (!mobileDigits) {
    errors.mobile = 'Enter your Australian mobile number.';
  } else if (!/^0?4\d{8}$/.test(mobileDigits) && !/^61?4\d{8}$/.test(mobileDigits)) {
    errors.mobile = 'Use an Australian mobile number starting with 04.';
  }

  return errors;
}

export function validateDelivery(
  delivery: DeliveryDetails,
  currency: CheckoutCurrency = 'AUD',
): FieldErrors {
  const errors: FieldErrors = {};
  if (!delivery.firstName.trim()) errors.firstName = 'Enter your first name.';
  if (!delivery.lastName.trim()) errors.lastName = 'Enter your last name.';
  if (!delivery.street.trim()) errors.street = 'Enter your street address.';
  if (!delivery.suburb.trim()) {
    errors.suburb = currency === 'AUD' ? 'Enter your suburb.' : 'Enter your city.';
  }
  if (!delivery.state) {
    errors.state =
      currency === 'IDR'
        ? 'Select a province.'
        : currency === 'USD'
          ? 'Select a state.'
          : 'Select a state or territory.';
  }
  if (currency === 'USD') {
    if (!/^\d{5}$/.test(delivery.postcode.trim())) {
      errors.postcode = 'Enter a 5-digit ZIP code.';
    }
  } else if (currency === 'IDR') {
    if (!/^\d{5}$/.test(delivery.postcode.trim())) {
      errors.postcode = 'Enter a 5-digit postcode.';
    }
  } else if (!/^\d{4}$/.test(delivery.postcode.trim())) {
    errors.postcode = 'Enter a 4-digit Australian postcode.';
  }
  return errors;
}

export function validateCard(card: CardDetails): FieldErrors {
  const errors: FieldErrors = {};
  const digits = card.number.replace(/\D/g, '');
  if (digits.length < 15) {
    errors.cardNumber = 'Enter the full card number.';
  }
  if (!card.name.trim()) {
    errors.cardName = 'Enter the name as it appears on the card.';
  }
  if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
    errors.cardExpiry = 'Enter expiry as MM/YY.';
  } else {
    const [mm, yy] = card.expiry.split('/').map(Number);
    if (mm < 1 || mm > 12) errors.cardExpiry = 'Enter a valid month between 01 and 12.';
    const now = new Date();
    const exp = new Date(2000 + yy, mm);
    if (exp <= now) errors.cardExpiry = 'This card appears to be expired. Use a later date.';
  }
  if (!/^\d{3,4}$/.test(card.cvc.trim())) {
    errors.cardCvc = 'Enter the 3 or 4 digit security code.';
  }
  return errors;
}

export function isSuccessCard(number: string): boolean {
  return number.replace(/\D/g, '') === SUCCESS_CARD;
}

export function isDeclineCard(number: string): boolean {
  return number.replace(/\D/g, '') === DECLINE_CARD;
}

export function firstErrorKey(errors: FieldErrors): string | null {
  return Object.keys(errors).find((key) => errors[key]) ?? null;
}
