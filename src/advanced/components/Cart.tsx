import { CartItem } from "./CartItem";
import { CartSelectList } from "./CartSelectList";
import { CartSummary } from "./CartSummary";
import { productList } from "./data/productList";
import { ProductList } from "../types/product";
import React, { useCallback, useEffect, useState } from "react";
import { calculateTotalPrice, updateQuantity } from "../service/cartService";

export const Cart = React.memo(() => {
  const [cartItem, setCartItem] = useState<ProductList[]>([]);
  const lowStockItems: ProductList[] = productList.filter((item) => item.quantity < 5);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [finalTotalPrice, setFinalTotalPrice] = useState<number>(0);
  const [itemCount, setItemCount] = useState(0);
  const [preDiscountTotalPrice, setPreDiscountTotalPrice] = useState(0);

  useEffect(() => {
    const { preDiscountTotalPrice, finalTotalPrice, itemCount } = calculateTotalPrice(cartItem);
    setFinalTotalPrice(finalTotalPrice);
    setItemCount(itemCount);
    setPreDiscountTotalPrice(preDiscountTotalPrice);
  }, [cartItem]); // cartItem이 변경될 때마다 실행됨

  const handleAddCart = () => {
    const selectedProduct = productList.find((item) => item.id === selectedProductId);

    if (!selectedProduct || !selectedProductId) {
      console.error("선택된 상품이 없습니다.");
      return;
    }

    const existingProduct = cartItem.find((item) => item.id === selectedProductId);

    if (existingProduct) {
      const saleQuantity = selectedProduct.quantity; // 판매 가능한 수량
      const currentQuantity = existingProduct.quantity; // 카트에 담긴 수량

      if (saleQuantity <= currentQuantity) {
        alert("재고가 부족합니다.");
        return;
      }

      setCartItem((prevItems) => updateQuantity(prevItems, selectedProductId, 1));
    } else {
      const newProduct = { ...selectedProduct, quantity: 1 }; // 새 객체 생성
      setCartItem((prevItems) => [...prevItems, newProduct]);
    }
  };

  const handleQuantityChange = useCallback((id: string, quantity: number) => {
    setCartItem((prevItems) => {
      if (quantity === 0) {
        return prevItems.filter((item) => item.id !== id); // 아이템 제거
      }
      return prevItems.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartItem items={cartItem} onQuantityChange={handleQuantityChange} />

        <CartSummary cartItem={cartItem} finalTotalPrice={finalTotalPrice} itemCount={itemCount} preDiscountTotalPrice={preDiscountTotalPrice} />

        <CartSelectList onSelectChange={(id) => setSelectedProductId(id)} />

        <button className="bg-blue-500 text-white px-4 py-2 rounded" id="add-to-cart" onClick={handleAddCart}>
          추가
        </button>

        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {lowStockItems.map((item) => {
            return (
              <div key={item.id}>
                {item.name}: {item.quantity > 0 ? `재고 부족 (${item.quantity} 개 남음)` : "품절"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
