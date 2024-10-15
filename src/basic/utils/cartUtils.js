import { HeaderText, CartDisplay, TotalPrice, ProductSelect, AddButton, StockInfo, CartItem } from "../components"
import { STOCK_OUT_MESSAGE } from "../constants"
import { productList } from "../data"
import { updateCartInfo } from "../state"
import { calculatorCart } from "./calculatorUtils"
/**
 * 레이아웃 초기화
 */
export const initCart = () => {
  const root = document.getElementById("app")
  const cont = document.createElement("div")
  const wrap = document.createElement("div")

  cont.className = "bg-gray-100 p-8"
  wrap.className = "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8"

  wrap.innerHTML += HeaderText()
  wrap.innerHTML += CartDisplay()
  wrap.innerHTML += TotalPrice()
  wrap.innerHTML += ProductSelect()
  wrap.innerHTML += AddButton()
  wrap.innerHTML += StockInfo()

  cont.appendChild(wrap)
  root.appendChild(cont)
}

/**
 * 상품 추가 버튼 클릭 이벤트 핸들러
 */
export const handleClickAddToCart = () => {
  const selectedProduct = document.getElementById("product-select").value
  const targetProduct = productList.find((product) => {
    return product.id === selectedProduct
  })

  if (targetProduct && targetProduct.quantity > 0) {
    const addProduct = document.getElementById(targetProduct.id)

    addToCart(addProduct, targetProduct)
    calculatorCart()
    updateCartInfo("lastAddedProduct", targetProduct)
  }
}

/**
 * 장바구니 추가
 * @param {*} addProduct
 * @param {*} targetProduct
 * @returns
 */
const addToCart = (addProduct, targetProduct) => {
  if (!addProduct) {
    createCartItem(targetProduct)
    return
  }

  if (addProduct) {
    updateCartItem(addProduct, targetProduct)
    return
  }
}

/**
 * 장바구니에 새로운 상품 추가
 * @param {*} createProduct
 */
const createCartItem = (createProduct) => {
  const cartItem = document.querySelector("#cart-items")

  const newItem = CartItem(createProduct)
  cartItem.innerHTML += newItem

  createProduct.quantity--
}

/**
 * 장바구니에 들어있는 상품의 수량 업데이트
 * @param {*} addProduct
 * @param {*} targetProduct
 * @returns
 */
const updateCartItem = (addProduct, targetProduct) => {
  const productText = addProduct.querySelector("span")
  const updateQuantity = parseInt(productText.textContent.split("x ")[1]) + 1

  if (updateQuantity <= targetProduct.quantity) {
    productText.textContent = `${targetProduct.name} - ${targetProduct.price}원 x ${updateQuantity}`
    targetProduct.quantity--
    return
  }

  if (updateQuantity > targetProduct.quantity) {
    alert(STOCK_OUT_MESSAGE)
    return
  }
}
