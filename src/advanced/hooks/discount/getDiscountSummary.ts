import { useGetItemInCart } from '@advanced/hooks/discount/useGetItemInCart';
import { useBulk } from '@advanced/hooks/discount/useBulk';
import { useDay } from '@advanced/hooks/discount/useDay';
import { calcDiscountRate } from '@advanced/utils/calcDiscountRate';

const { validBulk, applyBulk } = useBulk();
const { validDay, applyDay } = useDay();

export const getDiscountSummary = (items: ItemType[]) => {
  //GET 할인 전 총액, 할인된 총액 , 상품 총 수량
  const [totalPrice, discountedPrice, itemQty] = useGetItemInCart(items);

  //GET 할인율 구하기
  const discountRate = calcDiscountRate(totalPrice, discountedPrice);

  // [ 할인된 값 , 할인율 ] 변수 초기화
  let [price, rate] = [discountedPrice, discountRate];

  // 대량 할인
  const isValidBulk = validBulk(discountRate, itemQty);
  if (isValidBulk) [price, rate] = applyBulk(totalPrice);

  // 요일 할인
  const isValidDay = validDay();
  if (isValidDay) [price, rate] = applyDay(price, rate);

  // 할인된 값 / 할인율
  return [price, rate];
};
