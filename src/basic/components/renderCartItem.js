import {
  createDiv,
  createQuantityChangeBtn,
  createRemoveBtn,
  createSpan,
} from '../utils/createElements';
import { cartList } from '../data/global';

export const renderCartItem = ({ id, name, price }) => {
  const $cartList = document.getElementById('cart-items');

  const $wrap = createDiv({
    id,
    className: 'flex justify-between items-center mb-2',
  });
  const $newCartSpan = createSpan({ text: `${name} - ${price}원 x 1` });
  const $buttonWrap = createDiv();
  const $minusBtn = createQuantityChangeBtn({
    id,
    text: '-',
    changeValue: '-1',
  });
  const $plusBtn = createQuantityChangeBtn({ id, text: '+', changeValue: '1' });
  const $removeBtn = createRemoveBtn({ id, text: '삭제', changeValue: '1' });

  $buttonWrap.appendChild($minusBtn);
  $buttonWrap.appendChild($plusBtn);
  $buttonWrap.appendChild($removeBtn);

  $wrap.appendChild($newCartSpan);
  $wrap.appendChild($buttonWrap);

  $cartList.appendChild($wrap);
};

export const reRenderCartItem = (id) => {
  const $cartItem = document.getElementById(id);
  if (!cartList.hasItem(id)) return $cartItem.remove();

  const { name, price, quantity } = cartList.getItem(id).toObject();

  const $cartSpan = $cartItem.querySelector('span');
  $cartSpan.textContent = `${name} - ${price}원 x ${quantity}`;
};
