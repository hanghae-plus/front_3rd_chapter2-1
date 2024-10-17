import { createElement } from './utils/createElement';

// const salesProductList = [
//   { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
//   { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
//   { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
//   { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
//   { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
// ];

// let lastSelectedProduct;
// let bonusPoints = 0,
//   totalAmount = 0,
//   itemCount = 0;

function initializeApp() {
  const root = document.getElementById('app');

  const $wrapper = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });

  const $container = createElement('div', {
    className: 'bg-gray-100 p-8',
  });

  const $heading = createElement('h1', {
    textContent: '장바구니',
  });

  // 리팩토링된 코드
  const cartContainer = createElement('div', {
    id: 'cart-items',
  });

  const productSelect = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });

  const totalAmountDisplay = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });

  const addToCartButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });

  const stockStatusDisplay = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  $wrapper.appendChild($heading);
  $wrapper.appendChild(cartContainer);
  $wrapper.appendChild(totalAmountDisplay);
  $wrapper.appendChild(productSelect);
  $wrapper.appendChild(addToCartButton);
  $wrapper.appendChild(stockStatusDisplay);
  $container.appendChild($wrapper);
  root.appendChild($container);

  // updateProductOptions();
  // updateCartDisplay();

  // setTimeout(function () {
  //   setInterval(function () {
  //     const luckyProduct = salesProductList[Math.floor(Math.random() * salesProductList.length)];
  //     if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
  //       luckyProduct.price = Math.round(luckyProduct.price * 0.8);
  //       alert('번개세일! ' + luckyProduct.name + '이(가) 20% 할인 중입니다!');
  //       updateProductOptions();
  //     }
  //   }, 30000);
  // }, Math.random() * 10000);

  // setTimeout(function () {
  //   setInterval(function () {
  //     if (lastSelectedProduct) {
  //       const suggestion = salesProductList.find(function (item) {
  //         return item.id !== lastSelectedProduct && item.quantity > 0;
  //       });
  //       if (suggestion) {
  //         alert(suggestion.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  //         suggestion.price = Math.round(suggestion.price * 0.95);
  //         updateProductOptions();
  //       }
  //     }
  //   }, 60000);
  // }, Math.random() * 20000);
}

// function updateProductOptions() {
//   productSelect.innerHTML = '';
//   salesProductList.forEach(function (product) {
//     const option = document.createElement('option');
//     option.value = product.id;

//     option.textContent = `${product.name} - ${product.price}원`;
//     if (product.quantity === 0) option.disabled = true;
//     productSelect.appendChild(option);
//   });
// }

// function updateCartDisplay() {
//   totalAmount = 0;
//   itemCount = 0;
//   const cartContainer = document.querySelector('#cart-items');
//   const cartItems = cartContainer.children;
//   let subTotal = 0;
//   for (let i = 0; i < cartItems.length; i++) {
//     (function () {
//       let currentProduct;
//       for (let j = 0; j < salesProductList.length; j++) {
//         if (salesProductList[j].id === cartItems[i].id) {
//           currentProduct = salesProductList[j];
//           break;
//         }
//       }

//       const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
//       const productTotal = currentProduct.price * quantity;
//       let discount = 0;
//       itemCount += quantity;
//       subTotal += productTotal;
//       if (quantity >= 10) {
//         if (currentProduct.id === 'p1') discount = 0.1;
//         else if (currentProduct.id === 'p2') discount = 0.15;
//         else if (currentProduct.id === 'p3') discount = 0.2;
//         else if (currentProduct.id === 'p4') discount = 0.05;
//         else if (currentProduct.id === 'p5') discount = 0.25;
//       }
//       totalAmount += productTotal * (1 - discount);
//     })();
//   }
//   let discountRate = 0;
//   if (itemCount >= 30) {
//     const bulkDiscount = totalAmount * 0.25;
//     const itemDiscount = subTotal - totalAmount;
//     if (bulkDiscount > itemDiscount) {
//       totalAmount = subTotal * (1 - 0.25);
//       discountRate = 0.25;
//     } else {
//       discountRate = (subTotal - totalAmount) / subTotal;
//     }
//   } else {
//     discountRate = (subTotal - totalAmount) / subTotal;
//   }

