import React, { Dispatch, SetStateAction } from "react";
import { CartProductType } from "./product-container";
import CartProductItem from "./cart-product-item";

interface ProductCartProps {
  cartProductList: CartProductType[];
  setCartProductList: Dispatch<SetStateAction<CartProductType[]>>;
}

const ProductCart = ({ cartProductList, setCartProductList }: ProductCartProps) => {
  return (
    <>
      <div id="cart-items">
        {cartProductList.map(cartProduct => {
          return (
            <CartProductItem
              cartProduct={cartProduct}
              setCartProductList={setCartProductList}
              key={cartProduct.id}
            />
          );
        })}
      </div>
      <div className="text-xl font-bold my-4" id="cart-total"></div>
    </>
  );
};

export default ProductCart;
