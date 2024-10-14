import { createSpan } from './createElements';
import renderBonusPts from './renderBonusPts';

const mapCartItems = (cartsDiv, prodList) => {
  const elements = Array.from(cartsDiv.children);
  const ids = elements.map((item) => item.id);
  const mapProducts = ids.map((id) => prodList.find((prod) => prod.id === id));
  const cartItems = mapProducts.map((item, i) => ({
    ...item,
    q: parseInt(elements[i].querySelector('span').textContent.split('x ')[1]),
  }));

  return cartItems;
};
const getDiscountRate = (cart) => {
  const { id, q } = cart;
  let rate = 0;

  if (q >= 10)
    if (id === 'p1') rate = 0.1;
    else if (id === 'p2') rate = 0.15;
    else if (id === 'p3') rate = 0.2;
    else if (id === 'p4') rate = 0.05;
    else if (id === 'p5') rate = 0.25;

  return rate;
};
const applyBulkDiscount = (totalCount, totalOriginPrice, totalDiscountPrice) => {
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
function updateStockInfo(prodList, stockInfoDiv) {
  let infoMsg = '';

  prodList.forEach(function (item) {
    if (item.q < 5)
      infoMsg +=
        item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
  });

  stockInfoDiv.textContent = infoMsg;
}

function calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv }) {
  const carts = mapCartItems(cartsDiv, prodList);
  const count = carts.reduce((acc, item) => acc + item.q, 0);
  const totalOriginPrice = carts.reduce((acc, item) => acc + item.val * item.q, 0);
  const totalDiscountPrice = carts.reduce(
    (acc, item) => acc + item.val * item.q * (1 - getDiscountRate(item)),
    0
  );

  let rate = 0;
  let totalPrice = 0;
  [rate, totalPrice] = applyBulkDiscount(count, totalOriginPrice, totalDiscountPrice);
  [rate, totalPrice] = getSpecialDiscountRate(rate, totalPrice);

  sumDiv.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (rate > 0) {
    let span = createSpan({
      text: `(${(rate * 100).toFixed(1)}% 할인 적용)`,
      className: 'text-green-500 ml-2',
    });
    sumDiv.appendChild(span);
  }

  updateStockInfo(prodList, stockInfoDiv);
  renderBonusPts(totalPrice, sumDiv);
}

export default calculateCart;
