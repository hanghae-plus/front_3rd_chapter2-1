import React, { ChangeEvent, useEffect, useState } from "react";
import "./index.css";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem {
  id: string;
  quantity: number;
}

type Cart = CartItem[];

const INITIAL_PRODUCT_LIST: Product[] = [
  { id: "p1", name: "상품1", price: 10000, stock: 50 },
  { id: "p2", name: "상품2", price: 20000, stock: 30 },
  { id: "p3", name: "상품3", price: 30000, stock: 20 },
  { id: "p4", name: "상품4", price: 15000, stock: 0 },
  { id: "p5", name: "상품5", price: 25000, stock: 10 },
];

function App() {
  const [productList, setProductList] = useState<Product[]>(INITIAL_PRODUCT_LIST);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(productList[0].id);
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart>([]);

  const [totalAmount, setTotalAmount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const onClickAddToCartButton = () => {
    if (!selectedProductId) return;

    if (!isStockLeft(selectedProductId)) {
      alert("재고가 부족합니다.");
    } else {
      updateCart(selectedProductId, +1);
    }

    setLastSelectedProductId(selectedProductId);
  };

  const updateProductList = (productId: string, change: number) => {
    const newProductList = productList.map((item) => {
      if (item.id === productId) return { ...item, stock: item.stock + change };
      else return item;
    });

    setProductList(newProductList);
  };

  const updateCart = (productId: string, change: number) => {
    const cartTargetItem = cart.find((item) => item.id === productId);

    if (cartTargetItem) {
      const newCart = cart
        .map((item) => {
          if (item.id === productId) return { ...item, quantity: item.quantity + change };
          else return item;
        })
        .filter((item) => item.quantity > 0);

      setCart(newCart);
    } else {
      setCart([...cart, { id: productId, quantity: change }]);
    }

    updateProductList(productId, change * -1);
  };

  const isStockLeft = (productId: string) => {
    const product = productList.find((product) => product.id === selectedProductId);
    if (!product || product.stock === 0) return false;
    else return true;
  };

  const onClickPlus = (productId: string) => () => {
    if (isStockLeft(productId)) updateCart(productId, +1);
    else return alert("재고가 부족합니다.");
  };

  const onClickMinus = (productId: string) => () => {
    updateCart(productId, -1);
  };

  const onClickRemove = (productId: string) => () => {
    const quantity = cart.find((item) => item.id === productId)?.quantity;
    if (!quantity) return;
    updateCart(productId, quantity * -1);
  };

  function calculateDiscountByItemQuantity(productId: string, quantity: number) {
    if (quantity < 10) return 0;
    switch (productId) {
      case "p1":
        return 0.1;
      case "p2":
        return 0.15;
      case "p3":
        return 0.2;
      case "p4":
        return 0.05;
      case "p5":
        return 0.25;
      default:
        return 0;
    }
  }

  const updateBonusPoints = (newTotalAmount: number) => {
    const newBonusPoints = Math.floor(newTotalAmount / 1000);
    setBonusPoints((prevPoints) => prevPoints + newBonusPoints);
  };

  const applyBulkDiscount = (subTotal: number, itemCount: number, totalAmount: number) => {
    let discountRate = 0;
    const isTuesday = new Date().getDay() === 2;

    if (itemCount >= 30) {
      let bulkDiscount = totalAmount * 0.25;
      let itemDiscount = subTotal - totalAmount;

      if (bulkDiscount > itemDiscount) {
        totalAmount = subTotal * (1 - 0.25);
        discountRate = 0.25;
      } else {
        discountRate = (subTotal - totalAmount) / subTotal;
      }
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }

    if (isTuesday) {
      totalAmount += 1 - 0.1;
      discountRate = Math.max(discountRate, 0.1);
    }

    setTotalAmount(totalAmount);
    setDiscountRate(discountRate);
    updateBonusPoints(totalAmount);
  };

  const calculateCart = () => {
    let totalAmount = 0;
    let itemCount = 0;
    let subTotal = 0;

    cart.map((item) => {
      const { quantity, id } = item;
      const product = productList.find((product) => product.id === id);
      if (!product) return;
      const { price } = product;

      const itemTotalPrice = price * quantity;
      const discountRate = calculateDiscountByItemQuantity(id, quantity);

      itemCount += quantity;
      subTotal += itemTotalPrice;

      totalAmount += itemTotalPrice * (1 - discountRate);
    });

    applyBulkDiscount(subTotal, itemCount, totalAmount);
  };

  useEffect(() => {
    calculateCart();
  }, [cart]);

  useEffect(() => {
    const luckySaleTimeout = setTimeout(() => {
      const luckySaleInterval = setInterval(() => {
        let saleProduct = productList[Math.floor(Math.random() * productList.length)];

        if (Math.random() < 0.3 && saleProduct.stock > 0) {
          const newProductList = productList.map((product) => {
            if (product.id === saleProduct.id) return { ...product, price: product.price * 0.8 };
            else return product;
          });
          setProductList(newProductList);
          alert(`번개세일! ${saleProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);

      return () => clearInterval(luckySaleInterval);
    }, Math.random() * 10000);

    return () => clearTimeout(luckySaleTimeout);
  }, []);

  useEffect(() => {
    const suggestionTimeout = setTimeout(() => {
      const suggestionInterval = setInterval(() => {
        if (lastSelectedProductId) {
          let suggestedProduct = productList.find(
            (product) => product.id !== lastSelectedProductId && product.stock > 0,
          );
          if (suggestedProduct) {
            const newProductList = productList.map((product) => {
              if (product.id === suggestedProduct.id)
                return { ...product, price: product.price * 0.95 };
              else return product;
            });
            setProductList(newProductList);
            alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, 60000);

      return () => clearInterval(suggestionInterval);
    }, Math.random() * 20000);

    return () => clearTimeout(suggestionTimeout);
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cart.map((item) => {
            const { quantity, id } = item;
            const product = productList.find((product) => product.id === id);
            if (!product) return null;
            const { name, price } = product;
            return (
              <div key={id} id={id} className="flex justify-between items-center mb-2">
                <span>
                  {name} - {price}원 x {quantity}
                </span>
                <div>
                  <button
                    className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={onClickMinus(id)}
                  >
                    -
                  </button>
                  <button
                    className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                    onClick={onClickPlus(id)}
                  >
                    +
                  </button>
                  <button
                    className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                    onClick={onClickRemove(id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          총액: {Math.round(totalAmount)}원
          {discountRate > 0 && (
            <span className="text-green-500 ml-2">
              ({(discountRate * 100).toFixed(1)}% 할인 적용)
            </span>
          )}
          {bonusPoints > 0 && (
            <span id="loyalty-points" className="text-blue-500 ml-2">
              (포인트: {bonusPoints})
            </span>
          )}
        </div>
        <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelect}>
          {productList.map((product) => (
            <option
              key={"select-option-" + product.id}
              value={product.id}
              disabled={product.stock === 0}
            >
              {product.name} - {product.price}원
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClickAddToCartButton}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {productList.map((product) => {
            const { stock } = product;
            if (stock < 5)
              return `${product.name}: ${stock > 0 ? `재고부족 (${stock}개 남음)` : "품절"}`;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
