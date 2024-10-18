import { Product, CartProduct } from '../shared/types.ts';
import {
  BULK_PURCHASE_THRESHOLD,
  BULK_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
  BONUS_POINT_RATE,
} from '../shared/constants';

export const isTuesday = () => new Date().getDay() === 2;

export const calculateDiscount = (
  totalWithoutDiscount: number,
  totalWithProductDiscount: number,
  totalQuantity: number,
) => {
  let finalTotal = totalWithProductDiscount;
  let discountRate =
    (totalWithoutDiscount - totalWithProductDiscount) / totalWithoutDiscount;

  if (totalQuantity >= BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = totalWithProductDiscount * BULK_DISCOUNT_RATE;
    if (bulkDiscount > totalWithoutDiscount - totalWithProductDiscount) {
      finalTotal = totalWithoutDiscount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  if (isTuesday()) {
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    finalTotal = totalWithoutDiscount * (1 - discountRate);
  }

  return { discountRate, finalTotal };
};

export const calculateCart = (
  cartProducts: CartProduct[],
  products: Product[],
) => {
  const { productCount, subtotal, totalAmount } = cartProducts.reduce(
    (totals, cartProduct) => {
      const product = products.find((p) => p.id === cartProduct.id) as Product;
      const quantity = cartProduct.quantity;
      const productTotal = product.price * quantity;
      const discount =
        quantity >= BULK_PURCHASE_THRESHOLD ? product.discountRate : 0;

      totals.productCount += quantity;
      totals.subtotal += productTotal;
      totals.totalAmount += productTotal * (1 - discount);

      return totals;
    },
    { productCount: 0, subtotal: 0, totalAmount: 0 },
  );

  const { discountRate, finalTotal } = calculateDiscount(
    subtotal,
    totalAmount,
    productCount,
  );

  const bonusPoints = Math.floor(finalTotal / BONUS_POINT_RATE);

  return { finalTotal, discountRate, bonusPoints };
};
