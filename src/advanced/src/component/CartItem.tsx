import React from "react";
import { Item } from "./CartItemAdit";
import { ItemSelecterProps } from "./ItemSelecter";

const CartItem: React.FC<ItemSelecterProps> = ({ selectedProducts, setSelectedProducts }) => {
  const handelChangeQuantity = (id: string, change: number) => {
    const updatedProducts = selectedProducts
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity + change,
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setSelectedProducts([...updatedProducts]);
  };

  const handelRemoveItem = (id: string, selectedProducts: Item[]) => {
    const removeItem = selectedProducts.filter((item) => {
      return item.id !== id;
    });

    setSelectedProducts([...removeItem]);
  };

  return (
    <div id="cart-items">
      {selectedProducts.length > 0
        ? selectedProducts.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2">
              <span>
                {item.name} - {item.price}원 x {item.quantity}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handelChangeQuantity(item.id, -1)}
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handelChangeQuantity(item.id, 1)}
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handelRemoveItem(item.id, selectedProducts)}
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default CartItem;
