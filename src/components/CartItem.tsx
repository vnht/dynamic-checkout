import type { CartLineItem } from '../types';
import { lineTotal } from '../lib/cart';
import { money } from '../lib/format';
import { QuantityControl } from './QuantityControl';

interface Props {
  item: CartLineItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onQuantity, onRemove }: Props) {
  return (
    <article className="cart-item">
      <div
        className={`cart-item__image ${item.imageTone === 'keyboard' ? 'cart-item__image--keyboard' : ''}`}
        aria-hidden="true"
      >
        {item.imageTone === 'headphones' ? 'Nova ANC' : 'Orbit KB'}
      </div>
      <div>
        <h3 className="cart-item__name">{item.name}</h3>
        <p className="cart-item__variant">{item.variant}</p>
        <div className="cart-item__row">
          <QuantityControl value={item.quantity} onChange={onQuantity} label={item.name} />
          <div className="price">{money(lineTotal(item))}</div>
          <button type="button" className="btn--link" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
