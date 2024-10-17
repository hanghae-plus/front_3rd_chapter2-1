import { createTitle } from './createElements';
import { createCartItemsDiv, createContainer, createWrapper, createCartTotalDiv, createProductSelect, createAddToCartButton, createStockStatusDiv } from "./views/components";
import { assembleComponents } from "./views/utils"


/**
 * @function renderApp
 * @description 앱 UI를 초기화하고 구성 요소 반환
 * 
 * @returns {HTMLElement} 장바구니 앱 컨테이너 요소
 */

const renderApp = () => {
  const container = createContainer();
  const wrapper = createWrapper();
  const title = createTitle('장바구니');
  const cartItemsDiv = createCartItemsDiv();
  const cartTotalDiv = createCartTotalDiv();
  const productSelect = createProductSelect();
  const addToCartButton = createAddToCartButton();
  const stockStatusDiv = createStockStatusDiv();

  assembleComponents(wrapper, title, cartItemsDiv, cartTotalDiv, productSelect, addToCartButton, stockStatusDiv);
  container.appendChild(wrapper);
  return container;
};

export default renderApp;