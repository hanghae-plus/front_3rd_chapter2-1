import { cartList } from '../data/cart';

const updateCartItem = (id) => {
  const $cartItem = document.getElementById(id);
  if (!cartList.hasItem(id)) return $cartItem.remove();

  const { name, price, quantity } = cartList.getItem(id).toObject();

  const $cartSpan = $cartItem.querySelector('span');
  $cartSpan.textContent = `${name} - ${price}원 x ${quantity}`;
};

export default updateCartItem;
