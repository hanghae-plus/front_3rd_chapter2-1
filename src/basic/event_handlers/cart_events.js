import { prodList } from '../constant';
import { lastSelObservable } from '../observable';
import { updateExistingItem, addNewItemToCart, calcCart, handleQuantityChange, removeItem } from '../services';

// 이벤트 초기화
export const initEvents = (addBtn, cartItems, productSel, cartTotal, stockStatus) => {
  addBtn.addEventListener('click', () => {
    const selItem = productSel.value;
    const prod = prodList.find((p) => p.id === selItem);
    if (!prod) return alert('상품을 찾을 수 없습니다.');

    const itemEl = document.getElementById(prod.id);

    if (itemEl) {
      updateExistingItem(itemEl, prod);
    } else {
      addNewItemToCart(cartItems, prod);
    }

    lastSelObservable.notify(selItem);

    calcCart(cartItems, cartTotal, stockStatus, prodList);
  });

  cartItems.addEventListener('click', (event) => {
    const tgt = event.target;
    if (tgt.classList.contains('quantity-change')) {
      handleQuantityChange(tgt, cartItems, cartTotal, stockStatus);
    } else if (tgt.classList.contains('remove-item')) {
      removeItem(tgt, cartItems, cartTotal, stockStatus);
    }
  });
};
