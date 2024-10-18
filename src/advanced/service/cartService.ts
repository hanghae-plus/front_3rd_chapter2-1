import { CartSummaryProps, ProductList } from "../types/product";

export const updateQuantity = (items: ProductList[], productId: string, quantityToAdd: number) => {
  return items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + quantityToAdd } : item));
};

export const calculateTotalPrice = (cartItems: ProductList[]) => {
  console.log("cartItems", cartItems);

  const discountMenual = [
    { currentItemId: "p1", discountRate: 0.1 },
    { currentItemId: "p2", discountRate: 0.15 },
    { currentItemId: "p3", discountRate: 0.2 },
    { currentItemId: "p4", discountRate: 0.05 },
    { currentItemId: "p5", discountRate: 0.25 },
  ];

  let preDiscountTotalPrice = 0;
  let finalTotalPrice = 0;
  let itemCount = 0;

  for (const item of cartItems) {
    let quantity = item.quantity;
    let itemTot = item.price * quantity;
    let discountRate = 0;

    itemCount += quantity;
    preDiscountTotalPrice += itemTot;

    if (quantity >= 10) {
      const discountItem = discountMenual.find((discount) => discount.currentItemId === item.id);
      if (discountItem) {
        discountRate = discountItem.discountRate;
      }
    }

    finalTotalPrice += itemTot * (1 - discountRate);
  }

  return { preDiscountTotalPrice, finalTotalPrice, itemCount };
};

export const calculateDiscountRate = ({ preDiscountTotalPrice, finalTotalPrice, itemCount }: CartSummaryProps) => {
  const BULK_MIN_COUNT = 10;
  const BULK_DISCOUNT_RATE = 0.1;
  const WEEKDAY_DISCOUNT_RATE = 0.05;

  let discountRate = 0;

  // 대량 구매 할인 적용
  if (itemCount >= BULK_MIN_COUNT) {
    discountRate = BULK_DISCOUNT_RATE;
  }

  // 화요일 추가 할인 적용
  if (new Date().getDay() === 2) {
    discountRate = Math.max(discountRate, WEEKDAY_DISCOUNT_RATE);
  }

  return discountRate;
};

export const deleteCartItem = (deleteId: string, cartList: ProductList[]) => {
  const filtedList = cartList.filter((item) => item.id !== deleteId);

  return filtedList;
};
