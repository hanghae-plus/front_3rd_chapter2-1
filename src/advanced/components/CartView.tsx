import React, { useState } from "react";
import CartList from "./CartList";
import { ItemType } from "../types/itemType";

const CartView = () => {
  const [cartItems, setCartItems] = useState<ItemType[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const PRODUCT_LIST = [
    { id: "p1", name: "상품1", value: 10000, quantity: 50 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10 },
  ];

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleClickAddButton = () => {
    const selectedItem = PRODUCT_LIST.find(item => item.id === selectedProductId);
    if (selectedItem) {
      const existingItem = cartItems.find(item => item.id === selectedProductId);
      if (existingItem) {
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === selectedProductId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        );
      } else {
        setCartItems(prevItems => [...prevItems, { ...selectedItem, quantity: 1 }]);
      }
    }
  };

  const handleUpdateQuantity = (id: string, change: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.quantity + change > 0
          ? { ...item, quantity: item.quantity + change }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <CartList
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      <select
        name="상품"
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleProductChange}
      >
        {PRODUCT_LIST.map(item => (
          <option value={item.id} key={item.id} disabled={item.quantity === 0}>
            {item.name + " - " + item.value + "원"}
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleClickAddButton}>
        추가
      </button>
    </div>
  );
};

export default CartView;
