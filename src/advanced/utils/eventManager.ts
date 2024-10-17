import { Product } from '../types';

// TODO: setProductPrice 함수 확인 필요

export function activateLuckySale(
  productList: Product[],
  setProductPrice: (id: string, price: number) => void
) {
  const RANDOM = 0.3;
  const SALE_RATE = 0.8;

  setTimeout(function () {
    setInterval(function () {
      const randomIndex = Math.floor(Math.random() * productList.length);
      const luckyItem = productList[randomIndex];
      const { name, price, quantity } = luckyItem;
      const isRandomTrue = Math.random() < RANDOM && quantity > 0;

      if (isRandomTrue) {
        setProductPrice(luckyItem.id, Math.round(price * SALE_RATE));
        alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);
      }
    }, 30000);
  }, Math.random() * 10000);
}

export function activateSuggestSale(
  lastSelectedId: string,
  productList: Product[],
  setProductPrice: (id: string, price: number) => void
) {
  const SALE_RATE = 0.95;

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedId) {
        const suggest = productList.find(
          (product) => product.id !== lastSelectedId && product.quantity > 0
        );

        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );

          setProductPrice(suggest.id, Math.round(suggest.price * SALE_RATE));
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
