export const products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export const getProductBulkDiscountRate = (productId, quantity) => {
  const PRODUCT_BULK_DISCOUNT_AMOUNT = 10;
  const PRODUCT_BULK_DISCOUNT_RATE = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };

  if (quantity >= PRODUCT_BULK_DISCOUNT_AMOUNT) return PRODUCT_BULK_DISCOUNT_RATE[productId];
  return 0;
};
export const calcTotalProductsBulkDiscount = (totalItems, totalPrice, discountedTotalPrice) => {
  const TOTAL_BULK_DISCOUNT_AMOUNT = 30;
  let updatedTotalPrice = 0;
  let discountRate = 0;

  if (totalItems >= TOTAL_BULK_DISCOUNT_AMOUNT) {
    const bulkDiscountedPrice = discountedTotalPrice * 0.25;
    const itemBulkDiscountedPrice = totalPrice - discountedTotalPrice;
    if (bulkDiscountedPrice > itemBulkDiscountedPrice) {
      updatedTotalPrice = totalPrice * (1 - 0.25);
      discountRate = 0.25;
    } else {
      updatedTotalPrice = discountedTotalPrice;
      discountRate = (totalPrice - discountedTotalPrice) / totalPrice;
    }
  } else {
    updatedTotalPrice = discountedTotalPrice;
    discountRate = (totalPrice - discountedTotalPrice) / totalPrice;
  }

  return { updatedTotalPrice, discountRate };
};
export const calcDayDiscount = ({ updatedTotalPrice, discountRate }) => {
  const SALE_DAY = 2;
  const SALE_DAY_DISCOUNT_RATE = 0.1;

  if (new Date().getDay() === SALE_DAY) {
    updatedTotalPrice *= 1 - SALE_DAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, SALE_DAY_DISCOUNT_RATE);
  }

  return { updatedTotalPrice, discountRate };
};

export const updateTotalInfo = (discountedTotalPrice, discountRate) => {
  const cartTotalInfo = document.getElementById('cart-total');

  cartTotalInfo.textContent = '총액: ' + Math.round(discountedTotalPrice) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalInfo.appendChild(span);
  }
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
export const renderProductsStockInfo = () => {
  const stockInfo = document.getElementById('stock-status');
  let infoMsg = '';

  products.forEach((item) => {
    if (item.quantity < 5) {
      infoMsg += item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent = infoMsg;
};
