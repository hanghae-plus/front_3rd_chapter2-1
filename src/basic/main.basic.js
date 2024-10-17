import cartPage from './page/cartPage.js';
import { PRODUCT_LIST } from './data/storeData.js';
import { updateProductSelect } from './components/productSelect.js';
import { calculateCart } from './components/cartTotal.js';
import { startLightningSale, startSuggestionSale } from './components/timeSale.js';
import { handleAddCart } from './events/handleAddCart.js';
import { handleCartAction } from './events/handleCartAction.js';

document.getElementById('app').innerHTML = cartPage();

const cartTotal = document.getElementById('cart-total');
const productSelect = document.getElementById('product-select');
const addCartBtn = document.getElementById('add-to-cart');
const cartList = document.getElementById('cart-items');
const stockStatus = document.getElementById('stock-status');
const productList = PRODUCT_LIST;

const cartContext = {
  productSelect, productList, cartList, cartTotal, stockStatus
}

function main() {
  updateProductSelect(productList, productSelect);
  calculateCart(cartList, productList, cartTotal);

  // 이벤트 리스너 등록
  addCartBtn.addEventListener('click', () => handleAddCart(cartContext));
  cartList.addEventListener('click', (event) => handleCartAction(event, cartContext));
  
  // 할인 이벤트 시작
  startLightningSale(productList, updateProductSelect);
  startSuggestionSale(productList, null, updateProductSelect); 
 
}

main();

