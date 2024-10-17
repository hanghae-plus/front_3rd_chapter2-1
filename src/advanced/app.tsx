import React, { useState } from "react";

const PRODUCT_LIST: ProductType[] = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
] as const;

interface ProductType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItemType extends ProductType {
  itemCount: number;
}

const App = () => (
  <div className="bg-gray-100 p-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItemList />
    </div>
  </div>
);

export default App;

const CartItemList = () => {
  const [selectedProductId, setSelectedProductId] = useState<string>("p1");
  const [cartItemList, setCartItemList] = useState<CartItemType[]>([]);

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const handleClickAddToCart = (productId: string) => {
    const hasCartItem = cartItemList.some(item => item.id === productId);

    if (hasCartItem) {
      alert("이미 장바구니에 있는 상품입니다.");
      return;
    }

    const selectedProduct = PRODUCT_LIST.find(p => p.id === productId);
    if (selectedProduct !== undefined) {
      setCartItemList(prev => [...prev, { ...selectedProduct, itemCount: 1 }]);
    }
  };

  // FIXME: Rate들 수정해야 함
  const BONUS_POINT_RATE = 0.05;
  const DISCOUNT_RATE = 0.1;

  const totalAmount =
    cartItemList.reduce((acc, item) => acc + item.price * item.itemCount, 0) * (1 - DISCOUNT_RATE);
  const bonusPoint = totalAmount * BONUS_POINT_RATE;

  return (
    <>
      <div id="cart-items">
        {cartItemList?.map(cartItem => (
          <CartItem key={cartItem.id} cartItem={cartItem} setCartItemList={setCartItemList} />
        ))}
      </div>

      <div id="cart-total" className="text-xl font-bold my-4">
        총액: {totalAmount.toLocaleString()}원
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: {bonusPoint})
        </span>
      </div>

      {/* FIXME: select에서 가능하면 상태 걷어내기 */}
      <select
        name="productSelect"
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProductId}
        onChange={handleChangeProduct}
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
        onClick={() => handleClickAddToCart(selectedProductId)}
      >
        추가
      </button>
      <div id="stock-status" className="text-sm text-gray-500 mt-2">
        {cartItemList?.map(cartItem => {
          const CRITICAL_STOCK_QUANTITY = 5;
          const stockCritical = cartItem.quantity - cartItem.itemCount <= CRITICAL_STOCK_QUANTITY;

          return (
            stockCritical && (
              <div key={cartItem.id}>
                {`${cartItem.name}: ${cartItem.quantity > 0 ? `재고 부족 (${cartItem.quantity - cartItem.itemCount}개 남음)` : "품절"}`}
              </div>
            )
          );
        })}
      </div>
    </>
  );
};

interface CartItemPropsType {
  cartItem: CartItemType;
  setCartItemList: React.Dispatch<React.SetStateAction<CartItemType[]>>;
}

const CartItem = (props: CartItemPropsType) => {
  const { cartItem, setCartItemList } = props;
  const { id, name, price, itemCount } = cartItem;

  const currentProduct = PRODUCT_LIST.find(product => product.id === id);

  const handleClickDecrease = () => {
    if (itemCount > 1) {
      setCartItemList(prev =>
        prev.map(item => (item.id === id ? { ...item, itemCount: itemCount - 1 } : item)),
      );
    }
  };
  const handleClickIncrease = () => {
    if (itemCount === currentProduct?.quantity) {
      alert("재고가 부족합니다.");
      return;
    }

    setCartItemList(prev =>
      prev.map(item => (item.id === id ? { ...item, itemCount: itemCount + 1 } : item)),
    );
  };
  const handleClickRemove = () => {
    setCartItemList(prev => prev.filter(item => item.id !== id));
  };

  if (itemCount === 0) {
    return null;
  }

  return (
    <div id={id} className="flex justify-between items-center mb-2">
      <span>
        {name} - {price.toLocaleString()}원 x {itemCount}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleClickDecrease()}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => handleClickIncrease()}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => handleClickRemove()}
        >
          삭제
        </button>
      </div>
    </div>
  );
};
