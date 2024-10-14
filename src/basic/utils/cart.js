export const products = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

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

const createBonusPointsTag = () => {
  const pointTagElement = document.createElement('span');
  pointTagElement.id = 'loyalty-points';
  pointTagElement.className = 'text-blue-500 ml-2';

  document.getElementById('cart-total').appendChild(pointTagElement);
  return pointTagElement;
};
export const updateBonusPoints = (bonusPoints, totalPrice) => {
  const updatedBonusPoints = bonusPoints + Math.floor(totalPrice / 1000);

  const pointTagElement = document.getElementById('loyalty-points') || createBonusPointsTag();
  pointTagElement.textContent = `(포인트: ${updatedBonusPoints})`;

  return updatedBonusPoints;
};

const formatLowStocksInfo = (lowStockProducts) => {
  return lowStockProducts
    .map((product) =>
      product.quantity > 0 ? `${product.name}: 재고 부족 (${product.quantity}개 남음)` : `${product.name}: 품절`,
    )
    .join('\n');
};
export const renderProductsStockInfo = () => {
  const LACK_OF_STOCK = 5;

  const stockInfo = document.getElementById('stock-status');
  const lowStockProducts = products.filter((product) => product.quantity < LACK_OF_STOCK);

  stockInfo.textContent = formatLowStocksInfo(lowStockProducts);
};
