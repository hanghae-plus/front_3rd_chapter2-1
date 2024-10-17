import React, { useState } from "react";
import { productConst } from "../const";
import { Item } from "./CartItemAdit";

export interface ItemSelecterProps {
  selectedProducts: Item[];
  setSelectedProducts: React.Dispatch<React.SetStateAction<Item[]>>;
}

const ItemSelecter: React.FC<ItemSelecterProps> = ({ selectedProducts, setSelectedProducts }) => {
  const { PRODUCT_LIST } = productConst;
  const [selectedProduct, setSelectedProduct] = useState<Item>({
    id: "",
    name: "",
    price: 0,
    quantity: 0,
  });

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedItem = PRODUCT_LIST.find((item) => item.id === selectedId);

    if (!selectedItem) return;
    setSelectedProduct(selectedItem);
  };

  const handleAddItemButton = () => {
    if (!selectedProduct.id || selectedProduct.quantity === 0) {
      return;
    }

    // 상품이 이미 장바구니에 있는지 확인
    const productIndex = selectedProducts.findIndex((item) => item.id === selectedProduct.id);

    if (productIndex !== -1) {
      const updatedProducts = selectedProducts.map((item, index) =>
        index === productIndex ? { ...item, quantity: item.quantity + 1 } : item,
      );
      setSelectedProducts(updatedProducts);
    } else {
      // 새로운 상품 추가
      setSelectedProducts([...selectedProducts, { ...selectedProduct, quantity: 1 }]);
    }
  };

  return (
    <div>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProduct.id}
        onChange={handleSelectChange}
      >
        <option value="">상품을 선택하세요</option>
        {PRODUCT_LIST.map((item) => (
          <option key={item.id} value={item.id} disabled={item.quantity === 0}>
            {item.name} - {item.price}원
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddItemButton}
      >
        추가
      </button>
    </div>
  );
};

export default ItemSelecter;
