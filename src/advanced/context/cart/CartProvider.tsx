import React, { ReactNode, useState } from 'react';
import { CartItem, Product } from '../../types/Cart';
import { CartContext } from './CartContext';

interface CartProviderProps {
  children: ReactNode;
  initialProducts: Product[];
}

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
  initialProducts,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);

      const oldItem = prevCart.find((item) => item.id === productId);
      const newItem = updatedCart.find((item) => item.id === productId);
      const quantityDiff = (oldItem?.quantity || 0) - (newItem?.quantity || 0);

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, stock: p.stock + quantityDiff } : p
        )
      );

      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const removedItem = prevCart.find((item) => item.id === productId);
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId
            ? { ...p, stock: p.stock + (removedItem?.quantity || 0) }
            : p
        )
      );
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  const updateProductPrice = (productId: string, price: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === productId ? { ...p, price } : p))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        products,
        addToCart,
        updateQuantity,
        removeFromCart,
        updateProductPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
