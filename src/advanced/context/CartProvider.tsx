import React, { createContext, useContext, useState, ReactNode } from "react";

// Context의 타입 정의
interface CartContextType {
  lastStockItem: string | null;
  setLastStockItem: React.Dispatch<React.SetStateAction<string | null>>;
}

// Context 생성 (기본값은 {}로 설정)
const CartContext = createContext<CartContextType | null>(null);

// Context Provider 컴포넌트
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lastStockItem, setLastStockItem] = useState<string | null>(null);

  return <CartContext.Provider value={{ lastStockItem, setLastStockItem }}>{children}</CartContext.Provider>;
};

// Context 사용
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
