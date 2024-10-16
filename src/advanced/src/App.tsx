import React, { useState, useMemo } from "react";
import { Product } from "./types";
import { useRecommendation } from "./hooks/useRecommendation";
import { useRandomDiscount } from "./hooks/useRandomDiscount";
import CartList from "./components/Cart/CartList";
import CartTotal from "./components/Cart/CartTotal";
import ProductSelector from "./components/ProductSelector";
import StockStatus from "./components/StockStatus";
import { DISCOUNT_THRESHOLDS, initialProductList } from "./constants";

const App: React.FC = () => {
  const [productList, setProductList] = useState<Product[]>(initialProductList);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const [selectProductId, setSelectProductId] = useState<string>(productList[0].id);

  // 추천 상품 추가
  useRecommendation({ productList, selectProductId });
  // 랜덤 할인 적용
  useRandomDiscount({ productList, setProductList });

  const calculateDiscountRate = useMemo(() => {
    const totalQuantity = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
    let discountRate = 0;

    // 개별 상품 할인
    cartItems.forEach((item) => {
      if (item.quantity >= 10 && item.id in DISCOUNT_THRESHOLDS) {
        discountRate = Math.max(
          discountRate,
          DISCOUNT_THRESHOLDS[item.id as keyof typeof DISCOUNT_THRESHOLDS],
        );
      }
    });

    // 대량 구매 할인
    if (totalQuantity >= 30) {
      discountRate = Math.max(discountRate, 0.25);
    }

    // 화요일 할인
    if (new Date().getDay() === 2) {
      discountRate = Math.max(discountRate, 0.1);
    }

    return discountRate;
  }, [cartItems]);

  // 총액 계산
  const totalPrice = useMemo(() => {
    const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    return subtotal * (1 - calculateDiscountRate);
  }, [cartItems, calculateDiscountRate]);

  const AddToCart = () => {
    const product = productList.find((product) => product.id === selectProductId);

    if (!product || product.quantity <= 0) return;

    // 장바구니 아이템 추가
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // 상품 목록 수량 업데이트
    setProductList((prevList) =>
      prevList.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p)),
    );

    const newPoints = Math.floor((totalPrice + product.price) / 1000);

    setAccumulatedPoints((prevPoints) => prevPoints + newPoints);
  };

  // 장바구니 아이템 삭제
  const removeCartItem = (productId: string) => {
    setCartItems((prevCart) => prevCart.filter((item) => item.id !== productId));
    setProductList((prevList) =>
      prevList.map((product) =>
        product.id === productId
          ? {
              ...product,
              quantity:
                initialProductList.find((product) => product.id === productId)?.quantity || 0,
            }
          : product,
      ),
    );
  };

  const updateCartItemQuantity = (productId: string, change: number) => {
    const product = cartItems.find((product) => product.id === productId);

    if (!product) return;

    // 장바구니 아이템 수량 변경
    setCartItems((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
        )
        .filter((item) => item.quantity > 0);

      // 장바구니 아이템 수량 변경에 따른 상품 목록 수량 업데이트
      setProductList((prevList) =>
        prevList.map((product) =>
          product.id === productId ? { ...product, quantity: product.quantity - change } : product,
        ),
      );

      return updatedCart;
    });

    // 포인트 추가
    if (change > 0) {
      const newPoints = Math.floor((totalPrice + product.price) / 1000);

      setAccumulatedPoints((prevPoints) => prevPoints + newPoints);
    }
  };

  return (
    <main>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartList
          cartItems={cartItems}
          updateCartItemQuantity={updateCartItemQuantity}
          removeCartItem={removeCartItem}
        />
        <CartTotal
          totalPrice={totalPrice}
          accumulatedPoints={accumulatedPoints}
          discountRate={calculateDiscountRate}
        />
        <ProductSelector
          productList={productList}
          selectProductId={selectProductId}
          setSelectProductId={setSelectProductId}
          AddToCart={AddToCart}
        />
        <StockStatus productList={productList} />
      </div>
    </main>
  );
};

export default App;
