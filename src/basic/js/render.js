import { calcCart } from './cart.js';
import { ALERT_SHORT_STOCK, PRODUCT_LIST } from './constants.js';
import { productSelectDropDown, renderCart } from './layout.js';

let renderTotalAmount = 0;

const renderProductList = () => {
  productSelectDropDown.innerHTML = '';

  PRODUCT_LIST.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.price}원`;

    if (product.stock === 0) {
      option.disabled = true;
    }

    productSelectDropDown.appendChild(option);
  });
};

const renderBonusPoints = (totalAmount) => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    document.getElementById('cart-total').appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${Math.floor(totalAmount / 1000)})`;
};

const renderCartProductElement = (productToAdd, qty = 1) => {
  const newProduct = document.createElement('div');
  newProduct.id = productToAdd.id;
  newProduct.className = 'flex justify-between items-center mb-2';
  newProduct.innerHTML = `
      <span>${productToAdd.name} - ${productToAdd.price}원 x ${qty}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${productToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${productToAdd.id}">삭제</button>
      </div>
    `;
  return newProduct;
};
const initRenderCartBtnEventListeners = () => {
  renderCart.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
      return;
    }

    const productId = target.dataset.productId;
    const productIdElement = document.getElementById(productId);
    const product = PRODUCT_LIST.find((product) => product.id === productId);
    const currentQty = parseInt(productIdElement.querySelector('span').textContent.split('x ')[1]);

    if (target.classList.contains('quantity-change')) {
      const qtyChange = parseInt(target.dataset.change);
      const newQty = currentQty + qtyChange;

      if (newQty > 0 && newQty <= product.stock + currentQty) {
        productIdElement.querySelector('span').textContent =
          `${productIdElement.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
        product.stock -= qtyChange;
      } else if (newQty <= 0) {
        productIdElement.remove();
        product.stock -= qtyChange;
      } else {
        alert(ALERT_SHORT_STOCK);
      }
    } else if (target.classList.contains('remove-item')) {
      product.stock += currentQty;
      productIdElement.remove();
    }

    calcCart();
  });
};

export {
  renderProductList,
  renderBonusPoints,
  renderCartProductElement,
  renderTotalAmount,
  initRenderCartBtnEventListeners,
};
