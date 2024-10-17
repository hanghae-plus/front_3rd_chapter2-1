import React, { createContext, useState, ReactNode } from "react";

// Context 타입 정의
interface CartContextType {
  lastStockItem: string | null;
  setLastStockItem: React.Dispatch<React.SetStateAction<string | null>>;
}

// Context 생성
const CartContext = createContext<CartContextType | null>(null);

// Context Provider 컴포넌트
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lastStockItem, setLastStockItem] = useState<string | null>(null);

  return <CartContext.Provider value={{ lastStockItem, setLastStockItem }}>{children}</CartContext.Provider>;
};
