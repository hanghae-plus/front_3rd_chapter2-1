import React, { useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { useCartUtils } from '../ts/utils/cartUtils';
import { useRenderUtils } from '../ts/utils/renderUtils';
import CartProductList from './CartProductList';
import CartAmountInfo from './CartAmountInfo';
import StockInfo from './StockInfo';
import AddToCart from './AddToCart';
import ProductSelectList from './productSelectList';

const Layout = () => {
  const { setProductSelectDropDown, cartProductList, setSelectedProductId, productList, setProductList } =
    useAppContext();

  const { calcCart } = useCartUtils();
  const { renderProductList } = useRenderUtils();

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
        renderProductList();
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
      renderProductList();
      setProductSelectDropDown(<>{options}</>);
    }
  };

  const options = renderProductList();

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
        <CartProductList />
        <CartAmountInfo />
        <div style={{ display: 'flex' }}>
          <ProductSelectList />
          <AddToCart />
        </div>
        <StockInfo />
      </div>
    </div>
  );
};

export default Layout;
