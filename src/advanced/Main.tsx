import React, { useState, useEffect } from "react";

const TUESDAY = 2;
const TUESDAY_DISCOUNT = 0.1;
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const LOYALTY_POINTS_THRESHOLD = 1000;
const LUCKY_SALE_RATE = 0.8;
const LUCKY_SALE_PROBABILITY = 0.3;
const SUGGESTED_SALE_RATE = 0.95;
const QUANTITY_DISCOUNT_KEYS = ["p1", "p2", "p3", "p5"] as const;
type DiscountKey = (typeof QUANTITY_DISCOUNT_KEYS)[number];
const QUANTITY_DISCOUNTS: Record<DiscountKey, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p5: 0.25,
};

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem {
  id: string;
  quantity: number;
}

const Main: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string>("p1");
  const [lastSelectedProduct, setLastSelectedProduct] = useState<string | null>(
    null
  );
  const [stockStatus, setStockStatus] = useState<string>("");

  useEffect(() => {
    // 상품 목록 초기화
    setProductList([
      { id: "p1", name: "상품1", price: 10000, quantity: 50 },
      { id: "p2", name: "상품2", price: 20000, quantity: 30 },
      { id: "p3", name: "상품3", price: 30000, quantity: 20 },
      { id: "p4", name: "상품4", price: 15000, quantity: 0 },
      { id: "p5", name: "상품5", price: 25000, quantity: 10 },
    ]);
  }, []);

  useEffect(() => {
    calculateCartTotal();
  }, [cartItems]);

  useEffect(() => {
    const luckySaleInterval = setInterval(handleLuckySale, 30000);
    const suggestedSaleInterval = setInterval(handleSuggestedSale, 60000);

    return () => {
      clearInterval(luckySaleInterval);
      clearInterval(suggestedSaleInterval);
    };
  }, [lastSelectedProduct, productList]);

  const calculateCartTotal = () => {
    let subtotal = 0;
    let total = 0;
    let discountTotal = 0;

    // 장바구니 아이템마다 할인 적용 후 계산
    cartItems.forEach((cartItem) => {
      const product = productList.find((p) => p.id === cartItem.id);
      if (product) {
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;
        const discount = calculateDiscount(product, cartItem.quantity); // 할인율 계산
        discountTotal += itemTotal * discount; // 총 할인액 계산
        total += itemTotal * (1 - discount); // 할인 적용 후 금액
      }
    });

    setTotalAmount(total);
    setDiscountAmount(discountTotal);
    setBonusPoints(
      (prev) => prev + Math.floor(total / LOYALTY_POINTS_THRESHOLD)
    );

    // 대량 구매 할인 및 화요일 할인 적용
    applyBulkDiscount(subtotal);
    applyTuesdayDiscount();
  };

  const applyBulkDiscount = (subtotal: number) => {
    if (cartItems.length >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = subtotal * BULK_DISCOUNT_RATE;
      setTotalAmount((prev) => Math.min(prev, subtotal - bulkDiscount));
    }
  };

  const applyTuesdayDiscount = () => {
    if (new Date().getDay() === TUESDAY) {
      setTotalAmount((prev) => prev * (1 - TUESDAY_DISCOUNT));
    }
  };

  const calculateDiscount = (product: Product, quantity: number): number => {
    if (
      quantity >= 10 &&
      QUANTITY_DISCOUNT_KEYS.includes(product.id as DiscountKey)
    ) {
      return QUANTITY_DISCOUNTS[product.id as DiscountKey] || 0;
    }
    return 0;
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cartItems.find((item) => item.id === selectedProduct);
    const product = productList.find((p) => p.id === selectedProduct);

    if (product && product.quantity > 0) {
      if (existingItem) {
        const updatedItems = cartItems.map((item) =>
          item.id === selectedProduct && item.quantity < product.quantity
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCartItems(updatedItems);
      } else {
        setCartItems([...cartItems, { id: selectedProduct, quantity: 1 }]);
      }
      setProductList(
        productList.map((p) =>
          p.id === selectedProduct ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
      setLastSelectedProduct(selectedProduct);
    }
  };

  const handleQuantityChange = (productId: string, change: number) => {
    const product = productList.find((p) => p.id === productId);
    if (product) {
      const updatedCart = cartItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0);
      setCartItems(updatedCart);

      setProductList(
        productList.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity - change } : p
        )
      );
    }
  };
  const handleLuckySale = () => {
    const luckyItem =
      productList[Math.floor(Math.random() * productList.length)];
    if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quantity > 0) {
      luckyItem.price = Math.round(luckyItem.price * LUCKY_SALE_RATE); // 20% 할인
      alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
      setProductList([...productList]); // 상품 목록 업데이트
    }
  };

  const handleSuggestedSale = () => {
    if (lastSelectedProduct) {
      const suggestedItem = productList.find(
        (item) => item.id !== lastSelectedProduct && item.quantity > 0
      );
      if (suggestedItem) {
        suggestedItem.price = Math.round(
          suggestedItem.price * SUGGESTED_SALE_RATE
        ); // 5% 할인
        alert(
          `${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        setProductList([...productList]); // 상품 목록 업데이트
      }
    }
  };

  const discountInfo = { total: totalAmount, discountAmount: discountAmount };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div className="text-xl font-bold my-4">
          총액: {totalAmount}원
          {discountInfo.discountAmount > 0 && (
            <span className="text-green-500 ml-2">
              (할인 적용: {Math.round(discountInfo.discountAmount)}원)
            </span>
          )}
          <span id="loyalty-points" className="text-blue-500 ml-2">
            (포인트: {bonusPoints})
          </span>
        </div>
        <select
          className="border rounded p-2 mr-2"
          onChange={(e) => setSelectedProduct(e.target.value)}
          value={selectedProduct}
        >
          {productList.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity === 0}
            >
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddToCart}
        >
          추가
        </button>

        <div className="my-4">
          {cartItems.map((item) => {
            const product = productList.find((p) => p.id === item.id);
            return (
              <div
                key={item.id}
                className="flex justify-between items-center mb-2"
              >
                <span>
                  {product?.name} - {product?.price}원 x {item.quantity}
                </span>
                <div>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() =>
                      handleQuantityChange(item.id, -item.quantity)
                    }
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-sm text-gray-500 mt-2">{stockStatus}</div>
      </div>
    </div>
  );
};

export default Main;
