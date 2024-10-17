import React, { useState, useEffect } from "react";

// Constants
const DISCOUNT_DAY = 2; // 화요일
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

// Types
type Product = {
  id: string;
  name: string;
  value: number;
  quantity: number;
  discount: number;
};

// Initial product list
const initialProducts: Product[] = [
  { id: "p1", name: "상품1", value: 10000, quantity: 50, discount: 0.1 },
  { id: "p2", name: "상품2", value: 20000, quantity: 30, discount: 0.15 },
  { id: "p3", name: "상품3", value: 30000, quantity: 20, discount: 0.2 },
  { id: "p4", name: "상품4", value: 15000, quantity: 0, discount: 0.05 },
  { id: "p5", name: "상품5", value: 25000, quantity: 10, discount: 0.25 },
];

const ShoppingCartApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [discountRate, setDiscountRate] = useState(0); // 최종 할인율

  // 장바구니 계산
  useEffect(() => {
    calculateCart();
  }, [cart, products]);

  // 장바구니 계산 함수
  const calculateCart = () => {
    let subTotal = 0;
    let total = 0;
    let itemCount = 0;
    let appliedDiscountRate = 0;

    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product) {
        let discount = 0;
        if (cartItem.quantity >= 10) {
          discount = product.discount; // 각 상품의 할인율 적용
        }
        const itemTotal = product.value * cartItem.quantity * (1 - discount);
        subTotal += itemTotal;
        itemCount += cartItem.quantity;
        total += itemTotal;

        appliedDiscountRate = Math.max(appliedDiscountRate, discount);
      }
    });

    // 화요일 10% 할인 적용
    if (new Date().getDay() === DISCOUNT_DAY) {
      total *= 0.9;
      appliedDiscountRate = Math.max(appliedDiscountRate, 0.1);
    }

    // 대량 구매 할인 적용
    const bulkDiscountRate = applyBulkDiscount(subTotal, itemCount);
    if (bulkDiscountRate) {
      total *= 1 - bulkDiscountRate;
      appliedDiscountRate = Math.max(appliedDiscountRate, bulkDiscountRate);
    }

    setTotalPrice(Math.round(total));
    setBonusPoints(Math.floor(total / 1000));
    setDiscountRate(appliedDiscountRate); // 최종 할인율 저장
  };

  // 대량 구매 할인 적용 함수
  const applyBulkDiscount = (subTotal: number, itemCount: number) => {
    return itemCount >= BULK_DISCOUNT_THRESHOLD ? BULK_DISCOUNT_RATE : 0;
  };

  // 상품 추가
  const addProductToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product && product.quantity > 0) {
      const existingItem = cart.find((item) => item.id === productId);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity <= product.quantity) {
          setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
          updateStock(productId, -1);
        } else {
          alert("재고가 부족합니다.");
        }
      } else {
        setCart([...cart, { id: productId, quantity: 1 }]);
        updateStock(productId, -1);
      }
    } else {
      alert("해당 상품은 품절입니다.");
    }
  };

  // 상품 제거
  const removeProductFromCart = (productId: string) => {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      setCart(cart.filter((item) => item.id !== productId));
      updateStock(productId, cartItem.quantity); // 재고 복구
    }
  };

  // 상품 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    const existingItem = cart.find((item) => item.id === productId);
    if (product && existingItem) {
      const diff = newQuantity - existingItem.quantity;
      if (newQuantity > 0 && newQuantity <= product.quantity + existingItem.quantity) {
        setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)));
        updateStock(productId, -diff);
      } else {
        alert("재고가 부족합니다.");
      }
    }
  };

  // 재고 업데이트
  const updateStock = (productId: string, quantityChange: number) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, quantity: p.quantity + quantityChange } : p)));
  };

  // 상품 추가 버튼 핸들러
  const handleAddToCart = () => {
    if (selectedProduct) {
      addProductToCart(selectedProduct);
    }
  };

  // 번개세일 및 추천 상품 타이머 설정
  useEffect(() => {
    const discountInterval = setInterval(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (randomProduct.quantity > 0 && Math.random() < 0.3) {
        const newPrice = Math.round(randomProduct.value * 0.8);
        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
        setProducts(products.map((p) => (p.id === randomProduct.id ? { ...p, value: newPrice } : p)));
      }
    }, 30000);

    const suggestionInterval = setInterval(() => {
      if (cart.length > 0) {
        const suggestion = products.find((p) => !cart.some((item) => item.id === p.id) && p.quantity > 0);
        if (suggestion) {
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          setProducts(products.map((p) => (p.id === suggestion.id ? { ...p, value: Math.round(p.value * 0.95) } : p)));
        }
      }
    }, 60000);

    return () => {
      clearInterval(discountInterval);
      clearInterval(suggestionInterval);
    };
  }, [cart, products]);

  return (
    <div className="app bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <div id="cart-items">
          {cart.map((cartItem) => {
            const product = products.find((p) => p.id === cartItem.id);
            if (!product) return null;
            return (
              <div key={cartItem.id} className="flex justify-between items-center mb-2">
                <span>
                  {product.name} - {product.value}원 x {cartItem.quantity}
                </span>
                <div>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}
                  >
                    -
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}
                  >
                    +
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => removeProductFromCart(cartItem.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {totalPrice}원{bonusPoints > 0 && <span className="text-blue-500 ml-2">(포인트: {bonusPoints})</span>}
          {discountRate > 0 && (
            <span className="text-green-500 ml-2">({(discountRate * 100).toFixed(1)}% 할인 적용)</span>
          )}
        </div>

        <div className="flex mb-4">
          <select
            id="product-select"
            className="border rounded p-2 mr-2"
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">상품을 선택하세요</option>
            {products.map((product) => (
              <option key={product.id} value={product.id} disabled={product.quantity === 0}>
                {product.name} - {product.value}원
              </option>
            ))}
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCart}>
            추가
          </button>
        </div>

        {products.map((product) => (
          <div key={product.id} className="text-sm text-gray-500 mt-2">
            {product.name}: {product.quantity > 0 ? `재고 (${product.quantity}개 남음)` : "품절"}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingCartApp;
