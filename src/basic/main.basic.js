/**
 * constants : 어플리케이션에서 사용하는 상수를 정의합니다.
 */
const CONSTANTS = {
  // 금액 차감 - 대량
  DEDUCTION_QUALIFIED_BULK: 30,
  DEDUCTION_RATE_BULK: 0.75,
  // 금액 차감 - 요일
  DEDUCTION_QUALIFIED_WEEKDAY: 2,
  DEDUCITON_RATE_WEEKDAY: 0.9,
  // 할인 - 상품
  DISCOUNT_QUALIFIED_PRODUCT: 10,
  DISCOUNT_RATES_PRODUCT: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
  // 할인 - 번개
  DISCOUNT_RATE_LUCKY: 0.2,
  // 할인 - 추가제안
  DISCOUNT_RATE_EXTRA_SUGGETION: 0.05,
  // 간격 - 번개
  TIME_INTERVAL_LUCKY_SALE: 30,
  // 간격 - 추가제안
  TIME_INTERVAL_EXTRA_SUGGESTION: 60,
  // 밀리초
  MLSECONDS: 1000,
};

/**
 * messages : 어플리케이션에서 사용하는 메시지를 정의합니다.
 */
const MESSAGES = {
  OUT_OF_STOCK: '재고가 부족합니다.',
  PRODUCT_NOT_FOUND: '존재하지 않는 상품입니다.'
};


/**
 * utils : 어플리케이션에서 공통으로 사용하는 유틸리티 함수를 정의합니다.
 */
/**
 * DOM에서 첫 번째로 일치하는 요소를 선택하는 유틸리티 함수입니다.
 * jQuery의 $() 선택자 기능을 간단히 모방합니다.
 * @param {string} selector - 선택자 문자열
 * @returns {Element|null} 선택자와 일치하는 첫 번째 요소, 또는 일치하는 요소가 없으면 null
 */
const $ = (selector) => document.querySelector(selector);

/**
 * DOM에서 선택자와 일치하는 모든 요소를 선택하는 유틸리티 함수입니다.
 * jQuery의 $() 선택자 기능을 확장하여 모든 일치하는 요소를 반환합니다.
 * @param {string} selector - 선택자 문자열
 * @returns {NodeList} 선택자와 일치하는 모든 요소의 NodeList. 일치하는 요소가 없으면 빈 NodeList 반환
 */
const $$ = (selector) => document.querySelectorAll(selector);

/**
 * 지정된 태그와 속성으로 새로운 DOM 요소를 생성하는 유틸리티 함수입니다.
 * @param {string} tag - 생성할 HTML 요소의 태그 이름
 * @param {Object} [props={}] - 요소에 설정할 속성들을 포함하는 객체
 * @param {string} [props.class] - 요소의 클래스 이름 (className으로 설정됨)
 * @param {string} [props.textContent] - 요소의 텍스트 내용
 * @param {*} [props...] - 그 외 모든 속성은 setAttribute를 통해 설정됨
 * @returns {HTMLElement} 생성된 DOM 요소
 * 
 * @example const div = createElement('div', { class: 'container', id: 'main', textContent: 'Hello' });
 */
