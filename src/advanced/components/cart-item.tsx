import React from "react";
import { CartItemType } from ".";
import {
  PRODUCT_LIST,
  PRODUCT_DISCOUNT_RATE,
  BULK_DISCOUNT_START_QUANTITY,
  BULK_DISCOUNT_RATE,
  DISCOUNT_START_QUANTITY,
} from "../const";

interface CartItemPropsType {
  cartItem: CartItemType;
  setCartItemList: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  cartItemList: CartItemType[];
}

export const CartItem = (props: CartItemPropsType) => {
  const { cartItem, setCartItemList, cartItemList } = props;
  const { id, name, price, itemCount } = cartItem;

  const itemDiscountRate =
    itemCount >= DISCOUNT_START_QUANTITY ? PRODUCT_DISCOUNT_RATE[id] || 0 : 0;
  const discountedPrice = price * (1 - itemDiscountRate);

  const totalQuantity = cartItemList.reduce((acc, item) => acc + item.itemCount, 0);
  const isBulkDiscount = totalQuantity >= BULK_DISCOUNT_START_QUANTITY;
  const finalPrice = isBulkDiscount ? discountedPrice * (1 - BULK_DISCOUNT_RATE) : discountedPrice;

  const currentProduct = PRODUCT_LIST.find(product => product.id === id);

  const handleClickDecrease = () => {
    if (itemCount > 1) {
      setCartItemList(prev =>
        prev.map(item => (item.id === id ? { ...item, itemCount: itemCount - 1 } : item)),
      );
    }
  };
  const handleClickIncrease = () => {
    if (itemCount === currentProduct?.quantity) {
      alert("재고가 부족합니다.");
      return;
    }

    setCartItemList(prev =>
      prev.map(item => (item.id === id ? { ...item, itemCount: itemCount + 1 } : item)),
    );
  };
  const handleClickRemove = () => {
    setCartItemList(prev => prev.filter(item => item.id !== id));
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {finalPrice.toLocaleString()}원 x {itemCount}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleClickDecrease()}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleClickIncrease()}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => handleClickRemove()}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
