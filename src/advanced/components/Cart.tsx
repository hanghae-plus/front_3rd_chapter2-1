import React, { useEffect, useState, useCallback } from 'react';

import { productList } from '../shared/product';
import { Product, CartProduct } from '../shared/types';
import {
  LOW_STOCK_THRESHOLD,
  FLASH_SALE_INTERVAL,
  FLASH_SALE_CHANCE,
  FLASH_SALE_DISCOUNT,
  SUGGESTION_INTERVAL,
  SUGGESTION_DISCOUNT,
} from '../shared/constants';
import { setupIntervalWithDelay } from '../shared/utils.ts';
import { calculateCart } from '../services/cartService.ts';

const Cart: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(productList);
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(
    null,
  );
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);

  const updateCart = useCallback(() => {
    const { finalTotal, discountRate, bonusPoints } = calculateCart(
      cartProducts,
      products,
    );
    setTotalAmount(finalTotal);
    setDiscountRate(discountRate);
    setBonusPoints(bonusPoints);
  }, [cartProducts, products]);

  useEffect(() => {
    updateCart();

    setupIntervalWithDelay(
      () => {
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          const randomProduct =
            updatedProducts[Math.floor(Math.random() * updatedProducts.length)];
          if (Math.random() < FLASH_SALE_CHANCE && randomProduct.quantity > 0) {
            randomProduct.price = Math.round(
              randomProduct.price * FLASH_SALE_DISCOUNT,
            );
            alert(
              '번개세일! ' + randomProduct.name + '이(가) 20% 할인 중입니다!',
            );
            return updatedProducts;
          }
          return prevProducts;
        });
      },
      Math.random() * 10000,
      FLASH_SALE_INTERVAL,
    );

    setupIntervalWithDelay(
      () => {
        if (!lastAddedProductId) return;
        setProducts((prevProducts) => {
          const updatedProducts = [...prevProducts];
          const suggestedProduct = updatedProducts.find(
            (p) => p.id !== lastAddedProductId && p.quantity > 0,
          );
          if (suggestedProduct) {
            alert(
              suggestedProduct.name +
                '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
            );
            suggestedProduct.price = Math.round(
              suggestedProduct.price * SUGGESTION_DISCOUNT,
            );
            return updatedProducts;
          }
          return prevProducts;
        });
      },
      Math.random() * 20000,
      SUGGESTION_INTERVAL,
    );
  }, [lastAddedProductId, updateCart]);

  const handleAddToCart = () => {
    const productToAdd = products.find((p) => p.id === selectedProductId);
    if (!productToAdd || productToAdd.quantity <= 0) return;

    setCartProducts((prevProducts) => {
      const existingProduct = prevProducts.find(
        (product) => product.id === selectedProductId,
      );
      if (existingProduct) {
        const updatedProducts = prevProducts.map((product) =>
          product.id === selectedProductId
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        );
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === selectedProductId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        );
        return updatedProducts;
      } else {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.id === selectedProductId ? { ...p, quantity: p.quantity - 1 } : p,
          ),
        );
        return [
          ...prevProducts,
          {
            id: selectedProductId,
            name: productToAdd.name,
            price: productToAdd.price,
            quantity: 1,
          },
        ];
      }
    });

    setLastAddedProductId(selectedProductId);
    updateCart();
  };

  const handleCartAction = (
    productId: string,
    action: 'increment' | 'decrement' | 'remove',
  ) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts
        .map((product) => {
          if (product.id === productId) {
            if (action === 'increment') {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p.id === productId ? { ...p, quantity: p.quantity - 1 } : p,
                ),
              );
              return { ...product, quantity: product.quantity + 1 };
            } else if (action === 'decrement') {
              setProducts((prevProducts) =>
                prevProducts.map((p) =>
                  p.id === productId ? { ...p, quantity: p.quantity + 1 } : p,
                ),
              );
              return { ...product, quantity: product.quantity - 1 };
            }
          }
          return product;
        })
        .filter((product) => product.quantity > 0);

      if (action === 'remove') {
        const removedProduct = prevProducts.find(
          (product) => product.id === productId,
        );
        if (removedProduct) {
          setProducts((prevProducts) =>
            prevProducts.map((p) =>
              p.id === productId
                ? { ...p, quantity: p.quantity + removedProduct.quantity }
                : p,
            ),
          );
        }
        return updatedProducts.filter((product) => product.id !== productId);
      }

      return updatedProducts;
    });

    updateCart();
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div>
          {cartProducts.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{`${product.name} - ${product.price}원 x ${product.quantity}`}</span>
              <div>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleCartAction(product.id, 'decrement')}
                >
                  -
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => handleCartAction(product.id, 'increment')}
                >
                  +
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleCartAction(product.id, 'remove')}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-xl font-bold my-4">
          {`총액: ${Math.round(totalAmount)}원`}
          {discountRate > 0 && (
            <span className="text-green-500 ml-2">{`(${(discountRate * 100).toFixed(1)}% 할인 적용)`}</span>
          )}
          <span className="text-blue-500 ml-2">
            {`(포인트: ${bonusPoints})`}
          </span>
        </div>
        <select
          className="border rounded p-2 mr-2"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          {products.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity === 0}
            >
              {`${product.name} - ${product.price}원`}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddToCart}
        >
          추가
        </button>
        <div className="text-sm text-gray-500 mt-2">
          {products
            .filter((product) => product.quantity < LOW_STOCK_THRESHOLD)
            .map((product) => (
              <div key={product.id}>
                {product.name}:{' '}
                {product.quantity > 0
                  ? `재고 부족 (${product.quantity}개 남음)`
                  : '품절'}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
