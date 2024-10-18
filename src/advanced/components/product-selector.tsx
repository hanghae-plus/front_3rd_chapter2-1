import React, { useRef } from "react";
import { CartItemType } from ".";
import { PRODUCT_LIST } from "../const";

interface ProductSelectorPropsType {
  cartItemList: CartItemType[];
  setCartItemList: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  lastSelectedItemRef: React.MutableRefObject<string | null>;
}

export const ProductSelector = (props: ProductSelectorPropsType) => {
  const { cartItemList, setCartItemList, lastSelectedItemRef } = props;
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChangeProduct = () => {
    if (selectRef.current) {
      lastSelectedItemRef.current = selectRef.current.value;
    }
  };

  const handleClickAddToCart = () => {
    if (selectRef.current) {
      const productId = selectRef.current.value;
      const hasCartItem = cartItemList.some(item => item.id === productId);

      if (hasCartItem) {
        alert("이미 장바구니에 있는 상품입니다.");
        return;
      }

      const selectedProduct = PRODUCT_LIST.find(p => p.id === productId);
      if (selectedProduct !== undefined) {
        setCartItemList(prev => [...prev, { ...selectedProduct, itemCount: 1 }]);
      }
    }
  };

  return (
    <>
      <select
        name="productSelect"
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleChangeProduct}
        ref={selectRef}
        defaultValue="p1"
      >
        {PRODUCT_LIST.map(product => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price.toLocaleString()}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleClickAddToCart}
      >
        추가
      </button>
    </>
  );
};
