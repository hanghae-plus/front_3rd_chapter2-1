import React, { Dispatch, SetStateAction } from "react";
import { CartProductType } from "./product-container";

interface CartProductItemProps {
  cartProduct: CartProductType;
  setCartProductList: Dispatch<SetStateAction<CartProductType[]>>;
}

const INCREASE_COUNT = 1;
const DECREASE_COUNT = -1;
const CartProductItem = ({ cartProduct, setCartProductList }: CartProductItemProps) => {
  const cartProductText = `${cartProduct.name} - ${cartProduct.price}원 x ${cartProduct.count}`;

  const setCartProductCount = (prev: CartProductType[], quantity: number) => {
    const productIndex = prev.findIndex(product => product.id === cartProduct.id);
    return prev.with(productIndex, { ...cartProduct, count: cartProduct.count + quantity });
  };

  const removeCartProduct = (prev: CartProductType[]) => {
    return prev.filter(product => product.id !== cartProduct.id);
  };

  const handleClickDecrease = () => {
    if (cartProduct.count === 1) {
      handleClickRemove();
    } else {
      setCartProductList(prev => setCartProductCount(prev, DECREASE_COUNT));
    }
  };

  const handleClickIncrease = () => {
    if (cartProduct.count === cartProduct.quantity) {
      alert("재고가 부족합니다!");
    } else {
      setCartProductList(prev => setCartProductCount(prev, INCREASE_COUNT));
    }
  };

  const handleClickRemove = () => {
    setCartProductList(prev => removeCartProduct(prev));
  };

  return (
    <div id={cartProduct.id} className="flex justify-between items-center mb-2">
      <span>{cartProductText}</span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={cartProduct.id}
          data-change="-1"
          onClick={handleClickDecrease}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={cartProduct.id}
          data-change="1"
          onClick={handleClickIncrease}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={cartProduct.id}
          onClick={handleClickRemove}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartProductItem;
