import { updatePrice } from '@advanced/redux/features/productList/productSlice';
import { getDiscountedPrice } from '@advanced/utils/getDiscountedPrice';
import intervalManager from '@advanced/utils/intervalManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@advanced/redux/store';
import { find } from 'lodash-es';
import {
  SUGGESTION_DISCOUNT_INTERVAL,
  SUGGESTION_DISCOUNT_DELAY,
  SUGGESTION_DISCOUNT_RATE,
  SUGGESTION_INTERVAL_KEY,
} from '@advanced/constants/discount';

// 추천 할인 로직
export const useSuggestionDiscount = () => {
  const { addInterval, clearInterval } = intervalManager;
  const { productList } = useSelector((state: RootState) => state.productStore);
  const { lastPickItemId } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const suggestionInterval = () => {
    return setTimeout(() => {
      // 기존 interval 제거
      clearInterval(SUGGESTION_INTERVAL_KEY);

      // interval 등록
      addInterval(
        SUGGESTION_INTERVAL_KEY,
        suggestionDiscountProcess,
        SUGGESTION_DISCOUNT_INTERVAL
      );
    }, SUGGESTION_DISCOUNT_DELAY);
  };

  const suggestionDiscountProcess = () => {
    // 마지막 선택 아이템과 다르고 재고가 있는 추천 상품 찾기
    const suggestedItem = find(
      productList,
      ({ id, quantity }: ItemType) => id !== lastPickItemId && quantity > 0
    );

    if (!suggestedItem) return;

    const { id, name, price } = suggestedItem;

    // 추천 제품 할인 적용
    const applyDicountPrice = getDiscountedPrice(
      price,
      SUGGESTION_DISCOUNT_RATE
    );
    dispatch(updatePrice({ id, changePrice: applyDicountPrice }));

    // 할인 팝업
    alert(`${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
  };

  return { suggestionInterval, suggestionDiscountProcess };
};
