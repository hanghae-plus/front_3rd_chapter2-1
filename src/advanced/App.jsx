import React, { useState, useEffect } from "react";

const DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

const initialItemList = [
  { id: "p1", name: "상품1", price: 10000, stock: 50 },
  { id: "p2", name: "상품2", price: 20000, stock: 30 },
  { id: "p3", name: "상품3", price: 30000, stock: 20 },
  { id: "p4", name: "상품4", price: 15000, stock: 0 },
  { id: "p5", name: "상품5", price: 25000, stock: 10 },
];

const App = () => {
  const [itemList, setItemList] = useState(initialItemList);
  const [cartItems, setCartItems] = useState([]);
  const [gTotalAmt, setGTotalAmt] = useState(0);
  const [gBonusPts, setGBonusPts] = useState(0);
  const [gLastSel, setGLastSel] = useState(null);

  useEffect(() => {
    const interval = setInterval(showSaleAlert, 30000);
    return () => clearInterval(interval);
  }, [itemList]);

  useEffect(() => {
    calcCart();
  }, [cartItems]);

  const showSaleAlert = () => {
    const luckyItem = itemList[Math.floor(Math.random() * itemList.length)];
    if (Math.random() < 0.3 && luckyItem.stock > 0) {
      updateItemPrice(luckyItem.id, 0.2);
      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    }
  };

  const updateItemPrice = (id, discountRate) => {
    setItemList((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, price: Math.round(item.price * (1 - discountRate)) }
          : item
      )
    );
  };

  const handleAddCart = (selectedItemId) => {
    const targetItem = itemList.find((item) => item.id === selectedItemId);
    if (targetItem && targetItem.stock > 0) {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === selectedItemId);
        if (existingItem) {
          return prev.map((item) =>
            item.id === selectedItemId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...targetItem, quantity: 1 }];
      });
      targetItem.stock--;
      setGLastSel(selectedItemId);
    }
  };

  const calcCart = () => {
    let subtotal = 0;
    let itemCount = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      itemCount += item.quantity;
    });

    const bulkDiscount =
      itemCount >= BULK_DISCOUNT_THRESHOLD ? BULK_DISCOUNT_RATE : 0;
    const totalAmount = subtotal * (1 - bulkDiscount);
    setGTotalAmt(totalAmount);
    setGBonusPts(Math.floor(totalAmount / 1000));
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartItems.map((item) => (
            <div key={item.id}>
              {item.name} - {item.price}원 x {item.quantity}
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {Math.round(gTotalAmt)}원 (포인트: {gBonusPts})
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          onChange={(e) => handleAddCart(e.target.value)}
        >
          {itemList.map((item) => (
            <option key={item.id} value={item.id} disabled={item.stock === 0}>
              {item.name} - {item.price}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() =>
            handleAddCart(document.getElementById("product-select").value)
          }
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {itemList.map((item) => (
            <div key={item.id}>
              {item.name}: {item.stock > 0 ? `${item.stock}개 남음` : "품절"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
