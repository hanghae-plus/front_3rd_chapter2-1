import { useEffect } from 'react';
import { useCartContext } from '../context/CartContext';

const useDiscounts = () => {
  const { products, setProducts } = useCartContext();
  let lastSelectedProduct = null;

  const setFlashSale = () => {
    setTimeout(() => {
      setInterval(() => {
        const luckyItem = products[Math.floor(Math.random() * products.length)];
        if (Math.random() < 0.3 && luckyItem.q > 0) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === luckyItem.id
                ? { ...product, val: Math.round(product.val * 0.8) }
                : product,
            ),
          );
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);
    }, Math.random() * 10000);
  };

  const setSuggestDiscount = () => {
    setTimeout(() => {
      setInterval(() => {
        const suggest = products.find(
          (product) => product.id !== lastSelectedProduct && product.q > 0,
        );
        if (suggest) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === suggest.id
                ? { ...product, val: Math.round(product.val * 0.95) }
                : product,
            ),
          );
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        }
      }, 60000);
    }, Math.random() * 20000);
  };

  useEffect(() => {
    setFlashSale();
    setSuggestDiscount();
  }, []);

  return {
    setFlashSale,
    setSuggestDiscount,
  };
};

export default useDiscounts;
