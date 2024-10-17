import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext';
import { useCartUtils } from '../ts/utils/cartUtils';
import { ALERT_SHORT_STOCK, PRODUCT_LIST } from '../ts/constants/constants';
import { useRenderUtils } from '../ts/utils/renderUtils';

const Layout = () => {
  const {
    productSum,
    productSelectDropDown,
    stockInfo,
    setProductSelectDropDown,
    discountSpan,
    cartProductList,
    setCartProductList,
    bonusPointsSpan,
    productList,
    setProductList,
  } = useAppContext();

  const [selectedProductId, setSelectedProductId] = useState('');
  const { calcCart } = useCartUtils();
  const { renderProductList } = useRenderUtils();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  //추가 버튼
  const handleAddToCart = () => {
    const addToCartProduct = productList.find((product) => product.id === selectedProductId);
    if (addToCartProduct && addToCartProduct.stock === 0) {
      alert(ALERT_SHORT_STOCK);
      return;
    }
    let newQuantity = 0;
    if (addToCartProduct) {
      setCartProductList((prev) => {
        const existingProduct = prev.find((product) => product.id === addToCartProduct.id);

        if (existingProduct) {
          newQuantity = existingProduct.stock + 1;

          return prev.map((product) =>
            product.id === existingProduct.id ? { ...product, stock: newQuantity } : product,
          );
        } else {
          return [...prev, { ...addToCartProduct, stock: 1 }];
        }
      });

      if (0 > newQuantity) {
        return;
      }
      setProductList((prevProductList) =>
        prevProductList.map((product) => {
          if (product.id === addToCartProduct.id) {
            const updatedStock = product.stock - 1;
            return { ...product, stock: updatedStock };
          }
          return product;
        }),
      );
    }
  };

  //타임 세일
  const timeSaleProductRenderer = () => {
    if (productList.length > 0) {
      const timeSaleProduct = productList[Math.floor(Math.random() * productList.length)];

      if (Math.random() < 0.3 && timeSaleProduct.stock > 0) {
        timeSaleProduct.price = Math.round(timeSaleProduct.price * 0.8);
        alert(`번개세일! ${timeSaleProduct.name}이(가) 20% 할인 중입니다!`);

        const updateProductList = productList.map((product) => {
          if (product.id === timeSaleProduct.id) {
            return { ...product, price: timeSaleProduct.price };
          }
          return product;
        });
        setProductList(updateProductList);
        setSelectedProductId(timeSaleProduct.id);
        setProductSelectDropDown(<>{options}</>);
      }
    }
  };

  //상품 제안
  const productSuggestRender = () => {
    const cartProductLength = cartProductList.length;
    if (cartProductLength > 0) {
      const productSuggest = productList[cartProductLength - 0];
      alert(`${productSuggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      const updateProductList = productList.map((product) => {
        if (product.id === productSuggest.id) {
          return { ...product, price: Math.round(productSuggest.price * 0.95) };
        }
        return product;
      });
      setProductList(updateProductList);
      setSelectedProductId(productSuggest.id);
      setProductSelectDropDown(<>{options}</>);
    }
  };

  const options = renderProductList();

  //장바구니에 있는 상품 정보 업데이트
  const updateCartProductInfo = (productId: string, change: number) => {
    const calcProduct = productList.find((product) => product.id === productId);

    if (change === 1 && calcProduct && calcProduct.stock === 0) {
      alert(ALERT_SHORT_STOCK);
      return;
    }

    setCartProductList((prevCartItems) => {
      const existingProduct = prevCartItems.find((product) => product.id === productId);
      const productInList = productList.find((product) => product.id === productId);

      if (existingProduct && productInList) {
        const newQuantity = existingProduct.stock + change;

        if (newQuantity < 0) {
          alert(ALERT_SHORT_STOCK);
          return prevCartItems; //
        }

        if (newQuantity === 0) {
          return prevCartItems.filter((product) => product.id !== productId);
        }

        // 재고 수량 업데이트
        return prevCartItems.map((product) =>
          product.id === productId ? { ...product, stock: newQuantity } : product,
        );
      }

      return prevCartItems;
    });

    setProductList((prevProductList) =>
      prevProductList.map((product) => {
        if (product.id === productId) {
          const updatedStock = product.stock - change;
          return { ...product, stock: updatedStock };
        }
        return product;
      }),
    );
  };

  //상품 삭제
  const removeItemFromCart = (productId: string) => {
    setCartProductList((prevItems) => prevItems.filter((item) => item.id !== productId));

    const resetProduct = PRODUCT_LIST.find((product) => product.id === productId);

    if (resetProduct) {
      setProductList((prevProductList) =>
        prevProductList.map((product) => {
          if (product.id === productId) {
            return { ...product, stock: resetProduct.stock };
          }
          return product;
        }),
      );
    }
  };

  // 타임세일 및 제품 추천 useEffect
  useEffect(() => {
    const timeSaleInterval = setInterval(() => {
      timeSaleProductRenderer();
    }, 30000);

    const suggestInterval = setInterval(() => {
      productSuggestRender();
    }, 60000);

    return () => {
      clearInterval(timeSaleInterval);
      clearInterval(suggestInterval);
    };
  }, []);

  //select에 값이 세팅이 안 돼 있어서 임의로 지정을 위한 useEffect
  useEffect(() => {
    setSelectedProductId('p1');
  }, []);

  //select에 상품정보 리스트 세팅 및 총액 표기를 위한 useEffect
  useEffect(() => {
    setProductSelectDropDown(<>{options}</>);
    calcCart();
  }, [cartProductList]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items">
          {cartProductList.map((product) => (
            <div key={product.id} className="flex justify-between items-center mb-2">
              <span>
                {product.name} - {product.price}원 x {product.stock}
              </span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => updateCartProductInfo(product.id, -1)}>
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  onClick={() => updateCartProductInfo(product.id, 1)}>
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => removeItemFromCart(product.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          {productSum}
          <span className="text-green-500 ml-2">{discountSpan}</span>
          <span id="loyalty-points" className="text-blue-500 ml-2">
            {bonusPointsSpan}
          </span>
        </div>
        <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelectChange}>
          {productSelectDropDown}
        </select>
        <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddToCart}>
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {stockInfo}
        </div>
      </div>
    </div>
  );
};

export default Layout;
