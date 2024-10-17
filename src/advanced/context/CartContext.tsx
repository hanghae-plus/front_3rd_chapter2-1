import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { cartReducer, CartState, CartAction } from "../reducers/cartReducer";

const initialState: CartState = {
  products: [
    { id: "p1", name: "상품1", value: 10000, quantity: 50, discount: 0.1 },
    { id: "p2", name: "상품2", value: 20000, quantity: 30, discount: 0.15 },
    { id: "p3", name: "상품3", value: 30000, quantity: 20, discount: 0.2 },
    { id: "p4", name: "상품4", value: 15000, quantity: 0, discount: 0.05 },
    { id: "p5", name: "상품5", value: 25000, quantity: 10, discount: 0.25 },
  ],
  cart: [],
  totalPrice: 0,
  bonusPoints: 0,
  discountRate: 0,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
