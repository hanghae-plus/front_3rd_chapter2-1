import { useAppContext } from '../../context/appContext';
import {
  DISCOUNT_PRODUCT_COUNT,
  DISCOUNT_RATES,
  DISCOUNT_10_PERCENT,
  DISCOUNT_25_PERCENT,
  DISCOUNT_25_PERCENT_PRODUCT_COUNT,
} from '../constants/constants';

const useCartUtils = () => {
  const { productList, setStockInfo, cartProductList, setProductSum, setDiscountSpan, setBonusPointsSpan } =
    useAppContext();

  //할인률 가져오기
  const getBulkDiscount = (stockCnt: number, totalAmount: number, discountPrevAmount: number) => {
    if (stockCnt >= DISCOUNT_25_PERCENT_PRODUCT_COUNT) {
      const bulkDisc = totalAmount * DISCOUNT_25_PERCENT;
      const itemDisc = discountPrevAmount - totalAmount;
      return bulkDisc > itemDisc ? DISCOUNT_25_PERCENT : (discountPrevAmount - totalAmount) / discountPrevAmount;
    }
    return (discountPrevAmount - totalAmount) / discountPrevAmount;
  };

  //재고 업데이트
  const updateStockInfo = () => {
    let infoMsg = '';

    productList.forEach(function (product) {
      if (product.stock < 5) {
        infoMsg += `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}\n`;
      }
    });

    setStockInfo(infoMsg);
  };

  //총액 및 포인트 계산 표시
  const calcCart = () => {
    let totalAmount = 0;
    let stockCnt = 0;
    let discountPrevAmount = 0;

    for (let i = 0; i < cartProductList.length; i++) {
      const currentProduct = cartProductList[i];
      const stock = cartProductList[i].stock;
      const productAmount = cartProductList[i].price * stock;
      const discountRate = stock >= DISCOUNT_PRODUCT_COUNT ? DISCOUNT_RATES[currentProduct.id] : 0;

      stockCnt += stock;
      discountPrevAmount += productAmount;
      totalAmount += productAmount * (1 - discountRate);
    }

    let discountRate = getBulkDiscount(stockCnt, totalAmount, discountPrevAmount);
    const isTuesday = new Date().getDay() === 2;
    if (isTuesday) {
      totalAmount *= 1 - DISCOUNT_10_PERCENT;
      discountRate = Math.max(discountRate, DISCOUNT_10_PERCENT);
    }

    setProductSum(`총액: ${Math.round(totalAmount)}원`);

    if (discountRate > 0) {
      setDiscountSpan(`(${(discountRate * 100).toFixed(1)}% 할인 적용)`);
    } else {
      setDiscountSpan('');
    }
    setBonusPointsSpan(`(포인트: ${Math.floor(totalAmount / 1000)})`);
    updateStockInfo();
  };
  return { calcCart };
};

export { useCartUtils };
