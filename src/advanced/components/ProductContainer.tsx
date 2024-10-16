import React, { ChangeEvent, useState } from "react";
import ProductCart from "./ProductCart";

export interface ProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const productList: ProductType[] = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

const ProductContainer = () => {
  const [selectProduct, setSelectProduct] = useState<ProductType>(productList[0]);

  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const newProduct = productList.find(product => product.id === e.target.value);
    if (newProduct !== undefined) {
      setSelectProduct(newProduct);
    }
  };

  const remainedStock = () => {
    const MAX_PRODUCT_QUANTITY = 5;
    const textContent = productList
      .filter(product => product.quantity < MAX_PRODUCT_QUANTITY)
      .reduce((acc, product) => {
        const quantityStatus =
          product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절";
        // eslint-disable-next-line prefer-template
        return acc + `${product.name}: ${quantityStatus}\n`;
      }, "");
    return textContent;
  };

  return (
    <>
      <ProductCart selectProduct={selectProduct} />
      <select onChange={handleChangeSelect} className="border rounded p-2 mr-2" id="product-select">
        {productList.map(product => (
          <option
            value={product.id}
            key={product.id}
          >{`${product.name} - ${product.price}원`}</option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" id="add-to-cart">
        추가
      </button>
      <div className="text-sm text-gray-500 mt-2" id="stock-status">
        {remainedStock()}
      </div>
    </>
  );
};

export default ProductContainer;
