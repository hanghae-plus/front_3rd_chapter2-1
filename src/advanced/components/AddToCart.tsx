import React from 'react';
import { useAppContext } from '../context/appContext';
import { ALERT_SHORT_STOCK } from '../ts/constants/constants';

export const AddToCart = () => {
  const { productList, selectedProductId, setCartProductList, setProductList } = useAppContext();

  const handleAddToCart = () => {
    const addToCartProduct = productList.find((product) => product.id === selectedProductId);
    if (addToCartProduct && addToCartProduct.stock === 0) {
      alert(ALERT_SHORT_STOCK);
      return;
    }
    let newQuantity = 0;
    if (addToCartProduct) {
      setCartProductList((prev) => {
        const existingProduct = prev.find((product) => product.id === addToCartProduct.id);

        if (existingProduct) {
          newQuantity = existingProduct.stock + 1;

          return prev.map((product) =>
            product.id === existingProduct.id ? { ...product, stock: newQuantity } : product,
          );
        } else {
          return [...prev, { ...addToCartProduct, stock: 1 }];
        }
      });

      if (0 > newQuantity) {
        return;
      }
      setProductList((prevProductList) =>
        prevProductList.map((product) => {
          if (product.id === addToCartProduct.id) {
            const updatedStock = product.stock - 1;
            return { ...product, stock: updatedStock };
          }
          return product;
        }),
      );
    }
  };

  return (
    <div>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCart}>
        추가
      </button>
    </div>
  );
};
