import { useEffect } from 'react';
import { useCartContext } from '../context/CartContext';
import { useDiscount } from './useDiscount';

export const useCalculator = () => {
  const { cartInfo, updateCartInfo, cartItemList, productList } = useCartContext();
  const { getProductBulkDiscountRate } = useDiscount();

  useEffect(() => {
    if (cartInfo.itemCount > 0) {
      console.log('aa');
    }
  }, [cartInfo]);

  const calculatorCart = () => {
    console.log('실행');
    updateCartInfo('itemCount', 0);
    updateCartInfo('totalAmount', 0);

    cartItemList.forEach((item) => {
      const { id, price } = productList.find((prod) => prod.id === item.id);

      const quantity = item.quantity;
      const itemTotal = price * quantity;
      updateCartInfo('itemCount', (prev) => prev + quantity);
      const discount = getProductBulkDiscountRate(id, quantity);
      updateCartInfo('totalAmount', (prev) => prev + itemTotal * (1 - discount));
    });

    let discountRate = 0;
  };

  return { calculatorCart };
};
