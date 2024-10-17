import { ICart } from '../../cart/types';
import { FOCUSED_PURCHASE_COUNT } from '../constants';

export const checkFocusPurchaseDiscountRate = (
  cartId: ICart['id'],
  quantity: ICart['quantity']
) => {
  const isFocusedPurchase = quantity >= FOCUSED_PURCHASE_COUNT;

  if (!isFocusedPurchase) return 0;

  if (cartId === 'p1') return 0.1;
  if (cartId === 'p2') return 0.15;
  if (cartId === 'p3') return 0.2;
  if (cartId === 'p4') return 0.05;
  if (cartId === 'p5') return 0.25;

  return 0;
};
