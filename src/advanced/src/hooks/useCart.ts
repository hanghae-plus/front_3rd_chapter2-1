import { useCallback, useEffect, useState } from 'react';
import { DISCOUNT_RULES, DISCOUTNT_RULES_OF_TUESDAY, MESSAGE, PRODUCT_DATA, QUANTITY } from '../constants';
import { Cart, Product } from '../types';

/**
 * 장바구니 기능과 관련된 상태와 함수들을 커스텀 훅으로 구현
 */
const useCart = () => {
  const [productList, setProductList] = useState<Product[]>(PRODUCT_DATA);
  const [cart, setCart] = useState<Cart>({});
  const [bonusPoint, setBonusPoint] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const findProductById = useCallback(
    (productId: string) => productList.find((product) => product.id === productId),
    [productList],
  );

  const addToCart = (productId: string) => {
    const product = findProductById(productId);

    if (!product) {
      console.error('상품이 존재하지 않습니다.');
      return;
    }

    if (product.quantity <= 0) {
      alert(MESSAGE.NOT_ENOUGH_PRODUCT);
      return;
    }

    setCart((prevCart: Cart) => {
      const newCart = { ...prevCart };

      newCart[productId] = (newCart[productId] || 0) + 1;

      return newCart;
    });

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - 1 } : prev)),
    );
  };

  const calculateDiscount = (quantity: number, productId: string, price: number): number => {
    const discountRate = quantity >= QUANTITY['10'] ? DISCOUNT_RULES[productId] : 0;
    return price * quantity * (1 - discountRate);
  };

  const calculateCart = () => {
    let subTotal = 0;
    let itemCount = 0;
    let discountedTotal = 0;

    Object.entries(cart).forEach(([productId, quantity]) => {
      if (isNaN(quantity)) {
        console.error('수량이 숫자가 아닙니다.');
        return;
      }

      const product = findProductById(productId);

      if (!product) {
        console.error('상품이 존재하지 않습니다.');
        return;
      }

      const productTotal = calculateDiscount(quantity, productId, product.price);

      subTotal += product.price * quantity;
      itemCount += quantity;
      discountedTotal += productTotal;
    });

    const bulkDiscountAmount = subTotal * DISCOUNT_RULES['bulk'];

    if (itemCount >= QUANTITY['30'] && bulkDiscountAmount > subTotal - discountedTotal) {
      discountedTotal = subTotal * (1 - DISCOUNT_RULES['bulk']);
      setDiscountRate(DISCOUNT_RULES['bulk']);
    } else {
      setDiscountRate((subTotal - discountedTotal) / subTotal);
    }

    if (new Date().getDay() === DISCOUTNT_RULES_OF_TUESDAY.dayNumber) {
      discountedTotal *= 1 - DISCOUTNT_RULES_OF_TUESDAY.discountRate;
    }

    setTotalAmount(discountedTotal);
    setBonusPoint((prev) => prev + Math.floor(discountedTotal / 1000));
  };

  const changeQuantity = (productId: string, change: number) => {
    if ((cart[productId] || 0) + change < 0) {
      return;
    }

    setCart((prevCart: Cart) => {
      const newCart = { ...prevCart, [productId]: (prevCart[productId] || 0) + change };
      if (newCart[productId] <= 0) {
        delete newCart[productId];
      }
      return newCart;
    });

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - change } : prev)),
    );
  };

  useEffect(() => {
    calculateCart();
  }, [cart]);

  return {
    addToCart,
    calculateCart,
    changeQuantity,
    cart,
    productList,
    discountRate,
    totalAmount,
    bonusPoint,
  };
};

export default useCart;
