import { eDays } from './shared/enums';
import {
  ENTIRE_DISCOUNT_RATE,
  DAY_DISCOUNT_RATE,
  ONE_SECOND,
  ONE_MINUTE,
  INCREASE,
  DECREASE,
} from './shared/constants';
import { checkSaleDay, createElement, getCartInfoFromElements } from '../utils';
import { myCart } from './store/my-cart';

const globalState = {
  inventory: [
    { id: 'p1', name: '상품1', cost: 10000, stock: 50, discountRate: 0.1 },
    { id: 'p2', name: '상품2', cost: 20000, stock: 30, discountRate: 0.15 },
    { id: 'p3', name: '상품3', cost: 30000, stock: 20, discountRate: 0.2 },
    { id: 'p4', name: '상품4', cost: 15000, stock: 0, discountRate: 0.05 },
    { id: 'p5', name: '상품5', cost: 25000, stock: 10, discountRate: 0.25 },
  ],
  bonusPoints: 0,
  lastSelected: '',
};

function updateProducts(productSeletElement) {
  const productOptionElements = [];
  globalState.inventory.forEach(({ id, name, cost, stock }) => {
    const nameAndCost = name + ' - ' + cost + '원';
    const productOptionElement = createElement({
      tagName: 'option',
      textContent: nameAndCost,
    });
    productOptionElement.value = id;
    if (stock === 0) {
      productOptionElement.disabled = true;
    }

    productOptionElements.push(productOptionElement);
  });

  productSeletElement.replaceChildren(...productOptionElements);
}

function findProductById(targetId) {
  return globalState.inventory.find((product) => product.id === targetId);
}

function calculateDiscountedPrice(cost, count, discountRate) {
  if (count >= 10) {
    return cost * count * (1 - discountRate);
  } else {
    return cost * count;
  }
}

function checkBulkDiscountBetter(undiscountedPrice, discountedPrice) {
  return (
    undiscountedPrice * ENTIRE_DISCOUNT_RATE >
    undiscountedPrice - discountedPrice
  );
}

function renderFinalPrice(undiscountedPrice, discountedPrice) {
  const cartTotalElement = document.getElementById('cart-total');
  cartTotalElement.textContent = '총액: ' + Math.round(discountedPrice) + '원';
  if (undiscountedPrice - discountedPrice > 0) {
    const finalDiscountPercent =
      ((undiscountedPrice - discountedPrice) / undiscountedPrice) * 100;
    const discountTextElement = createElement({
      tagName: 'span',
      classNames: ['text-green-500', 'ml-2'],
      textContent: `(${finalDiscountPercent.toFixed(1)}% 할인 적용)`,
    });
    cartTotalElement.appendChild(discountTextElement);
  }
}

function updateStockInfo() {
  const infoMessages = [];
  globalState.inventory.forEach((item) => {
    if (item.stock < 5) {
      let infoText = `재고 부족 (${item.stock}개 남음)`;
      if (item.stock === 0) {
        infoText = '품절';
      }
      infoMessages.push(`${item.name}: ${infoText}\n`);
    }
  });
  const stockInfoElement = document.getElementById('stock-status');
  stockInfoElement.textContent = infoMessages;
}

function renderBonusPoints(discountedPrice) {
  globalState.bonusPoints += Math.floor(discountedPrice / 1000);
  let pointsElement = document.getElementById('loyalty-points');
  if (!pointsElement) {
    const cartTotalElement = document.getElementById('cart-total');
    pointsElement = createElement({
      tagName: 'span',
      id: 'loyalty-points',
      classNames: ['text-blue-500', 'ml-2'],
    });
    cartTotalElement.appendChild(pointsElement);
  }
  pointsElement.textContent = `(포인트: ${globalState.bonusPoints})`;
}

