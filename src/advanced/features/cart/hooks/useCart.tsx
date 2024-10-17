import { useMemo, useState } from 'react';
import { IProduct } from '../../product/types';
import { ICart } from '../types';
import { checkFocusPurchaseDiscountRate } from '../../product/utils';
import {
  BULK_PURCHASE_COUNT,
  BULK_PURCHASE_DISCOUNT_RATE,
  TUESDAY_DISCOUNT_RATE,
} from '../../product/constants';

export interface IUseCartProps {
  products: IProduct[];
}

export const useCart = ({ products }: IUseCartProps) => {
  const [items, setItems] = useState<ICart[]>([]);

  const addToCart = (itemId: IProduct['id']) => {
    const foundItem = items.find(({ id }) => id === itemId);

    if (!foundItem) {
      const foundProduct = products.find(({ id }) => id === itemId);

      if (!foundProduct) return;

      setItems((prevItems) => [
        ...prevItems,
        {
          id: itemId,
          name: foundProduct.name,
          price: foundProduct.val,
          quantity: 1,
        },
      ]);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const minusFromCart = (itemId: IProduct['id']) => {
    const foundItem = items.find(({ id }) => id === itemId);

    if (!foundItem) return;
    if (foundItem.quantity - 1 <= 0) {
      setItems((prevItems) => prevItems.filter(({ id }) => id !== itemId));
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeFromCart = (itemId: IProduct['id']) => {
    setItems((prevItems) => prevItems.filter(({ id }) => id !== itemId));
  };

  const { isBulkPurchase, totalRegularAmount, totalAmount } = useMemo(() => {
    const isBulkPurchase = items.length >= BULK_PURCHASE_COUNT;
    const totalRegularAmount = items.reduce(
      (total, { price, quantity }) => total + price * quantity,
      0
    );

    const totalAmount = items.reduce((total, { id, price, quantity }) => {
      const itemTotalAmount = price * quantity;
      total +=
        itemTotalAmount * (1 - checkFocusPurchaseDiscountRate(id, quantity));

      return total;
    }, 0);

    return { totalRegularAmount, totalAmount, isBulkPurchase };
  }, [items]);

  const { discountRate, finalTotalAmount } = useMemo(() => {
    let finalTotalAmount = totalAmount;
    let discountRate = (totalRegularAmount - totalAmount) / totalRegularAmount;

    const isTuesday = new Date().getDay() === 2;
    const isOverDiscount =
      totalAmount * BULK_PURCHASE_DISCOUNT_RATE >
      totalRegularAmount - totalAmount;

    if (isBulkPurchase && isOverDiscount) {
      finalTotalAmount = totalRegularAmount * (1 - BULK_PURCHASE_DISCOUNT_RATE);
      discountRate = BULK_PURCHASE_DISCOUNT_RATE;
    }

    if (isTuesday) {
      finalTotalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
      discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    }

    return {
      discountRate,
      finalTotalAmount: Math.round(finalTotalAmount),
    };
  }, [totalAmount, totalRegularAmount, isBulkPurchase]);

  const { bonusPoint } = useMemo(
    () => ({ bonusPoint: Math.floor(totalAmount / 1000) }),
    [finalTotalAmount]
  );

  return {
    cartItems: items,
    totalAmount: finalTotalAmount,
    discountRate,
    bonusPoint,
    addToCart,
    minusFromCart,
    removeFromCart,
  };
};
