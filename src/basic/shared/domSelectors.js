export const getDOMElements = () => ({
  $root: document.getElementById('app'),
  $productSelect: document.getElementById('product-select'),
  $addToCartButton: document.getElementById('add-to-cart'),
  $cartProduct: document.getElementById('cart-items'),
  $cartTotal: document.getElementById('cart-total'),
  $stockStatus: document.getElementById('stock-status'),
  $pointsTag: document.getElementById('loyalty-points'),
});
