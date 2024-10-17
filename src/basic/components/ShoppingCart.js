import {
  createButtonElement,
  createElement,
  updateSelectOptions
} from '../utils';

const PRODUCT_BULK_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
};

const ShoppingCart = (() => {
  let state = {
    productList: [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 }
    ],
    lastSelectedProduct: null,
    loyaltyPoints: 0,
    totalAmount: 0,
    totalItemCount: 0
  };

  let elements = {};

  const createElements = () => {
    const rootElement = document.getElementById('app');
    const containerElement = createElement('div', {
      className: 'bg-gray-100 p-8'
    });
    const wrapperElement = createElement('div', {
      className:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'
    });

    elements = {
      containerElement,
      wrapperElement,
      headerText: createElement('h1', {
        className: 'text-2xl font-bold mb-4',
        textContent: '장바구니'
      }),
      cartItemsDisplay: createElement('div', { id: 'cart-items' }),
      cartTotalDisplay: createElement('div', {
        id: 'cart-total',
        className: 'text-xl font-bold my-4'
      }),
      productSelect: createElement('select', {
        id: 'product-select',
        className: 'border rounded p-2 mr-2'
      }),
      addToCartButton: createElement('button', {
        id: 'add-to-cart',
        className: 'bg-blue-500 text-white px-4 py-2 rounded',
        textContent: '추가'
      }),
      stockStatusDisplay: createElement('div', {
        id: 'stock-status',
        className: 'text-sm text-gray-500 mt-2'
      })
    };

    Object.values(elements)
      .filter(
        (element) => element !== containerElement && element !== wrapperElement
      )
      .forEach((element) => wrapperElement.appendChild(element));

    containerElement.appendChild(wrapperElement);
    rootElement.appendChild(containerElement);

    updateSelectOptions(state.productList, elements.productSelect);
  };

  const updateCartTotalDisplay = (discountRate) => {
    elements.cartTotalDisplay.textContent = `총액: ${Math.round(state.totalAmount)}원`;
    if (discountRate > 0) {
      const discountSpan = createElement('span', {
        className: 'text-green-500 ml-2',
        textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
      });
      elements.cartTotalDisplay.appendChild(discountSpan);
    }
  };

  const getDiscountRate = (productId) => {
    const discountRates = PRODUCT_BULK_DISCOUNT_RATE;
    return discountRates[productId] || 0;
  };

  const calculateDiscountRate = (itemCount, subtotal) => {
    if (itemCount >= 30) {
      const bulkDiscount = state.totalAmount * 0.25;
      const itemDiscount = subtotal - state.totalAmount;
      return bulkDiscount > itemDiscount
        ? 0.25
        : (subtotal - state.totalAmount) / subtotal;
    }
    return (subtotal - state.totalAmount) / subtotal;
  };

  const calculateCart = () => {
    const renderLoyaltyPoints = () => {
      state.loyaltyPoints += Math.floor(state.totalAmount / 1000);
      let pointsTag = document.getElementById('loyalty-points');
      if (!pointsTag) {
        pointsTag = createElement('span', {
          id: 'loyalty-points',
          className: 'text-blue-500 ml-2'
        });
        elements.cartTotalDisplay.appendChild(pointsTag);
      }
      pointsTag.textContent = `(포인트: ${state.loyaltyPoints})`;
    };

    state.totalAmount = 0;
    state.totalItemCount = 0;
    const cartItems = Array.from(elements.cartItemsDisplay.children); // HTMLCollection을 배열로 변환
    let subtotal = 0;

    const { totalAmount, totalItemCount } = cartItems.reduce(
      (acc, cartItem) => {
        const currentProduct = state.productList.find(
          (prod) => prod.id === cartItem.id
        );
        const quantity = parseInt(
          cartItem.querySelector('span').textContent.split('x ')[1]
        );
        const itemTotal = currentProduct.val * quantity;
        let discount = 0;

        acc.totalItemCount += quantity;
        subtotal += itemTotal;

        if (quantity >= 10) {
          discount = getDiscountRate(currentProduct.id);
        }

        acc.totalAmount += itemTotal * (1 - discount);
        return acc;
      },
      { totalAmount: 0, totalItemCount: 0 }
    );

    state.totalAmount = totalAmount;
    state.totalItemCount = totalItemCount;

    let discountRate = calculateDiscountRate(state.totalItemCount, subtotal);

    if (new Date().getDay() === 2) {
      state.totalAmount *= 0.9;
      discountRate = Math.max(discountRate, 0.1);
    }

    updateCartTotalDisplay(discountRate);
    updateStockStatus();
    renderLoyaltyPoints();
  };

  const updateStockStatus = () => {
    const statusMessage = state.productList
      .filter((product) => product.q < 5)
      .map(
        (product) =>
          `${product.name}: ${product.q > 0 ? `재고 부족 (${product.q}개 남음)` : '품절'}`
      )
      .join('\n');
    elements.stockStatusDisplay.textContent = statusMessage;
  };

  const setupEventListeners = () => {
    elements.addToCartButton.addEventListener('click', addToCart);
    elements.cartItemsDisplay.addEventListener('click', handleCartAction);
  };

  const handleLuckySale = () => {
    const luckyProduct =
      state.productList[Math.floor(Math.random() * state.productList.length)];
    if (Math.random() < 0.3 && luckyProduct.q > 0) {
      luckyProduct.val = Math.round(luckyProduct.val * 0.8);
      alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
      updateSelectOptions(state.productList, elements.productSelect);
    }
  };

  const handleSuggestion = () => {
    if (state.lastSelectedProduct) {
      const suggestedProduct = state.productList.find(
        (product) => product.id !== state.lastSelectedProduct && product.q > 0
      );
      if (suggestedProduct) {
        alert(
          `${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        suggestedProduct.val = Math.round(suggestedProduct.val * 0.95);
        updateSelectOptions(state.productList, elements.productSelect);
      }
    }
  };

  const setupIntervals = () => {
    setTimeout(() => {
      setInterval(handleLuckySale, 30000);
    }, Math.random() * 10000);

    setTimeout(() => {
      setInterval(handleSuggestion, 60000);
    }, Math.random() * 20000);
  };

  const updateExistingCartItem = (cartItem, product) => {
    const newQuantity =
      parseInt(cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
    if (newQuantity <= product.q) {
      cartItem.querySelector('span').textContent =
        `${product.name} - ${product.val}원 x ${newQuantity}`;
      product.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const createNewCartItem = (product) => {
    const newItem = createElement('div', {
      id: product.id,
      className: 'flex justify-between items-center mb-2'
    });

    const itemInfoSpan = createElement('span', {
      textContent: `${product.name} - ${product.val}원 x 1`
    });

    const buttonContainer = createElement('div');

    const decreaseButton = createButtonElement(
      '-',
      'quantity-change',
      product.id,
      '-1'
    );
    const increaseButton = createButtonElement(
      '+',
      'quantity-change',
      product.id,
      '1'
    );
    const removeButton = createButtonElement('삭제', 'remove-item', product.id);

    buttonContainer.append(decreaseButton, increaseButton, removeButton);
    newItem.append(itemInfoSpan, buttonContainer);
    elements.cartItemsDisplay.appendChild(newItem);
    product.q--;
  };

  const addToCart = () => {
    const selectedProductId = elements.productSelect.value;
    const productToAdd = state.productList.find(
      (p) => p.id === selectedProductId
    );
    if (productToAdd && productToAdd.q > 0) {
      let cartItem = document.getElementById(productToAdd.id);
      if (cartItem) {
        updateExistingCartItem(cartItem, productToAdd);
      } else {
        createNewCartItem(productToAdd);
      }
      calculateCart();
      state.lastSelectedProduct = selectedProductId;
    }
  };

  const handleRemoveItem = (cartItemElement, product) => {
    const removedQuantity = parseInt(
      cartItemElement.querySelector('span').textContent.split('x ')[1]
    );
    product.q += removedQuantity;
    cartItemElement.remove();
  };

  const handleCartAction = (event) => {
    const targetElement = event.target;
    if (
      targetElement.classList.contains('quantity-change') ||
      targetElement.classList.contains('remove-item')
    ) {
      const productId = targetElement.dataset.productId;
      const cartItemElement = document.getElementById(productId);
      const product = state.productList.find((p) => p.id === productId);

      if (targetElement.classList.contains('quantity-change')) {
        handleQuantityChange(
          cartItemElement,
          product,
          parseInt(targetElement.dataset.change)
        );
      } else if (targetElement.classList.contains('remove-item')) {
        handleRemoveItem(cartItemElement, product);
      }

      calculateCart();
    }
  };

  const handleQuantityChange = (cartItemElement, product, quantityChange) => {
    const itemInfoSpan = cartItemElement.querySelector('span');
    const currentQuantity = parseInt(itemInfoSpan.textContent.split('x ')[1]);
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity > 0 && newQuantity <= product.q + currentQuantity) {
      itemInfoSpan.textContent = `${itemInfoSpan.textContent.split('x ')[0]}x ${newQuantity}`;
      product.q -= quantityChange;
    } else if (newQuantity <= 0) {
      cartItemElement.remove();
      product.q -= quantityChange;
    } else {
      alert('재고가 부족합니다.');
    }
  };

  return {
    init: () => {
      createElements();
      setupEventListeners();
      calculateCart();
      setupIntervals();
    }
  };
})();

export default ShoppingCart;
