import calculateCart from '../utils/calculateCart';
import {
  createBtn,
  createDiv,
  createSelect,
  createTitle,
} from '../utils/createElements';
import { cartList, productList } from '../data/global';
import { renderCartItem, reRenderCartItem } from '../components/renderCartItem';

const renderHome = () => {
  const $content = createDiv({ className: 'bg-gray-100 p-8' });
  const $wrap = createDiv({
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const $title = createTitle('장바구니');
  const $cartList = createDiv({ id: 'cart-items' });
  const $total = createDiv({
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  const $select = createSelect({
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  const $addBtn = createBtn({ id: 'add-to-cart', text: '추가' });
  const $stock = createDiv({
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  $wrap.appendChild($title);
  $wrap.appendChild($cartList);
  $wrap.appendChild($total);
  $wrap.appendChild($select);
  $wrap.appendChild($addBtn);
  $wrap.appendChild($stock);
  $content.appendChild($wrap);

  $addBtn.addEventListener('click', handleAdd);
  $cartList.addEventListener('click', handleClickCartList);

  return $content;
};

function handleAdd() {
  const product = productList.getLastSelectedItem();
  if (product.isSoldOut()) return alert('재고가 부족합니다.');
  const { id, name, price } = product.toObject();

  // 장바구니에 이미 있는 상품인 경우
  if (cartList.hasItem(id)) {
    cartList.getItem(id).increaseQuantity();
    reRenderCartItem(id);
  }
  // 장바구니에 없는 상품인 경우
  else {
    cartList.addItem({ ...product.toObject(), quantity: 1 });
    renderCartItem({ id, name, price });
  }

  product.decreaseQuantity();

  calculateCart();
}

function handleClickCartList(event) {
  const $target = event.target;
  const isChangeButton = $target.classList.contains('quantity-change');
  const changeValue = parseInt($target.dataset.change);

  const isPlusButton = isChangeButton && changeValue >= 0;
  const isMinusButton = isChangeButton && changeValue < 0;
  const isRemoveButton = $target.classList.contains('remove-item');

  if (!isPlusButton && !isMinusButton && !isRemoveButton) return null;

  const id = $target.dataset.productId;
  const cart = cartList.getItem(id);
  const product = productList.getItem(id);

  if (isPlusButton) {
    const isSoldOut = product.isSoldOut();
    const isQuantityNotEnough = product.getQuantity() - changeValue < 0;
    if (isSoldOut || isQuantityNotEnough) return alert('재고가 부족합니다.');

    cart.increaseQuantity(changeValue);
    product.decreaseQuantity(changeValue);
  } else if (isMinusButton) {
    const isRemove = cart.getQuantity() + changeValue === 0;
    if (isRemove) cartList.removeItem(id);
    else cart.decreaseQuantity(-changeValue);

    product.increaseQuantity(-changeValue);
  } else if (isRemoveButton) {
    product.increaseQuantity(cart.getQuantity());
    cartList.removeItem(id);
  }

  reRenderCartItem(id);
  calculateCart();
}

export default renderHome;
