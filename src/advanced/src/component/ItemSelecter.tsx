import React, { useEffect, useState } from "react";
import { productConst } from "../const";

interface Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ItemSelecter = () => {
  const { PRODUCT_LIST } = productConst;
  const [productList, setProductList] = useState<Item[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  const updateSelectOptions = (list: Item[]) => {
    setProductList(list);
  };

  useEffect(() => {
    const ProductList: Item[] = PRODUCT_LIST;
    console.log("ProductList", ProductList);

    updateSelectOptions(ProductList);
  }, []);

  return (
    <div>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {productList.map((item) => (
          <option key={item.id} value={item.id} disabled={item.quantity === 0}>
            {item.name} - {item.price}원
          </option>
        ))}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </div>
  );
};

export default ItemSelecter;
