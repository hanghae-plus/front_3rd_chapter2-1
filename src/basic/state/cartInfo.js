/**
 * 장바구니 정보
 */
const cartInfo = {
  totalAmount: 0,
  itemCount: 0,
  bonusPoint: 0,
  lastAddedProduct: '',
};

/**
 * cartInfo에 접근하는 함수
 * @returns cartInfo
 */
export const getCartInfo = () => cartInfo;

/**
 * cartInfo 값을 변경하는 함수
 * @param {*} key
 * @param {*} value
 */
export const updateCartInfo = (key, value) => {
  if (Object.prototype.hasOwnProperty.call(cartInfo, key)) {
    cartInfo[key] = value;
  }
};

/**
 * cartInfo 초기화
 */
export const initCartInfo = () => {
  cartInfo.totalAmount = 0;
  cartInfo.itemCount = 0;
  cartInfo.bonusPoint = 0;
  cartInfo.lastAddedProduct = '';
};