function calculateCart() {
  let undiscountedPrice = 0;
  let discountedPrice = 0;

  const cartElement = document.getElementById('cart-items');
  const cartInfos = getCartInfoFromElements(Array.from(cartElement.children));
  const totalItemCnt = cartInfos.reduce((sum, { count }) => sum + count, 0);

  for (const cartInfo of cartInfos) {
    const { count, productId } = cartInfo;
    const { cost, discountRate } = findProductById(productId);

    undiscountedPrice += cost * count;
    discountedPrice += calculateDiscountedPrice(cost, count, discountRate);
  }

  if (
    totalItemCnt >= 30 &&
    checkBulkDiscountBetter(undiscountedPrice, discountedPrice)
  ) {
    discountedPrice = undiscountedPrice * ENTIRE_DISCOUNT_RATE;
  }

  if (checkSaleDay(eDays.TUE)) {
    discountedPrice = undiscountedPrice * DAY_DISCOUNT_RATE;
  }

  renderFinalPrice(undiscountedPrice, discountedPrice);

  updateStockInfo();
  renderBonusPoints(discountedPrice);
}

function isLuckyVicky() {
  return Math.random() < 0.3;
}

function setRollBackCost(inSaleItem, originalCost, duration) {
  setTimeout(() => {
    inSaleItem.cost = originalCost;
  }, duration);
}

function setLuckyVickyItem() {
  setInterval(() => {
    const luckyVickyItem =
      globalState.inventory[
        Math.floor(Math.random() * globalState.inventory.length)
      ];
    const inStock = luckyVickyItem.stock > 0;

    if (inStock && isLuckyVicky()) {
      const originalCost = luckyVickyItem.cost;
      const discountedCost = Math.round(originalCost * 0.8);
      luckyVickyItem.cost = discountedCost;
      alert(`번개세일! ${luckyVickyItem.name}이(가) 20% 할인 중입니다!`);
      setRollBackCost(luckyVickyItem, originalCost, ONE_MINUTE);
    }
  }, 30 * ONE_SECOND);
}

