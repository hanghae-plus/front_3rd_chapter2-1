import renderBonusPoints from '../components/renderBonusPoints';
import { cartList, productList } from '../data/global';
import { createSpan } from './createElements';

const getDiscountRate = (cart) => {
  const { id, quantity } = cart;
  let rate = 0;

  if (quantity >= 10) {
    if (id === 'p1') rate = 0.1;
    else if (id === 'p2') rate = 0.15;
    else if (id === 'p3') rate = 0.2;
    else if (id === 'p4') rate = 0.05;
    else if (id === 'p5') rate = 0.25;
  }

  return rate;
};

const applyBulkDiscount = () => {
  const totalCount = cartList.getTotalQuantity();
  const totalOriginPrice = cartList.getTotalPrice();
  let totalDiscountPrice = cartList
    .toObject()
    .reduce(
      (acc, item) =>
        acc + item.price * item.quantity * (1 - getDiscountRate(item)),
      0
    );
  let rate = 0;

  if (totalCount >= 30) {
    let bulkDiscount = totalDiscountPrice * 0.25;
    let itemDiscount = totalOriginPrice - totalDiscountPrice;

    if (bulkDiscount > itemDiscount) {
      totalDiscountPrice = totalOriginPrice * (1 - 0.25);
      rate = 0.25;
    } else rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;
  } else rate = (totalOriginPrice - totalDiscountPrice) / totalOriginPrice;

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalDiscountPrice];
};

const getSpecialDiscountRate = (rate, totalPrice) => {
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    rate = Math.max(rate, 0.1);
  }

  rate = isNaN(rate) ? 0 : rate;

  return [rate, totalPrice];
};

function updateStock() {
  const $stock = document.getElementById('stock-status');
  let infoMsg = '';

  productList.toObject().forEach(function (item) {
    const quantity = item.quantity;
    const name = item.name;

    if (quantity < 5)
      infoMsg += `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}\n\n`;
  });

  $stock.textContent = infoMsg;
}

function calculateCart() {
  const $sum = document.getElementById('cart-total');

  let [rate, totalPrice] = applyBulkDiscount();
  [rate, totalPrice] = getSpecialDiscountRate(rate, totalPrice);

  $sum.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (rate > 0) {
    let span = createSpan({
      text: `(${(rate * 100).toFixed(1)}% 할인 적용)`,
      className: 'text-green-500 ml-2',
    });
    $sum.appendChild(span);
  }

  updateStock();
  renderBonusPoints(totalPrice, $sum);
}

export default calculateCart;
