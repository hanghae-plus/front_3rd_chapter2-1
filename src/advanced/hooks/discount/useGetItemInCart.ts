import { reduce } from 'lodash-es';

export const useGetItemInCart = (items: ItemType[]): number[] => {
  const { totalPrice, discountedPrice, itemQty } = reduce(
    items,
    (acc, cur: ItemType) => {
      const price = cur.price * cur.quantity;
      const discountRate = cur.quantity < 10 ? 0 : cur.discount;

      acc.totalPrice += price;
      acc.discountedPrice += price * (1 - discountRate);
      acc.itemQty += cur.quantity;
      return acc;
    },
    { totalPrice: 0, discountedPrice: 0, itemQty: 0 }
  );

  return [totalPrice, discountedPrice, itemQty];
};
