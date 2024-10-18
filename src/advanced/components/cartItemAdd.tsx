import React, { useState } from "react";
import prodList from "../data/prodList";
import { useCart } from "../contexts/CartContext";

const CartItemAdd = () => {
  const [selectCartItem, setSelectCartItem] = useState(prodList[0]);
  const { addItem } = useCart();

  const handleSelectItem = (e) => setSelectCartItem(e.target.value);

  const handleAddToCart = (product: any) => {
    if (product.q > 0) {
      addItem(product);
    } else {
      alert("품절입니다.");
    }
  };

  return (
    <div>
      <select
        onChange={(e) => handleSelectItem(e)}
        className="border rounded p-2 mr-2"
      >
        {prodList.map((item) => (
          <option key={item.id}>
            {item.name} - {item.val}원
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={(e) =>
          handleAddToCart(
            prodList.find((prod) => prod.id === selectCartItem.id)!
          )
        }
      >
        추가
      </button>
    </div>
  );
};

export default CartItemAdd;
