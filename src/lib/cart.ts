import type { CartLineItem } from '../types';
import { DELIVERY_PRICE } from './constants';

export function lineTotal(item: CartLineItem): number {
  return item.unitPrice * item.quantity;
}

export function cartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

export function cartTotal(items: CartLineItem[]): number {
  return cartSubtotal(items) + DELIVERY_PRICE;
}

export function afterpayInstalment(items: CartLineItem[]): number {
  const total = cartTotal(items);
  return Math.round((total / 4) * 100) / 100;
}

export function isCartEmpty(items: CartLineItem[]): boolean {
  return items.every((item) => item.quantity <= 0) || items.length === 0;
}
