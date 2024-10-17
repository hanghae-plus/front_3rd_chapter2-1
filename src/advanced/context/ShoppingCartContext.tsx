import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { PRODUCT_LIST } from '../constants';
import { CartItem, Product } from '../types';
import { calculateTotal } from '../utils/calculations';
import { applyRandomFlashSale, suggestProduct } from '../utils/promotions';

interface ShoppingCartState {
  products: Product[];
  cart: CartItem[];
  bonusPoints: number;
  lastSelectedProductId: string | null;
}

type ShoppingCartAction =
  | { type: 'ADD_TO_CART'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; change: number }
  | { type: 'REMOVE_FROM_CART'; productId: string }
  | { type: 'APPLY_FLASH_SALE' }
  | { type: 'SUGGEST_PRODUCT' }
  | { type: 'SET_BONUS_POINTS'; points: number };

const initialState: ShoppingCartState = {
  products: PRODUCT_LIST,
  cart: [],
  bonusPoints: 0,
  lastSelectedProductId: null,
};

function shoppingCartReducer(
  state: ShoppingCartState,
  action: ShoppingCartAction,
): ShoppingCartState {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = state.products.find((p) => p.id === action.productId);
      if (!product || product.quantity <= 0) return state;

      const existingCartItem = state.cart.find((item) => item.id === action.productId);
      const updatedCart = existingCartItem
        ? state.cart.map((item) =>
            item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.cart, { ...product, quantity: 1 }];

      const updatedProducts = state.products.map((p) =>
        p.id === action.productId ? { ...p, quantity: p.quantity - 1 } : p,
      );

      return {
        ...state,
        products: updatedProducts,
        cart: updatedCart,
        lastSelectedProductId: action.productId,
      };
    }
    case 'UPDATE_QUANTITY': {
      const product = state.products.find((p) => p.id === action.productId);
      const cartItem = state.cart.find((item) => item.id === action.productId);

      if (!product || !cartItem) return state;

      if (action.change > 0 && product.quantity < action.change) {
        alert('재고가 부족합니다.');
        return state;
      }

      const updatedCart = state.cart
        .map((item) => {
          if (item.id === action.productId) {
            const newQuantity = item.quantity + action.change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);

      const updatedProducts = state.products.map((p) =>
        p.id === action.productId ? { ...p, quantity: p.quantity - action.change } : p,
      );

      return { ...state, cart: updatedCart, products: updatedProducts };
    }
    case 'REMOVE_FROM_CART': {
      const itemToRemove = state.cart.find((item) => item.id === action.productId);
      if (!itemToRemove) return state;

      const updatedCart = state.cart.filter((item) => item.id !== action.productId);
      const updatedProducts = state.products.map((p) =>
        p.id === action.productId ? { ...p, quantity: p.quantity + itemToRemove.quantity } : p,
      );

      return { ...state, cart: updatedCart, products: updatedProducts };
    }
    case 'APPLY_FLASH_SALE':
      return { ...state, products: applyRandomFlashSale(state.products) };
    case 'SUGGEST_PRODUCT':
      return { ...state, products: suggestProduct(state.products, state.lastSelectedProductId) };
    case 'SET_BONUS_POINTS':
      return { ...state, bonusPoints: action.points };
    default:
      return state;
  }
}

const ShoppingCartContext = createContext<
  | {
      state: ShoppingCartState;
      dispatch: React.Dispatch<ShoppingCartAction>;
    }
  | undefined
>(undefined);

export const ShoppingCartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(shoppingCartReducer, initialState);

  //   useEffect(() => {
  //     const flashSaleInterval = setInterval(() => dispatch({ type: 'APPLY_FLASH_SALE' }), 30000);
  //     const suggestProductInterval = setInterval(() => dispatch({ type: 'SUGGEST_PRODUCT' }), 60000);

  //     return () => {
  //       clearInterval(flashSaleInterval);
  //       clearInterval(suggestProductInterval);
  //     };
  //   }, []);

  useEffect(() => {
    const { bonusPoints } = calculateTotal(state.cart);
    dispatch({ type: 'SET_BONUS_POINTS', points: bonusPoints });
  }, [state.cart]);

  return (
    <ShoppingCartContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (context === undefined) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};
