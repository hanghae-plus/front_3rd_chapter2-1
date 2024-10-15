const cartInfo = {
  totalAmount: 0,
  itemCount: 0,
  bonusPoint: 0,
  lastAddedProduct: "",
}

// cartInfo에 접근하는 함수
export const getCartInfo = () => cartInfo

// cartInfo 값을 변경하는 함수
export const updateCartInfo = (key, value) => {
  if (cartInfo.hasOwnProperty(key)) {
    cartInfo[key] = value
  }
}

// cartInfo를 초기화하는 함수
export const initCartInfo = () => {
  cartInfo.totalAmount = 0
  cartInfo.itemCount = 0
  cartInfo.bonusPoint = 0
  cartInfo.lastAddedProduct = ""
}
