import React from "react";
import { CartItemType } from ".";
import { PRODUCT_LIST, STOCK_QUANTITY_TO_INFO } from "../const";

interface StockStatusPropsType {
  cartItemList: CartItemType[];
}

export const StockStatus = (props: StockStatusPropsType) => {
  const { cartItemList } = props;

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {PRODUCT_LIST.map(product => {
        const hasStock = product.quantity > 0;
        return !hasStock && <div key={product.id}>{`${product.name}: 품절`}</div>;
      })}
      {cartItemList?.map(cartItem => {
        const currentProduct = cartItemList.find(product => product.id === cartItem.id);

        if (currentProduct === undefined) {
          return null;
        }

        const stock = cartItem.quantity - cartItem.itemCount;
        const isStockCritical = stock <= STOCK_QUANTITY_TO_INFO;

        return (
          isStockCritical && (
            <div key={cartItem.id}>
              {`${cartItem.name}: ${stock > 0 ? `재고 부족 (${cartItem.quantity - cartItem.itemCount}개 남음)` : "품절"}`}
            </div>
          )
        );
      })}
    </div>
  );
};
