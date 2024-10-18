export default function plusPurchaseCount(productViewInCart, count = 1) {
  return parseQuantity(productViewInCart) + count;
}

export function parseQuantity(productViewInCart) {
  return parseInt(productViewInCart.querySelector('span').textContent.split('x ')[1]);
}