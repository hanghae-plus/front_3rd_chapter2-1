export const calcBonusPts = (currentBonus, totalAmt) =>
  currentBonus + Math.floor(totalAmt / 1000);

export const calcDiscountPrice = (price, ratio) => Math.round(price * ratio);

export const getAmount = (element) =>
  parseInt(element.querySelector('span').textContent.split('x ')[1]);

export const getPriceTxt = (element) =>
  element.querySelector('span').textContent.split('x ')[0];

export const calTotalAmount = (total, ratio) => {
  return total * (1 - ratio);
};