//   if (new Date().getDay() === 2) {
//     totalAmount *= 1 - 0.1;
//     discountRate = Math.max(discountRate, 0.1);
//   }
//   totalAmountDisplay.textContent = '총액: ' + Math.round(totalAmount) + '원';
//   if (discountRate > 0) {
//     const discountSpan = document.createElement('span');
//     discountSpan.className = 'text-green-500 ml-2';
//     discountSpan.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
//     totalAmountDisplay.appendChild(discountSpan);
//   }
//   updateStockStatus();
//   updateBonusPoints();
// }

// const updateBonusPoints = () => {
//   bonusPoints += Math.floor(totalAmount / 1000);
//   let pointsDisplay = document.getElementById('loyalty-points');

//   if (!pointsDisplay) {
//     pointsDisplay = document.createElement('span');
//     pointsDisplay.id = 'loyalty-points';
//     pointsDisplay.className = 'text-blue-500 ml-2';
//     totalAmountDisplay.appendChild(pointsDisplay);
//   }
//   pointsDisplay.textContent = '(포인트: ' + bonusPoints + ')';
// };

// function updateStockStatus() {
//   let stockMessage = '';
//   salesProductList.forEach(function (product) {
//     if (product.quantity < 5) {
//       stockMessage +=
//         product.name +
//         ': ' +
//         (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') +
//         '\n';
//     }
//   });
//   stockStatusDisplay.textContent = stockMessage;
// }

// initializeApp();

// addToCartButton.addEventListener('click', function () {
//   const selectedProductId = productSelect.value;
//   const productToAdd = salesProductList.find(function (product) {
//     return product.id === selectedProductId;
//   });
//   if (productToAdd && productToAdd.quantity > 0) {
//     const cartItem = document.getElementById(productToAdd.id);
//     if (cartItem) {
//       const newQuantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
//       if (newQuantity <= productToAdd.quantity) {
//         cartItem.querySelector('span').textContent =
//           `${productToAdd.name} - ${productToAdd.price}원 x ${newQuantity}`;
//         productToAdd.quantity--;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else {
//       const newCartItem = document.createElement('div');
//       newCartItem.id = productToAdd.id;
//       newCartItem.className = 'flex justify-between items-center mb-2';
//       newCartItem.innerHTML =
//         '<span>' +
//         productToAdd.name +
//         ' - ' +
//         productToAdd.price +
//         '원 x 1</span><div>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         productToAdd.id +
//         '" data-change="-1">-</button>' +
//         '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
//         productToAdd.id +
//         '" data-change="1">+</button>' +
//         '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
//         productToAdd.id +
//         '">삭제</button></div>';
//       cartContainer.appendChild(newCartItem);
//       productToAdd.quantity--;
//     }
//     updateCartDisplay();
//     lastSelectedProduct = selectedProductId;
//   }
// });

// cartContainer.addEventListener('click', function (event) {
//   const targetElement = event.target;

//   if (
//     targetElement.classList.contains('quantity-change') ||
//     targetElement.classList.contains('remove-item')
//   ) {
//     const productId = targetElement.dataset.productId;
//     const cartItemElement = document.getElementById(productId);
//     const product = salesProductList.find(function (p) {
//       return p.id === productId;
//     });
//     if (targetElement.classList.contains('quantity-change')) {
//       const quantityChange = parseInt(targetElement.dataset.change);
//       const newQuantity =
//         parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]) + quantityChange;
//       if (
//         newQuantity > 0 &&
//         newQuantity <=
//           product.quantity +
//             parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1])
//       ) {
//         cartItemElement.querySelector('span').textContent =
//           cartItemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity;
//         product.quantity -= quantityChange;
//       } else if (newQuantity <= 0) {
//         cartItemElement.remove();
//         product.quantity -= quantityChange;
//       } else {
//         alert('재고가 부족합니다.');
//       }
//     } else if (targetElement.classList.contains('remove-item')) {
//       const removedQuantity = parseInt(
//         cartItemElement.querySelector('span').textContent.split('x ')[1],
//       );
//       product.quantity += removedQuantity;
//       cartItemElement.remove();
//     }
//     updateCartDisplay();
//   }
// });

initializeApp();