const createElement = (tag, props = {}) => {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

/**
 * 전역 변수
 * /src/main.js 의 전역변수를 참고하여 선언하고 초기화합니다.
 */
let productList,
  productSelectBox,
  addToCartButton,
  cartItemsDisplay,
  cartSummaryDisplay,
  stockInfoDisplay;
let lastSelectedProductId,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

/**
 * ShopApplication
 * 
 * 쇼핑 카트 애플리케이션의 주요 기능을 관리하는 클래스입니다.
 * 상품 목록 초기화, UI 표현, 장바구니 기능, 할인 적용 등 애플리케이션의 전반적인 로직을 처리합니다.
 * 싱글톤 패턴으로 구현하여 애플리케이션 전체에서 ShopApplication의 인스턴스가 하나만 존재하도록 하였습니다.
 * 
 * 주요 기능:
 * - 상품 목록 관리
 * - UI 요소 생성 및 업데이트
 * - 장바구니 아이템 추가/제거
 * - 가격 계산 및 할인, 포인트 적용
 * - 특가 세일 이벤트 처리
 */
class ShopApplication {
  constructor() {
    if (ShopApplication.instance) {
      return ShopApplication.instance;
    }
    ShopApplication.instance = this;

    this.initializeProductList();
    this.setupUI();
    this.setupEventListeners();
    // 특가 세일은 비동기적으로 일어나야 하기 때문에 생성자에서 제외합니다.
  }

  // 상품 목록을 초기화합니다.
  initializeProductList() {
    productList = [
      { id: 'p1', name: '상품1', price: 10000, stock: 50 },
      { id: 'p2', name: '상품2', price: 20000, stock: 30 },
      { id: 'p3', name: '상품3', price: 30000, stock: 20 },
      { id: 'p4', name: '상품4', price: 15000, stock: 0 },
      { id: 'p5', name: '상품5', price: 25000, stock: 10 },
    ];
  }

  // UI 요소를 생성합니다.
  setupUI() {
    const root = $('#app');
    const container = createElement('div', { class: 'bg-gray-100 p-8' });
    const wrapper = createElement('div', {
      class:
        'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    });
    const headerText = createElement('h1', {
      class: 'text-2xl font-bold mb-4',
      textContent: '장바구니',
    });

    // 장바구니 아이템 div
    cartItemsDisplay = createElement('div', { id: 'cart-items' });
    
    // 장바구니 요약(총액, 할인, 포인트) div
    cartSummaryDisplay = createElement('div', {
      id: 'cart-total',
      class: 'text-xl font-bold my-4',
    });
    
    // 상품 셀렉트 박스
    productSelectBox = createElement('select', {
      id: 'product-select',
      class: 'border rounded p-2 mr-2',
    });
    
    // 장바구니 추가 버튼
    addToCartButton = createElement('button', {
      id: 'add-to-cart',
      class: 'bg-blue-500 text-white px-4 py-2 rounded',
      textContent: '추가',
    });
    
    // 재고 정보 div
    stockInfoDisplay = createElement('div', {
      id: 'stock-status',
      class: 'text-sm text-gray-500 mt-2',
    });

    // 상품 셀렉트 박스에 옵션 목록 렌더링
    this.renderProductOptions();

    // 래핑 및 엘리먼트 추가
    wrapper.append(
      headerText,
      cartItemsDisplay,
      cartSummaryDisplay,
      productSelectBox,
      addToCartButton,
      stockInfoDisplay
    );
    container.appendChild(wrapper);
    root.appendChild(container);

    // 장바구니 요약 초기화
    this.summarizeCart();
  }

  // 이벤트 리스너를 설정합니다.
  setupEventListeners() {

    // '추가' 버튼 클릭: 선택된 상품을 장바구니에 추가합니다.
    addToCartButton.addEventListener('click', () => this.addItemToCart());
    
    // 장바구니 항목 클릭: 이벤트 위임을 사용하여 장바구니 내 버튼(수량 변경, 삭제 등) 클릭을 처리합니다.
    cartItemsDisplay.addEventListener('click', (event) =>
      this.handleCartButtonClick(event)
    );
  }

  // 장바구니 변경 사항에 따라 상품 재고, 장바구니 총액, 할인, 포인트를 계산하고 요약하여 화면에 표시합니다.
  summarizeCart() {
    itemCount = 0;
    totalAmount = 0;
    let subTotal = 0;
    const cartItems = $$('#cart-items > div');

    cartItems.forEach((cartItem) => {
      const currentProduct = this.findProductById(cartItem.id);
      const quantity = parseInt(
        cartItem.querySelector('span').textContent.split('x ')[1]
      );
      const itemTotal = currentProduct.price * quantity;
      const discountRate = this.getProductDiscountRate(
        currentProduct.id,
        quantity
      );

      itemCount += quantity;
      subTotal += itemTotal;
      totalAmount += itemTotal * (1 - discountRate);
    });

    this.applyDiscounts(subTotal);
    this.applyBonusPoints();
    this.renderCartSummaryDisplay();
    this.renderStockInfoDisplay();
    this.renderBonusPointsTag();
  }

  // 상품ID로 상품목록 내 상품을 찾습니다.
  findProductById(productId) {
    return productList.find((product) => product.id === productId);
  }

  // 상품 및 상품 재고 별 상품의 할인율을 반환합니다.
  getProductDiscountRate(productId, quantity) {
    return quantity >= CONSTANTS.DISCOUNT_QUALIFIED_PRODUCT
      ? CONSTANTS.DISCOUNT_RATES_PRODUCT[productId] ?? 0
      : 0;
  }

  // 할인을 적용합니다.
  applyDiscounts(subTotal) {
    if (itemCount >= CONSTANTS.DEDUCTION_QUALIFIED_BULK) {
      totalAmount = Math.min(
        totalAmount,
        subTotal * CONSTANTS.DEDUCTION_RATE_BULK
      );
    }
    if (new Date().getDay() === CONSTANTS.DEDUCTION_QUALIFIED_WEEKDAY) {
      totalAmount *= CONSTANTS.DEDUCITON_RATE_WEEKDAY;
    }
  }

  // 포인트를 적용합니다.
  applyBonusPoints() {
    bonusPoints += Math.floor(totalAmount / 1000);
  }

  // 장바구니 요약 정보를 화면에 표시합니다.
  renderCartSummaryDisplay() {
    cartSummaryDisplay.textContent = `총액: ${Math.round(totalAmount)}원${
      itemCount >= 10 ? '(10.0% 할인 적용)' : ''
    }`;
  }

  // 상품 재고 정보를 화면에 표시합니다.
  renderStockInfoDisplay() {
    stockInfoDisplay.textContent = productList
      .filter((product) => product.stock < 5)
      .map(
        (product) =>
          `${product.name}: ${
            product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'
          }`
      )
      .join('\n');
  }

  // 보너스 포인트를 화면에 표시합니다.
  renderBonusPointsTag() {
    let pointsTag = $('#loyalty-points');
    if (!pointsTag) {
      pointsTag = createElement('span', {
        id: 'loyalty-points',
        class: 'text-blue-500 ml-2',
      });
      cartSummaryDisplay.appendChild(pointsTag);
    }
    pointsTag.textContent = `(포인트: ${bonusPoints})`;
  }

  // 상품 셀렉트박스 옵션 목록을 화면에 표시합니다.
  renderProductOptions() {
    productSelectBox.innerHTML = '';
    productList.forEach((product) => {
      const option = createElement('option', {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
      });
      if (product.stock === 0) option.disabled = true;
      productSelectBox.appendChild(option);
    });
  }

  // 상품 셀렉트박스에 선택된 상품을 장바구니에 추가합니다.
  // 장바구니에 이미 상품이 존재할 경우 수량을 증가시킵니다.
  addItemToCart() {
    const selectedProductId = productSelectBox.value;
    const product = this.findProductById(selectedProductId);
    if (!product) return alert(MESSAGES.PRODUCT_NOT_FOUND);
    if (product.stock === 0) return alert(MESSAGES.OUT_OF_STOCK);

    const cartItem = $(`#${product.id}`);

    if (cartItem) {
      this.updateCartItemQuantity(cartItem, product, 1);
    } else {
      this.createCartItem(product);
    }

    this.summarizeCart();
    lastSelectedProductId = selectedProductId;
  }

  // 장바구니 수량을 변경하고 화면에 변경사항을 표시합니다.
  updateCartItemQuantity(cartItem, product, change) {
    if (change > product.stock) return alert(MESSAGES.OUT_OF_STOCK);
    
    const quantitySpan = cartItem.querySelector('span');
    const currentQuantity = parseInt(quantitySpan.textContent.split('x ')[1]);
    const newQuantity = currentQuantity + change;

    if (newQuantity > 0) {
      quantitySpan.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    } else {
      cartItem.remove();
    }
    product.stock -= change;
  }

  // 장바구니에 아이템을 추가하고 화면에 변경사항을 표시합니다.
  createCartItem(product) {
    const cartItem = createElement('div', {
      id: product.id,
      class: 'flex justify-between items-center mb-2',
    });
    cartItem.innerHTML = `
      <span>${product.name} - ${product.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>`;
    cartItemsDisplay.appendChild(cartItem);
    product.stock--;
  }

  // 장바구니 내 버튼 클릭 이벤트를 설정합니다.
  // 'quantity-change' : +,- 버튼을 클릭하여 수량을 변경합니다.
  // 'remove-item' : 삭제 버튼을 클릭하여 장바구니에서 아이템을 제거합니다.
  handleCartButtonClick(event) {
    const target = event.target;

    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      const productId = target.dataset.productId;
      const cartItem = $(`#${productId}`);
      const product = this.findProductById(productId);

      if (!product) return alert(MESSAGES.PRODUCT_NOT_FOUND);

      if (target.classList.contains('quantity-change')) {
        this.updateCartItemQuantity(
          cartItem,
          product,
          parseInt(target.dataset.change)
        );
      } else if (target.classList.contains('remove-item')) {
        const removeQuantity = parseInt(
          cartItem.querySelector('span').textContent.split('x ')[1]
        );
        this.updateCartItemQuantity(
          cartItem,
          product,
          -removeQuantity
        );
      }

      // 변경된 정보에 따라 장바구니 요약 정보를 갱신합니다.
      this.summarizeCart();
    }
  }

  // 특가 세일입니다.
  // 1. 번개 세일 이벤트
  // 2. 추가 할인 이벤트
  executePopupSale() {
    // 번개 세일
    setTimeout(() => {
      setInterval(() => {
        const luckyItem =
          productList[Math.floor(Math.random() * productList.length)];
        if (Math.random() < 0.3 && luckyItem.stock > 0) {
          luckyItem.price = Math.round(
            luckyItem.price * (1 - CONSTANTS.DISCOUNT_RATE_LUCKY)
          );
          alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
          this.renderProductOptions();
        }
      }, CONSTANTS.TIME_INTERVAL_LUCKY_SALE * CONSTANTS.MLSECONDS);
    }, Math.random() * 10 * CONSTANTS.MLSECONDS);

    // 추가 할인
    setTimeout(() => {
      setInterval(() => {
        if (lastSelectedProductId) {
          const suggestion = productList.find(
            (item) => item.id !== lastSelectedProductId && item.stock > 0
          );
          if (suggestion) {
            alert(
              `${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${
                CONSTANTS.DISCOUNT_RATE_EXTRA_SUGGETION * 100
              }% 추가 할인!`
            );
            suggestion.price = Math.round(
              suggestion.price * (1 - CONSTANTS.DISCOUNT_RATE_EXTRA_SUGGETION)
            );
            this.renderProductOptions();
          }
        }
      }, CONSTANTS.TIME_INTERVAL_EXTRA_SUGGESTION * CONSTANTS.MLSECONDS);
    }, Math.random() * 20 * CONSTANTS.MLSECONDS);
  }
}

// 어플리케이션 실행
new ShopApplication();
