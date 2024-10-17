export default function plusPurchaseCount(productViewInCart) {
  return parseInt(productViewInCart.querySelector('span').textContent.split('x ')[1]) + 1;
}