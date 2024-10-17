import React, { useState, useEffect, useRef } from "react";

const TWICE = 2;
const TEN = 10;
const SECOND_BY_MILLISECOND = 1000;
const SECOND_TO_MINUTE = 60;

const LUCKY_SALE_RANGE_TERM = SECOND_BY_MILLISECOND * SECOND_TO_MINUTE;
const LUCKY_SALE_END_TERM = SECOND_BY_MILLISECOND * TEN * Math.random();
const SUGGEST_RANGE_TERM = (SECOND_BY_MILLISECOND * SECOND_TO_MINUTE) / TWICE;
const SUGGEST_END_TERM = SECOND_BY_MILLISECOND * TWICE * TEN * Math.random();

const LUCKY_SALE_SUCCESS_RATE = 0.3;
const LUCKY_SALE_DISCOUNT_RATE = 0.8;
const SUGGEST_DISCOUNT_RATE = 0.95;
const DISCOUNT_START_QUANTITY = 10;

const PRODUCT_DISCOUNT_RATE = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 } as const;

const BULK_DISCOUNT_START_QUANTITY = 30;
const BULK_DISCOUNT_RATE = 0.25;

const DATE_TO_TUESDAY = 2;
const TUESDAY_DISCOUNT_RATE = 0.1;
const RATE_TO_PERCENT = 100;

const POINT_PER_AMOUNT = 1000;
const STOCK_QUANTITY_TO_INFO = 5;

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
  const lastSelectedItemRef = useRef<string | null>(null);

  const handleChangeProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    lastSelectedItemRef.current = selectedProductId; // 이전 선택된 상품 ID 저장
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

  const BONUS_POINT_RATE = 0.05;

  const totalAmount = cartItemList.reduce((acc, item) => {
    const itemDiscountRate =
      item.itemCount >= DISCOUNT_START_QUANTITY ? PRODUCT_DISCOUNT_RATE[item.id] || 0 : 0;
    return acc + item.price * item.itemCount * (1 - itemDiscountRate);
  }, 0);

  const subAmount = cartItemList.reduce((acc, item) => acc + item.price * item.itemCount, 0);

  let discountRate = 0;

  if (subAmount > 0) {
    discountRate = (subAmount - totalAmount) / subAmount;
  }

  if (cartItemList.reduce((acc, item) => acc + item.itemCount, 0) >= BULK_DISCOUNT_START_QUANTITY) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    const itemDiscount = subAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  if (new Date().getDay() === DATE_TO_TUESDAY) {
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  const bonusPoint = totalAmount * BONUS_POINT_RATE;

  useEffect(() => {
    let luckySaleInterval: NodeJS.Timeout;
    let suggestInterval: NodeJS.Timeout;

    const startLuckySale = () => {
      luckySaleInterval = setInterval(() => {
        const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];

        if (Math.random() < LUCKY_SALE_SUCCESS_RATE && luckyItem.quantity > 0) {
          const discountedPrice = Math.round(luckyItem.price * LUCKY_SALE_DISCOUNT_RATE);
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

          setCartItemList(prev =>
            prev.map(item =>
              item.id === luckyItem.id ? { ...item, price: discountedPrice } : item,
            ),
          );
        }
      }, LUCKY_SALE_RANGE_TERM);
    };

    const startSuggest = () => {
      suggestInterval = setInterval(() => {
        if (lastSelectedItemRef.current) {
          const suggest = PRODUCT_LIST.find(
            item => item.id !== lastSelectedItemRef.current && item.quantity > 0,
          );

          if (suggest) {
            const discountedPrice = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
            alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

            setCartItemList(prev =>
              prev.map(item =>
                item.id === suggest.id ? { ...item, price: discountedPrice } : item,
              ),
            );
          }
        }
      }, SUGGEST_RANGE_TERM);
    };

    const luckySaleTimeout = setTimeout(startLuckySale, LUCKY_SALE_END_TERM);
    const suggestTimeout = setTimeout(startSuggest, SUGGEST_END_TERM);

    return () => {
      clearTimeout(luckySaleTimeout);
      clearTimeout(suggestTimeout);
      clearInterval(luckySaleInterval);
      clearInterval(suggestInterval);
    };
  }, []);

  return (
    <>
      <div id="cart-items">
        {cartItemList?.map(cartItem => (
          <CartItem key={cartItem.id} cartItem={cartItem} setCartItemList={setCartItemList} />
        ))}
      </div>

      <div id="cart-total" className="text-xl font-bold my-4">
        총액: {totalAmount.toLocaleString()}원
        {discountRate > 0 && (
          <span id="discount-info" className="text-green-500 ml-2">
            ({(discountRate * RATE_TO_PERCENT).toFixed(1)}% 할인 적용)
          </span>
        )}
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
          const currentProduct = PRODUCT_LIST.find(product => product.id === cartItem.id);

          if (currentProduct === undefined) {
            return null;
          }

          const CRITICAL_STOCK_QUANTITY = 5;
          const stockCritical =
            currentProduct.quantity - cartItem.itemCount <= CRITICAL_STOCK_QUANTITY;

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

  const itemDiscountRate = PRODUCT_DISCOUNT_RATE[id] || 0;
  const discountedPrice = price * (1 - itemDiscountRate);

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
        {name} - {discountedPrice.toLocaleString()}원 x {itemCount}
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
