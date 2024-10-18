import { prodList } from '../constant/productList';

const PROMOTION_CHANCE = 0.3;
const PROMOTION_DISCOUNT = 0.2;
const PROMOTION_INTERVAL = 3000;

function applyLuckySalePromotion() {
  const randomIndex = Math.floor(Math.random() * prodList.length);
  const productForPromotion = prodList[randomIndex];

  if (Math.random() < PROMOTION_CHANCE && productForPromotion.quantity > 0) {
    const newPrice = Math.round(productForPromotion.price * (1 - PROMOTION_DISCOUNT));
    productForPromotion.price = newPrice;
    alert(`번개세일! ${productForPromotion.name}이(가) ${PROMOTION_DISCOUNT * 100}% 할인 중입니다!`);
  }
}

export function useLuckySale() {
  setTimeout(() => {
    const intervalId = setInterval(applyLuckySalePromotion, PROMOTION_INTERVAL);
    return () => clearInterval(intervalId);
  }, Math.random() * 1000);
}
