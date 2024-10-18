import { calcCart } from '../elements';
import { prodList } from '../constant';

// 할인율 계산
export const getDiscountRate = (subTot, totalAmt, itemCnt) => {
  const bulkDisc = itemCnt >= 30 ? 0.25 : 0;
  const itemDisc = (subTot - totalAmt) / subTot || 0;
  const discRate = Math.max(bulkDisc, itemDisc);
  return new Date().getDay() === 2 ? Math.max(discRate, 0.1) : discRate;
};

// 현재 아이템의 수량을 가져오는 함수
export const getCurrentQuantity = (itemEl) => {
  const qtyText = itemEl.querySelector('span').textContent.split('x ')[1];
  return parseInt(qtyText);
};

// 아이템의 수량을 설정하는 함수
export const setItemQuantity = (itemEl, quantity) => {
  const nameAndPrice = itemEl.querySelector('span').textContent.split('x ')[0];
  itemEl.querySelector('span').textContent = `${nameAndPrice}x ${quantity}`;
};

// 할인된 상품의 가격을 카트에 반영하는 함수
export const updateCartItemPrices = (discountedProduct) => {
  const itemEl = document.getElementById(discountedProduct.id);
  if (itemEl) {
    const qty = getCurrentQuantity(itemEl);
    const nameAndPrice = `${discountedProduct.name} - ${discountedProduct.val}원`;
    itemEl.querySelector('span').textContent = `${nameAndPrice} x ${qty}`;
  }
};

// 기존 아이템의 수량을 업데이트하는 함수
export const updateExistingItem = (itemEl, prod) => {
  const currentQty = getCurrentQuantity(itemEl);
  const newQty = currentQty + 1;

  // 재고 수량이 충분한지 확인
  if (newQty > prod.q + currentQty) {
    alert('재고가 부족합니다.');
    return;
  }

  // 아이템 수량 업데이트 및 재고 감소
  setItemQuantity(itemEl, newQty);
  prod.q -= 1;
};

// 수량 변경 처리
export const handleQuantityChange = (target, cartItems, cartTotal, stockStatus) => {
  const prodId = target.dataset.productId;
  const qtyChange = parseInt(target.dataset.change);
  const itemEl = document.getElementById(prodId);
  const prod = prodList.find((p) => p.id === prodId);

  const newQty = getCurrentQuantity(itemEl) + qtyChange;
  if (newQty >= 0 && newQty <= prod.q + getCurrentQuantity(itemEl)) {
    setItemQuantity(itemEl, newQty);
    if (newQty === 0) itemEl.remove();

    prod.q -= qtyChange;
  } else {
    alert('재고가 부족합니다.');
  }
  console.table(prodList);

  calcCart(cartItems, cartTotal, stockStatus, prodList);
};

// 카트 아이템 값 계산
export const getCartItemsValue = (cartItems, products) => {
  return [...cartItems].reduce(
    ({ subTot, totalAmt, itemCnt }, cartItem) => {
      const curItem = products.find((p) => p.id === cartItem.id);
      const qty = getCurrentQuantity(cartItem);
      const curItemTotalValue = curItem.val * qty;
      const discPerItem = qty < 10 ? 0 : curItem.disc;

      return {
        subTot: subTot + curItemTotalValue,
        totalAmt: totalAmt + curItemTotalValue * (1 - discPerItem),
        itemCnt: itemCnt + qty,
      };
    },
    { subTot: 0, totalAmt: 0, itemCnt: 0 },
  );
};

// 카트에서 아이템 제거
export const removeItem = (target, cartItems, cartTotal, stockStatus) => {
  const prodId = target.dataset.productId;
  const itemEl = document.getElementById(prodId);
  const prod = prodList.find((p) => p.id === prodId);
  const remQty = getCurrentQuantity(itemEl);

  prod.q += remQty;
  itemEl.remove();

  calcCart(cartItems, cartTotal, stockStatus, prodList);
};
