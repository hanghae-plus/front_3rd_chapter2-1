import {
  PRODUCT_BULK_DISCOUNT_AMOUNT,
  PRODUCT_BULK_DISCOUNT_RATE,
  SALE_DAY,
  SALE_DAY_DISCOUNT_RATE,
  TOTAL_BULK_DISCOUNT_AMOUNT,
} from './const';

export const products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export const getProductBulkDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};
export const calcDiscounts = (itemCnt, totalPrice, discountedTotalPrice) => {
  let updatedTotalPrice = 0;
  let discRate = 0;

  // 총합 개수 bulk 할인
  if (itemCnt >= TOTAL_BULK_DISCOUNT_AMOUNT) {
    const bulkDiscountedPrice = discountedTotalPrice * 0.25;
    const itemBulkDiscountedPrice = totalPrice - discountedTotalPrice;
    if (bulkDiscountedPrice > itemBulkDiscountedPrice) {
      updatedTotalPrice = totalPrice * (1 - 0.25);
      discRate = 0.25;
    } else {
      updatedTotalPrice = discountedTotalPrice;
      discRate = (totalPrice - discountedTotalPrice) / totalPrice;
    }
  } else {
    updatedTotalPrice = discountedTotalPrice;
    discRate = (totalPrice - discountedTotalPrice) / totalPrice;
  }

  // 화요일 할인
  if (new Date().getDay() === SALE_DAY) {
    updatedTotalPrice *= 1 - SALE_DAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, SALE_DAY_DISCOUNT_RATE);
  }

  return { updatedTotalPrice, discRate };
};

export const updateTotalInfo = (discountedTotalPrice, discRate) => {
  const cartTotalInfo = document.getElementById('cart-total');

  cartTotalInfo.textContent = '총액: ' + Math.round(discountedTotalPrice) + '원';
  if (discRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalInfo.appendChild(span);
  }
};
export const updateProductsStockInfo = () => {
  const stockInfo = document.getElementById('stock-status');
  let infoMsg = '';

  products.forEach((item) => {
    if (item.quantity < 5) {
      infoMsg += item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent = infoMsg;
};
export const updateBonusPoints = (bonusPoints, totalPrice) => {
  bonusPoints += Math.floor(totalPrice / 1000);

  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    const cartTotalInfo = document.getElementById('cart-total');
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = 'text-blue-500 ml-2';
    cartTotalInfo.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPoints + ')';

  return bonusPoints;
};
