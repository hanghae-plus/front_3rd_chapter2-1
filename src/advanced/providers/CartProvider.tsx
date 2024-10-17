import { CartContext } from './../utils/hooks';
import {
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Cart } from '../types';

export const CartProvider: React.FC<PropsWithChildren> = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const [cartList, setCart] = useState<Cart[]>([]);

  const getCart = useCallback(
    (id: string) => {
      return cartList.find((cart) => cart.id === id);
    },
    [cartList]
  );

  const addCart = useCallback(
    (cart: Cart) => {
      setCart((prev) => [...prev, cart]);
    },
    [cartList]
  );

  const addCartQuantity = useCallback(
    (id: string, quantity: number) => {
      return setCart((prev) => {
        return prev.map((cart) =>
          cart.id === id
            ? { ...cart, quantity: cart.quantity + quantity }
            : cart
        );
      });
    },
    [cartList]
  );

  const setCartPrice = useCallback(
    (id: string, price: number) => {
      return setCart((prev) => {
        return prev.map((cart) => (cart.id === id ? { ...cart, price } : cart));
      });
    },
    [cartList]
  );

  const value = useMemo(
    () => ({
      cartList,
      getCart,
      setCartQuantity: addCartQuantity,
      setCartPrice,
      addCart,
    }),
    [cartList, getCart, addCartQuantity, setCartPrice, addCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
