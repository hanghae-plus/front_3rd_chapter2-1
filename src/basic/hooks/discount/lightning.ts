import App from '@basic/app';
import {
  LIGHTNING_DISCOUNT_RATE,
  LIGHTNING_SALE_PROBABILITY,
} from '@basic/constants/discount';
import { productStore, updateProductList } from '@basic/store/product';
import { applyDiscount } from './applyDiscount';

/**
 * 번개 할인 적용
 */
export const applyLightningSale = () => {
  const { selectBox } = App.getInstance();
  const { productList } = productStore.getState();

  // 랜덤 제품 선택
  const randomIdx = Math.floor(Math.random() * productList.length);
  const luckyItem = productList[randomIdx];
  const { id, name, price, quantity } = luckyItem;

  // 번개 할인 발생 조건
  const valid = validLightning(quantity);

  if (valid) {
    // 할인 적용
    const updatePrice = applyDiscount(price, LIGHTNING_DISCOUNT_RATE);
    updateProductList(id, { price: updatePrice });

    // 할인 팝업
    alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);

    // 셀렉트박스 업데이트
    selectBox.update();
  }
};

const validLightning = (stock: number) => {
  // 확률
  const rate = Math.random() < LIGHTNING_SALE_PROBABILITY;
  // 재고 유무
  const hasStock = stock > 0;

  return hasStock && rate;
};
