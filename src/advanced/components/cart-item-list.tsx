import React, { useState, useRef, useEffect } from "react";
import { CartItem, ProductSelector, StockStatus } from ".";
import {
  PRODUCT_DISCOUNT_RATE,
  BULK_DISCOUNT_START_QUANTITY,
  BULK_DISCOUNT_RATE,
  DATE_TO_TUESDAY,
  TUESDAY_DISCOUNT_RATE,
  RATE_TO_PERCENT,
  DISCOUNT_START_QUANTITY,
  POINT_PER_AMOUNT,
  LUCKY_SALE_SUCCESS_RATE,
  LUCKY_SALE_DISCOUNT_RATE,
  LUCKY_SALE_RANGE_TERM,
  SUGGEST_DISCOUNT_RATE,
  SUGGEST_RANGE_TERM,
  LUCKY_SALE_END_TERM,
  SUGGEST_END_TERM,
} from "../const";

export interface ProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItemType extends ProductType {
  itemCount: number;
}

export const CartItemList = () => {
  const [cartItemList, setCartItemList] = useState<CartItemType[]>([]);
  const lastSelectedItemRef = useRef<string | null>(null);

  const calculateDiscount = (cartItemList: CartItemType[]) => {
    const subAmount = cartItemList.reduce((acc, item) => acc + item.price * item.itemCount, 0);
    let discountedAmount = subAmount;

    // 개별 상품 할인 적용
    discountedAmount = cartItemList.reduce((acc, item) => {
      const itemDiscountRate =
        item.itemCount >= DISCOUNT_START_QUANTITY ? PRODUCT_DISCOUNT_RATE[item.id] || 0 : 0;
      return acc + item.price * item.itemCount * (1 - itemDiscountRate);
    }, 0);

    let discountRate = (subAmount - discountedAmount) / subAmount;

    // 대량 구매 할인 확인
    const totalQuantity = cartItemList.reduce((acc, item) => acc + item.itemCount, 0);
    if (totalQuantity >= BULK_DISCOUNT_START_QUANTITY) {
      const bulkDiscountAmount = subAmount * BULK_DISCOUNT_RATE;
      const itemDiscountAmount = subAmount - discountedAmount;

      if (bulkDiscountAmount > itemDiscountAmount) {
        discountedAmount = subAmount * (1 - BULK_DISCOUNT_RATE);
        discountRate = BULK_DISCOUNT_RATE;
      }
    }

    // 화요일 할인 확인
    if (new Date().getDay() === DATE_TO_TUESDAY) {
      const tuesdayDiscountAmount = discountedAmount * TUESDAY_DISCOUNT_RATE;
      const newDiscountedAmount = discountedAmount - tuesdayDiscountAmount;
      const newDiscountRate = (subAmount - newDiscountedAmount) / subAmount;

      if (newDiscountRate > discountRate) {
        discountedAmount = newDiscountedAmount;
        discountRate = newDiscountRate;
      }
    }

    return { discountedAmount, discountRate };
  };

  const { discountedAmount, discountRate } = calculateDiscount(cartItemList);
  const bonusPoint = Math.floor(discountedAmount / POINT_PER_AMOUNT);

  useEffect(() => {
    let luckySaleInterval: NodeJS.Timeout;
    let suggestInterval: NodeJS.Timeout;

    const startLuckySale = () => {
      luckySaleInterval = setInterval(() => {
        const luckyItem = cartItemList[Math.floor(Math.random() * cartItemList.length)];

        if (Math.random() < LUCKY_SALE_SUCCESS_RATE && luckyItem.quantity > 0) {
          const discountedPrice = Math.round(luckyItem.price * LUCKY_SALE_DISCOUNT_RATE);
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

          setCartItemList(prev =>
            prev.map(item =>
              item.id === luckyItem.id ? { ...item, price: discountedPrice } : item,
            ),
          );
        }
      }, LUCKY_SALE_RANGE_TERM);
    };

    const startSuggest = () => {
      suggestInterval = setInterval(() => {
        if (lastSelectedItemRef.current) {
          const suggest = cartItemList.find(
            item => item.id !== lastSelectedItemRef.current && item.quantity > 0,
          );

          if (suggest) {
            const discountedPrice = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
            alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

            setCartItemList(prev =>
              prev.map(item =>
                item.id === suggest.id ? { ...item, price: discountedPrice } : item,
              ),
            );
          }
        }
      }, SUGGEST_RANGE_TERM);
    };

    const luckySaleTimeout = setTimeout(startLuckySale, LUCKY_SALE_END_TERM);
    const suggestTimeout = setTimeout(startSuggest, SUGGEST_END_TERM);

    return () => {
      clearTimeout(luckySaleTimeout);
      clearTimeout(suggestTimeout);
      clearInterval(luckySaleInterval);
      clearInterval(suggestInterval);
    };
  }, [cartItemList]);

  return (
    <>
      <div id="cart-items">
        {cartItemList?.map(cartItem => (
          <CartItem
            key={cartItem.id}
            cartItem={cartItem}
            setCartItemList={setCartItemList}
            cartItemList={cartItemList}
          />
        ))}
      </div>

      <div id="cart-total" className="text-xl font-bold my-4">
        총액: {discountedAmount.toLocaleString()}원
        {discountRate > 0 && (
          <span id="discount-info" className="text-green-500 ml-2">
            ({(discountRate * RATE_TO_PERCENT).toFixed(1)}% 할인 적용)
          </span>
        )}
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: {bonusPoint})
        </span>
      </div>

      <ProductSelector
        cartItemList={cartItemList}
        setCartItemList={setCartItemList}
        lastSelectedItemRef={lastSelectedItemRef}
      />

      <StockStatus cartItemList={cartItemList} />
    </>
  );
};
