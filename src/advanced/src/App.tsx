import React, { useEffect, useState } from "react";
import { Cart, Product } from "./types";
import CartDisplay from "./components/CartDisplay";
import ProductSelect from "./components/ProductSelect";
import StockInfo from "./components/StockInfo";
import BonusPoints from "./components/BonusPoints";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "p1", name: "상품1", price: 10000, quantity: 50 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10 },
  ]);

  const [cart, setCart] = useState<Cart[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);

  const calculateCart = () => {
    let total = 0;
    let itemCount = 0;
    let subTotal = 0;

    const updatedCart = cart.map((item) => {
      let discount = 0;
      if (item.cartQuantity >= 10) {
        switch (item.id) {
          case "p1":
            discount = 0.1;
            break;
          case "p2":
            discount = 0.15;
            break;
          case "p3":
            discount = 0.2;
            break;
          case "p4":
            discount = 0.05;
            break;
          case "p5":
            discount = 0.25;
            break;
          default:
            discount = 0;
        }
      }
      const itemTotal = item.price * item.cartQuantity;
      subTotal += itemTotal;
      total += itemTotal * (1 - discount);
      itemCount += item.cartQuantity;
      return { ...item };
    });

    let bulkDiscount = 0;
    if (itemCount >= 30) {
      bulkDiscount = totalAmount * 0.25;
    }
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      total = subTotal * (1 - 0.25);
      setDiscountRate(0.25);
    } else {
      setDiscountRate((subTotal - total) / subTotal);
    }

    const today = new Date().getDay();
    if (today === 2) {
      total *= 0.9;
    }

    setTotalAmount(Math.round(total));
    setBonusPoints(bonusPoints + Math.floor(total / 1000));
  };

  // Update stock status
  const getLowStockInfo = () => {
    return products
      .filter((product) => product.quantity < 5)
      .map(
        (product) =>
          `${product.name}: ${
            product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"
          }`,
      )
      .join("\n");
  };

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity === 0) {
      alert("재고가 부족합니다.");
      return;
    }

    const existingCartItem = cart.find((item) => item.id === productId);
    if (existingCartItem) {
      if (existingCartItem.cartQuantity < product.quantity) {
        setCart(
          cart.map((item) =>
            item.id === productId ? { ...item, cartQuantity: item.cartQuantity + 1 } : item,
          ),
        );
        setProducts(
          products.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p)),
        );
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - 1 } : p)),
      );
    }
    setLastSelectedProductId(productId);
  };

  const updateCart = (productId: string, change: number) => {
    const cartItem = cart.find((item) => item.id === productId);
    const product = products.find((p) => p.id === productId);

    if (!cartItem || !product) return;

    const newQuantity = cartItem.cartQuantity + change;

    if (change === -1 && newQuantity === 0) {
      // Remove item from cart
      setCart(cart.filter((item) => item.id !== productId));
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + cartItem.cartQuantity } : p,
        ),
      );
    } else if (newQuantity > 0 && newQuantity <= product.quantity + cartItem.cartQuantity) {
      // Update quantity
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, cartQuantity: item.cartQuantity + change } : item,
        ),
      );
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, quantity: p.quantity - change } : p)),
      );
    } else {
      alert("재고가 부족합니다.");
    }
  };

  const removeFromCart = (productId: string) => {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
      setCart(cart.filter((item) => item.id !== productId));
      setProducts(
        products.map((p) =>
          p.id === productId ? { ...p, quantity: p.quantity + cartItem.cartQuantity } : p,
        ),
      );
    }
  };

  useEffect(() => {
    const lightningSaleTimeout = setTimeout(() => {
      const lightningInterval = setInterval(() => {
        const availableProducts = products.filter((p) => p.quantity > 0);
        if (availableProducts.length === 0) return;

        const luckyItem = availableProducts[Math.floor(Math.random() * availableProducts.length)];
        if (Math.random() < 0.3) {
          const discountedPrice = Math.round(luckyItem.price * 0.8);
          setProducts((prev) =>
            prev.map((p) => (p.id === luckyItem.id ? { ...p, price: discountedPrice } : p)),
          );
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);
      return () => clearInterval(lightningInterval);
    }, Math.random() * 10000);

    // Suggestion every ~20-80 seconds
    const suggestionTimeout = setTimeout(() => {
      const suggestionInterval = setInterval(() => {
        if (lastSelectedProductId) {
          const suggestions = products.filter(
            (p) => p.id !== lastSelectedProductId && p.quantity > 0,
          );
          if (suggestions.length === 0) return;

          const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          const discountedPrice = Math.round(suggestion.price * 0.95);
          setProducts((prev) =>
            prev.map((p) => (p.id === suggestion.id ? { ...p, price: discountedPrice } : p)),
          );
        }
      }, 60000);
      return () => clearInterval(suggestionInterval);
    }, Math.random() * 20000);

    return () => {
      clearTimeout(lightningSaleTimeout);
      clearTimeout(suggestionTimeout);
    };
  }, []);

  useEffect(() => {
    calculateCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, products]);

  return (
    // container
    <div className="bg-gray-100 p-8">
      {/* wrap */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        {/* title */}
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        {/* cartDisplay */}
        <CartDisplay cart={cart} onQuantityChange={updateCart} onRemove={removeFromCart} />
        {/* sum */}
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {totalAmount}원
          {discountRate > 0 && (
            <span className="text-green-500 ml-2">
              ({(discountRate * 100).toFixed(1)}% 할인 적용)
            </span>
          )}
          <BonusPoints points={bonusPoints} />
        </div>
        {/* select */}
        <ProductSelect products={products} onAdd={addToCart} />
        {/* stockInfo */}
        <StockInfo info={getLowStockInfo()} />
      </div>
    </div>
  );
};

export default App;
