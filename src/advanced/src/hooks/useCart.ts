import { useEffect, useState } from 'react';
import { DISCOUNT_RULES, DISCOUTNT_RULES_OF_TUESDAY, MESSAGE, PRODUCT_DATA, QUANTITY } from '../constants';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  [key: string]: number;
}

const useCart = () => {
  const [productList, setProductList] = useState<Product[]>(PRODUCT_DATA);
  const [cart, setCart] = useState<Cart>({});
  const [bonusPoint, setBonusPoint] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const addToCart = (productId: string) => {
    const product = productList.find((product: Product) => product.id === productId);

    if (!product) {
      return;
    }

    if (product.quantity <= 0) {
      alert(MESSAGE.NOT_ENOUGH_PRODUCT);
      return;
    }

    setCart((prevCart: Cart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - 1 } : prev)),
    );
  };

  const calculateCart = () => {
    let newTotalAmount = 0;
    let subTotal = 0;
    let itemCount = 0;
    let newDiscountRate = 0;

    Object.entries(cart).forEach(([productId, quantity]) => {
      const product = productList.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      const productPrice = product.price * quantity;

      subTotal += productPrice;
      itemCount += quantity;

      const discount = quantity >= QUANTITY['10'] ? DISCOUNT_RULES[productId] : 0;

      newTotalAmount += productPrice * (1 - discount);
    });

    const bulkDiscount = newTotalAmount * DISCOUNT_RULES['bulk'];

    if (itemCount >= QUANTITY['30'] && bulkDiscount > subTotal - newTotalAmount) {
      newTotalAmount = subTotal * (1 - DISCOUNT_RULES['bulk']);
      newDiscountRate = DISCOUNT_RULES['bulk'];
    } else {
      newDiscountRate = (subTotal - newTotalAmount) / subTotal;
    }

    if (new Date().getDay() === DISCOUTNT_RULES_OF_TUESDAY.dayNumber) {
      newTotalAmount *= 1 - DISCOUTNT_RULES_OF_TUESDAY.discountRate;
      newDiscountRate = Math.max(newDiscountRate, DISCOUTNT_RULES_OF_TUESDAY.discountRate);
    }

    setTotalAmount(newTotalAmount);
    setDiscountRate(newDiscountRate);
    setBonusPoint((prev) => prev + Math.floor(newTotalAmount / 1000));
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
