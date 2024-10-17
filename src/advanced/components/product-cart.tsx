import React, { Dispatch, SetStateAction } from "react";
import { CartProductType } from "./product-container";
import CartProductItem from "./cart-product-item";
import TotalCost from "./total-cost";

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
      <TotalCost cartProductList={cartProductList} />
    </>
  );
};

export default ProductCart;
