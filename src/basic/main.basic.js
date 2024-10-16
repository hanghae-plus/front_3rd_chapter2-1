import Title from '../components/Title';
import Button from '../components/Button';
import Cart from '../components/Cart';
import Total from '../components/Total';
import Select from '../components/Select';
import StockInfo from '../components/StockInfo';
import Container from '../components/Container';

let selectElement, addButton, cartDisplay, totalElement, stockInfoElement;
let lastSelectedProduct,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0;

const productList = [
  { id: 'p1', name: '상품1', val: 10000, q: 50 },
  { id: 'p2', name: '상품2', val: 20000, q: 30 },
  { id: 'p3', name: '상품3', val: 30000, q: 20 },
  { id: 'p4', name: '상품4', val: 15000, q: 0 },
  { id: 'p5', name: '상품5', val: 25000, q: 10 },
];

// 초기화 함수
const init = () => {
  const rootElement = document.getElementById('app');

  const title = Title('장바구니');
  const cart = Cart();
  const total = Total(0, 0);
  const select = Select();
  const button = Button('추가');
  const stockInfo = StockInfo();

  const combinedContent = title + cart + total + select + button + stockInfo;
  const container = Container(combinedContent);

  rootElement.innerHTML = container;

  cartDisplay = document.getElementById('cart-items');
  totalElement = document.getElementById('cart-total');
  selectElement = document.getElementById('product-select');
  addButton = document.getElementById('add-to-cart');
  stockInfoElement = document.getElementById('stock-status');

  updateSelectOptions();
  calcCart();
};

const calcCart = () => {
  totalAmount = 0;
  itemCount = 0;
  let subTotal = 0;
  const cartItems = Array.from(cartDisplay.children);

  cartItems.forEach((cartItem) => {
    const currentItem = productList.find((product) => product.id === cartItem.id);
    if (!currentItem) return;

    const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
    const itemTotal = currentItem.val * quantity;

    itemCount += quantity;
    subTotal += itemTotal;
    const discount = getDiscount(currentItem.id, quantity);

    totalAmount += itemTotal * (1 - discount);
  });

  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  const isTuesday = new Date().getDay() === 2;
  if (isTuesday) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  totalElement.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    const spanElement = document.createElement('span');
    spanElement.className = 'text-green-500 ml-2';
    spanElement.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    totalElement.appendChild(spanElement);
  }

  updateStockInfo();
  renderBonusPoint();
};

const updateStockInfo = () => {
  let infoMessage = '';

  productList.forEach((product) => {
    if (product.q < 5) {
      infoMessage += `${product.name}: ${product.q > 0 ? `재고부족 (${product.q}개 남음)` : `품절`}\n`;
    }
  });

  stockInfoElement.textContent = infoMessage;
};

const renderBonusPoint = () => {
  bonusPoint += Math.floor(totalAmount / 1000);
  let pointTag = document.getElementById('loyalty-points');

  if (!pointTag) {
    pointTag = document.createElement('span');
    pointTag.id = 'loyalty-points';
    pointTag.className = 'text-blue-500 ml-2';
    totalElement.appendChild(pointTag);
  }

  pointTag.textContent = `(포인트: ${bonusPoint})`;
};

const updateSelectOptions = () => {
  selectElement.innerHTML = '';

  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.id;
    option.textContent = `${product.name} - ${product.val}원`;

    if (product.q === 0) {
      option.disabled = true;
    }
    selectElement.appendChild(option);
  });
};

const setFlashSale = () => {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
};

const setSuggestDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const suggest = productList.find(
        (product) => product.id !== lastSelectedProduct && product.q > 0,
      );
      if (suggest) {
        alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
        suggest.val = Math.round(suggest.val * 0.95);
        updateSelectOptions();
      }
    }, 60000);
  }, Math.random() * 20000);
};

const createNewCarItem = (itemToAdd) => {
  const newItem = document.createElement('div');
  newItem.id = itemToAdd.id;
  newItem.class = 'flex justify-between items-center mb-2';
  newItem.innerHTML = `
    <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
    </div>`;

  cartDisplay.appendChild(newItem);
  itemToAdd.q--;
};

const handleQuantityChange = (item, itemToAdd) => {
  const newQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

  if (newQuantity <= itemToAdd.q) {
    item.querySelector('span').textContent =
      `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQuantity}`;
    itemToAdd.q--;
  } else {
    alert('재고가 부족합니다.');
  }
};

const handleAddButtonClick = () => {
  const selectItem = selectElement.value;
  const itemToAdd = productList.find((product) => product.id === selectItem);

  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);

    if (item) {
      handleQuantityChange(item, itemToAdd);
    } else {
      createNewCarItem(itemToAdd);
    }

    calcCart();
    lastSelectedProduct = selectItem;
  }
};

const handleAddToCart = (e) => {
  const target = e.target;
  const hasClass =
    target.classList.contains('quantity-change') || target.classList.contains('remove-item');

  if (hasClass) {
    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = productList.find((product) => product.id === productId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      const newQuantity = currentQuantity + quantityChange;

      if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
        itemElement.querySelector('span').textContent =
          `${product.name} - ${product.val}원 x ${newQuantity}`;
        product.q -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.q += currentQuantity;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removeQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
      product.q += removeQuantity;
      itemElement.remove();
    }
    calcCart();
  }
};

const getDiscount = (itemId, quantity) => {
  if (quantity < 10) {
    return 0;
  }

  const discounts = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };

  return discounts[itemId] || 0;
};

function main() {
  init();
  setFlashSale();
  setSuggestDiscount();
}

main();
addButton.addEventListener('click', handleAddButtonClick);
cartDisplay.addEventListener('click', handleAddToCart);