function fishHogu() {
  setInterval(() => {
    if (globalState.lastSelected) {
      const mikkiProduct = globalState.inventory.find((item) => {
        return item.id !== globalState.lastSelected && item.stock > 0;
      });
      if (mikkiProduct) {
        alert(
          `${mikkiProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        const originalCost = mikkiProduct.cost;
        const discountedCost = Math.round(mikkiProduct.cost * 0.95);
        mikkiProduct.cost = discountedCost;
        setRollBackCost(mikkiProduct, originalCost, ONE_MINUTE);
      }
    }
  }, ONE_MINUTE);
}

function makeNewItemButtons(productId) {
  const buttonsElement = createElement({ tagName: 'div' });
  const decreaseBtnElement = createElement({
    tagName: 'button',
    classNames: [
      'quantity-change',
      'bg-blue-500',
      'text-white',
      'px-2',
      'py-1',
      'rounded',
      'mr-1',
    ],
    textContent: '-',
  });
  decreaseBtnElement.dataset.productId = productId;
  decreaseBtnElement.dataset.change = DECREASE;

  const increaseBtnElement = createElement({
    tagName: 'button',
    classNames: [
      'quantity-change',
      'bg-blue-500',
      'text-white',
      'px-2',
      'py-1',
      'rounded',
      'mr-1',
    ],
    textContent: '+',
  });
  increaseBtnElement.dataset.productId = productId;
  increaseBtnElement.dataset.change = INCREASE;

  const deleteBtnElement = createElement({
    tagName: 'button',
    classNames: [
      'remove-item',
      'bg-red-500',
      'text-white',
      'px-2',
      'py-1',
      'rounded',
    ],
    textContent: '삭제',
  });
  deleteBtnElement.dataset.productId = productId;

  buttonsElement.append(
    decreaseBtnElement,
    increaseBtnElement,
    deleteBtnElement
  );

  return buttonsElement;
}

function renderNewItemInCart(product) {
  const cartItemElement = createElement({
    tagName: 'div',
    id: product.id,
    classNames: ['flex', 'justify-between', 'items-center', 'mb-2'],
  });
  const innerTextElement = createElement({
    tagName: 'span',
  });
  const cartItemText = `${product.name} - ${product.cost}원 x 1`;
  innerTextElement.textContent = cartItemText;
  const buttonsElement = makeNewItemButtons(product.id);
  cartItemElement.append(innerTextElement, buttonsElement);

  const cartElement = document.getElementById('cart-items');
  cartElement.appendChild(cartItemElement);
}

function cartChangeHandler(event) {
  const { classList, dataset } = event.target;
  const { productId, change } = dataset;
  const product = globalState.inventory.find((item) => {
    return item.id === productId;
  });
  const itemElement = document.getElementById(productId);
  const cartItemCount = myCart.getItemCount(productId);
  if (classList.contains('quantity-change')) {
    const nChange = parseInt(change);
    const newCount = cartItemCount + nChange;
    if (newCount <= 0) {
      itemElement.remove();
      myCart.deleteItem(productId);
    } else {
      const inStock = nChange <= product.stock;
      if (inStock) {
        product.stock -= nChange;
        myCart.setItemCount(productId, nChange);
        setItemTextContent(itemElement);
      } else {
        alert('재고가 부족합니다.');
      }
    }
  } else if (classList.contains('remove-item')) {
    product.stock += cartItemCount;
    itemElement.remove();
    myCart.deleteItem(productId);
  }
  calculateCart();
}

function addBtnHandler(event) {
  const productId = document.getElementById('product-select').value;
  const product = globalState.inventory.find((item) => {
    return item.id === productId;
  });
  const itemElement = document.getElementById(productId);
  const inStock = product && product.stock > 0;
  if (inStock) {
    if (!itemElement) {
      renderNewItemInCart(product);
      myCart.addItem(productId);
      product.stock--;
    } else {
      myCart.setItemCount(productId, INCREASE);
      product.stock--;
      setItemTextContent(itemElement);
    }
  } else {
    alert('재고가 부족합니다.');
  }
  calculateCart();
  globalState.lastSelected = productId;
}

function setItemTextContent(itemElement) {
  const textContentElement = itemElement.querySelector('span');
  const orgTextContent = textContentElement.textContent.split('x ')[0];
  const newCount = myCart.getItemCount(itemElement.id);
  textContentElement.textContent = `${orgTextContent}x ${newCount}`;
}

function renderElements() {
  const wrapElement = createElement({
    tagName: 'div',
    classNames: [
      'max-w-md',
      'mx-auto',
      'bg-white',
      'rounded-xl',
      'shadow-md',
      'overflow-hidden',
      'md:max-w-2xl',
      'p-8',
    ],
  });

  const hTxtElement = createElement({
    tagName: 'h1',
    classNames: ['text-2xl', 'font-bold', 'mb-4'],
    textContent: '장바구니',
  });
  const cartElement = createElement({
    tagName: 'div',
    id: 'cart-items',
  });
  cartElement.addEventListener('click', cartChangeHandler);

  const cartTotalElement = createElement({
    tagName: 'div',
    id: 'cart-total',
    classNames: ['text-xl', 'font-bold', 'my-4'],
  });
  const productSelectElement = createElement({
    tagName: 'select',
    id: 'product-select',
    classNames: ['border', 'rounded', 'p-2', 'mr-2'],
  });
  updateProducts(productSelectElement);

  const addBtnElement = createElement({
    tagName: 'button',
    id: 'add-to-cart',
    classNames: ['bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded'],
    textContent: '추가',
  });
  addBtnElement.addEventListener('click', addBtnHandler);

  const stockInfoElement = createElement({
    tagName: 'div',
    id: 'stock-status',
    classNames: ['text-sm', 'text-gray-500', 'mt-2'],
  });

  wrapElement.append(
    hTxtElement,
    cartElement,
    cartTotalElement,
    productSelectElement,
    addBtnElement,
    stockInfoElement
  );

  const containerElement = createElement({
    tagName: 'div',
    classNames: ['bg-gray-100', 'p-8'],
  });
  containerElement.appendChild(wrapElement);
  const rootElement = document.getElementById('app');
  rootElement.appendChild(containerElement);
  calculateCart(cartElement);
}

function main() {
  renderElements();
  setTimeout(setLuckyVickyItem, Math.random() * 10 * ONE_SECOND);
  setTimeout(fishHogu, Math.random() * 20 * ONE_SECOND);
}

main();
