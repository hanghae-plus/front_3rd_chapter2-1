import { updatePrice } from '@advanced/redux/features/productList/productSlice';
import { getDiscountedPrice } from '@advanced/utils/getDiscountedPrice';
import intervalManager from '@advanced/utils/intervalManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@advanced/redux/store';
import {
  LIGHTNING_SALE_PROBABILITY,
  LIGHTNING_DISCOUNT_RATE,
  LIGHTNING_SALE_INTERVAL,
  LIGHTNING_SALE_DELAY,
  LIGHTNING_INTERVAL_KEY,
} from '@advanced/constants/discount';
import { useRef } from 'react';

// 번개 할인 로직
export const useLightningDiscount = () => {
  const productListRef = useRef(
    useSelector((state: RootState) => state.productStore.productList)
  );
  const { addInterval, clearInterval } = intervalManager;
  const dispatch = useDispatch();

  const lightningInterval = () => {
    return setTimeout(() => {
      // 기존 interval 제거
      clearInterval(LIGHTNING_INTERVAL_KEY);

      // interval 등록
      addInterval(
        LIGHTNING_INTERVAL_KEY,
        lightningDiscountProcess,
        LIGHTNING_SALE_INTERVAL
      );
    }, LIGHTNING_SALE_DELAY);
  };

  const lightningDiscountProcess = () => {
    const productList = productListRef.current;

    const randomIndex = Math.floor(Math.random() * productList.length);

    // 랜덤으로 뽑은 제품
    const { id, name, price, quantity } = productList[randomIndex];

    // 제품 수량 관련 확률
    const valid = validLightning(quantity);

    if (!valid) return;

    // 번개 할인 적용
    const applyDicountPrice = getDiscountedPrice(
      price,
      LIGHTNING_DISCOUNT_RATE
    );
    dispatch(updatePrice({ id, changePrice: applyDicountPrice }));

    // 할인 팝업
    alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);
  };

  return { lightningInterval };
};

// 번개 할인 확률
const validLightning = (stock: number) => {
  const rate = Math.random() < LIGHTNING_SALE_PROBABILITY;

  return stock > 0 && rate;
};
