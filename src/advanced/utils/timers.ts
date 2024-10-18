import { useProductsStore, useCartStore } from '../stores';
import { delay } from '../utils';

// Flash Sale 이벤트 타이머 함수
const flashSale = (): void => {
  const { updateAllValues } = useCartStore.getState();
  const { products, updateProd } = useProductsStore.getState();

  // 무작위로 상품 선택
  const luckyItem = products[Math.floor(Math.random() * products.length)];

  // 30% 확률로 재고가 있는 경우에만 할인 적용
  const isEligibleForSale = Math.random() < 0.3 && luckyItem.qty > 0;
  if (!isEligibleForSale) return;

  // 할인 가격 계산 및 업데이트
  const discountedPrice = Math.round(luckyItem.val * 0.8);
  alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);

  // 상품 정보 업데이트
  updateProd({ ...luckyItem, val: discountedPrice });
  updateAllValues();
};
// Flash Sale 이벤트 타이머 함수
const suggestSale = (): void => {
  const { lastAdded, updateAllValues } = useCartStore.getState();
  if (!lastAdded) return;

  const { products, updateProd } = useProductsStore.getState();

  // 마지막으로 추가된 상품과 다른, 재고가 있는 상품을 찾음
  const suggest = products.find(({ id, qty }) => id !== lastAdded && qty > 0);
  if (!suggest) return;

  // 할인 적용 및 알림
  const discountedPrice = Math.round(suggest.val * 0.95);
  alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);

  // 상품 정보 업데이트
  updateProd({ ...suggest, val: discountedPrice });
  updateAllValues();
};

// Flash Sale 이벤트 타이머 함수
export const startFlashSale = async () => {
  console.log('Flash Sale 이벤트 시작');
  await delay(Math.random() * 10000);

  setInterval(flashSale, 30000);
};

// Suggest Sale 이벤트 타이머 함수
export const startSuggestSale = async () => {
  console.log('Suggest Sale 이벤트 시작');
  await delay(Math.random() * 20000);

  setInterval(suggestSale, 60000);
};
