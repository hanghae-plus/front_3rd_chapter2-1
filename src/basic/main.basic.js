const DISCOUNT_DAY = 2;
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;

class ShoppingCartApp {
  constructor() {
    this.productList = this.initializeProductList();
    this.lastSelectedProduct = null;
    this.bonusPoints = 0;
    this.cartTotalPrice = 0;
    this.productCount = 0;

    this.initUI();
    this.updateProductOptions();
    this.setupEventListeners();
    this.calculateCart();
    this.setupDiscountTimers();
    this.setupProductSuggestionTimers();
  }

  //#region Initialization
  // 제품 목록 초기화 함수
  initializeProductList() {
    return [
      { id: "p1", name: "상품1", value: 10000, quantity: 50, discount: 0.1 },
      { id: "p2", name: "상품2", value: 20000, quantity: 30, discount: 0.15 },
      { id: "p3", name: "상품3", value: 30000, quantity: 20, discount: 0.2 },
      { id: "p4", name: "상품4", value: 15000, quantity: 0, discount: 0.05 },
      { id: "p5", name: "상품5", value: 25000, quantity: 10, discount: 0.25 },
    ];
  }
  //#endregion

  //#region UI Management
  /**
   * DOM 요소를 생성하는 함수
   * @param {string} tag - HTML 태그 이름
   * @param {Object} attributes - 속성 객체
   * @param {Array} children - 자식 노드 배열
   * @returns {HTMLElement} 생성된 DOM 요소
   */
  createElement(tag, attributes = {}, children = []) {
    const $element = document.createElement(tag);
    Object.keys(attributes).forEach((key) => {
      if (key === "className") {
        $element.className = attributes[key];
      } else if (key === "textContent") {
        $element.textContent = attributes[key];
      } else {
        $element.setAttribute(key, attributes[key]);
      }
    });
    children.forEach((child) => $element.appendChild(child));
    return $element;
  }

  /** UI 초기화 */
  initUI() {
    const root = document.getElementById("app");

    const container = this.createElement("div", { className: "bg-gray-100 p-8" });
    const wrapper = this.createElement("div", {
      className: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
    });
    const title = this.createElement("h1", { className: "text-2xl font-bold mb-4", textContent: "장바구니" });

    this.cartDisplay = this.createElement("div", { id: "cart-items" });
    this.totalSumDisplay = this.createElement("div", { id: "cart-total", className: "text-xl font-bold my-4" });
    this.productSelect = this.createElement("select", { id: "product-select", className: "border rounded p-2 mr-2" });
    this.addToCartButton = this.createElement("button", {
      id: "add-to-cart",
      className: "bg-blue-500 text-white px-4 py-2 rounded",
      textContent: "추가",
    });
    this.stockInfo = this.createElement("div", { id: "stock-status", className: "text-sm text-gray-500 mt-2" });

    // DOM 트리 구성
    wrapper.appendChild(title);
    wrapper.appendChild(this.cartDisplay);
    wrapper.appendChild(this.totalSumDisplay);
    wrapper.appendChild(this.productSelect);
    wrapper.appendChild(this.addToCartButton);
    wrapper.appendChild(this.stockInfo);
    container.appendChild(wrapper);
    root.appendChild(container);
  }

  /** 제품 목록 옵션 업데이트하는 함수 */
  updateProductOptions() {
    this.productSelect.innerHTML = "";
    this.productList.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} - ${product.value}원`;
      option.disabled = product.quantity === 0;
      this.productSelect.appendChild(option);
    });
  }
  //#endregion

  //#region Cart Management
  /** 장바구니 계산 함수 */
  calculateCart() {
    this.cartTotalPrice = 0;
    this.productCount = 0;
    const cartItems = this.cartDisplay.children;
    let subTotal = 0;

    for (let i = 0; i < cartItems.length; i++) {
      const currentProduct = this.productList.find((p) => p.id === cartItems[i].id);
      const quantity = parseInt(cartItems[i].querySelector("span").textContent.split("x ")[1]);
      const productTotal = currentProduct.value * quantity;
      let discount = 0;

      this.productCount += quantity;
      subTotal += productTotal;

      if (quantity >= 10) {
        discount = currentProduct.discount;
      }

      this.cartTotalPrice += productTotal * (1 - discount);
    }

    let discountRate = this.applyBulkDiscount(subTotal);

    if (new Date().getDay() === DISCOUNT_DAY) {
      this.cartTotalPrice *= 0.9;
      discountRate = Math.max(discountRate, 0.1);
    }

    this.totalSumDisplay.textContent = `총액: ${Math.round(this.cartTotalPrice)}원`;
    if (discountRate > 0) {
      const span = document.createElement("span");
      span.className = "text-green-500 ml-2";
      span.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
      this.totalSumDisplay.appendChild(span);
    }

    this.updateStockInfo();
    this.updateBonusPoints();
  }

  /**
   * 대량 구매 할인 적용 함수
   * @param {number} subTotal - 총 가격
   * @returns {number} 할인율
   */
  applyBulkDiscount(subTotal) {
    let discountRate = 0;
    if (this.productCount >= BULK_DISCOUNT_THRESHOLD) {
      const bulkDiscount = this.cartTotalPrice * BULK_DISCOUNT_RATE;
      const productDiscount = subTotal - this.cartTotalPrice;
      if (bulkDiscount > productDiscount) {
        this.cartTotalPrice = subTotal * (1 - BULK_DISCOUNT_RATE);
        discountRate = BULK_DISCOUNT_RATE;
      } else {
        discountRate = (subTotal - this.cartTotalPrice) / subTotal;
      }
    } else {
      discountRate = (subTotal - this.cartTotalPrice) / subTotal;
    }
    return discountRate;
  }
  //#endregion

  //#region Bonus Points and Stock Info
  /** 보너스 포인트 렌더링 */
  updateBonusPoints() {
    this.bonusPoints += Math.floor(this.cartTotalPrice / 1000);
    let loyaltyPointsTag = document.getElementById("loyalty-points");
    if (!loyaltyPointsTag) {
      loyaltyPointsTag = this.createElement("span", {
        id: "loyalty-points",
        className: "text-blue-500 ml-2",
      });
      this.totalSumDisplay.appendChild(loyaltyPointsTag);
    }
    loyaltyPointsTag.textContent = `(포인트: ${this.bonusPoints})`;
  }

  /** 재고 정보 업데이트 함수 */
  updateStockInfo() {
    this.stockInfo.innerHTML = "";
    this.productList.forEach((product) => {
      if (product.quantity < 5) {
        const stockMessage = this.createElement("p", {
          textContent: `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}`,
        });
        this.stockInfo.appendChild(stockMessage);
      }
    });
  }
  //#endregion

  //#region Cart Actions
  /**
   * 장바구니에 제품을 추가하는 함수
   */
  addProductToCart() {
    const selectedProductId = this.productSelect.value;
    const selectedProduct = this.productList.find((product) => product.id === selectedProductId);

    if (selectedProduct && selectedProduct.quantity > 0) {
      const existingCartItem = document.getElementById(selectedProduct.id);
      if (existingCartItem) {
        this.updateCartItemQuantity(existingCartItem, selectedProduct, 1);
      } else {
        this.createCartItem(selectedProduct);
      }
      this.calculateCart();
      this.lastSelectedProduct = selectedProductId;
    }
  }

  /**
   * 장바구니 아이템 수량을 업데이트하는 함수
   * @param {HTMLElement} cartItem - 장바구니 항목 요소
   * @param {Object} product - 제품 정보
   * @param {number} change - 수량 변화 값
   */
  updateCartItemQuantity(cartItem, product, change) {
    const currentCartQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
    const newQuantity = currentCartQuantity + change;
    if (newQuantity > 0 && newQuantity <= product.quantity) {
      cartItem.querySelector("span").textContent = `${product.name} - ${product.value}원 x ${newQuantity}`;
      product.quantity -= change;
    } else {
      alert("재고가 부족합니다.");
    }
  }

  /**
   * 장바구니에 새 항목을 생성하는 함수
   * @param {Object} product - 제품 정보
   */
  createCartItem(product) {
    const cartItem = this.createElement("div", { id: product.id, className: "flex justify-between items-center mb-2" });
    const itemInfo = this.createElement("span", { textContent: `${product.name} - ${product.value}원 x 1` });
    const controlButtons = this.createQuantityControlButtons(product);

    cartItem.appendChild(itemInfo);
    cartItem.appendChild(controlButtons);
    this.cartDisplay.appendChild(cartItem);
    product.quantity--;
  }

  /**
   * 장바구니 항목을 삭제하는 함수
   * @param {HTMLElement} cartItem - 장바구니 항목 요소
   * @param {Object} product - 제품 정보
   */
  removeCartItem(cartItem, product) {
    const quantityToRemove = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
    product.quantity += quantityToRemove;
    cartItem.remove();
  }

  /**
   * 장바구니 수량 조절 버튼을 생성하는 함수
   * @param {Object} product - 제품 정보
   * @returns {HTMLElement} 수량 조절 버튼 래퍼 요소
   */
  createQuantityControlButtons(product) {
    const buttonsWrapper = this.createElement("div", {});
    const decrementButton = this.createElement("button", {
      className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      textContent: "-",
      "data-product-id": product.id,
      "data-change": -1,
    });
    const incrementButton = this.createElement("button", {
      className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
      textContent: "+",
      "data-product-id": product.id,
      "data-change": 1,
    });
    const removeButton = this.createElement("button", {
      className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
      textContent: "삭제",
      "data-product-id": product.id,
    });

    buttonsWrapper.appendChild(decrementButton);
    buttonsWrapper.appendChild(incrementButton);
    buttonsWrapper.appendChild(removeButton);
    return buttonsWrapper;
  }

  /**
   * 장바구니 액션을 처리하는 함수
   * @param {Event} event - 클릭 이벤트
   */
  handleCartActions(event) {
    const targetElement = event.target;
    const productId = targetElement.dataset.productId;
    const cartItemElement = document.getElementById(productId);
    const product = this.productList.find((p) => p.id === productId);

    if (targetElement.classList.contains("quantity-change")) {
      this.changeProductQuantity(targetElement, cartItemElement, product);
    } else if (targetElement.classList.contains("remove-item")) {
      this.removeCartItem(cartItemElement, product);
    }

    this.calculateCart();
  }

  /**
   * 장바구니 항목 수량을 변경하는 함수
   * @param {HTMLElement} cartItem - 장바구니 항목
   * @param {Object} product - 제품 정보
   * @param {number} change - 수량 변경 값
   */
  changeProductQuantity(cartItem, product, change) {
    const currentCartQuantity = parseInt(cartItem.dataset.change);
    const newQuantity = parseInt(product.querySelector("span").textContent.split("x ")[1]) + currentCartQuantity;
    if (
      newQuantity > 0 &&
      newQuantity <= change.quantity + parseInt(product.querySelector("span").textContent.split("x ")[1])
    ) {
      product.querySelector("span").textContent =
        `${product.querySelector("span").textContent.split("x ")[0]}x ${newQuantity}`;
      change.quantity -= currentCartQuantity;
    } else if (newQuantity <= 0) {
      product.remove();
      change.quantity -= currentCartQuantity;
    } else {
      alert("재고가 부족합니다.");
    }
  }
  //#endregion

  //#region Timers
  /** 번개 세일 타이머를 설정하는 함수 */
  setupDiscountTimers() {
    setTimeout(() => {
      setInterval(() => {
        const luckyProduct = this.productList[Math.floor(Math.random() * this.productList.length)];
        if (Math.random() < 0.3 && luckyProduct.quantity > 0) {
          luckyProduct.value = Math.round(luckyProduct.value * 0.8);
          alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
          this.updateProductOptions();
        }
      }, 30000);
    }, Math.random() * 10000);
  }

  /** 제품 추천 타이머를 설정하는 함수 */
  setupProductSuggestionTimers() {
    setTimeout(() => {
      setInterval(() => {
        if (this.lastSelectedProduct) {
          const suggestedProduct = this.productList.find(
            (product) => product.id !== this.lastSelectedProduct && product.quantity > 0
          );
          if (suggestedProduct) {
            alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            suggestedProduct.value = Math.round(suggestedProduct.value * 0.95);
            this.updateProductOptions();
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  }
  //#endregion

  //#region Event Handlers
  /** 이벤트 리스너 설정 함수 */
  setupEventListeners() {
    this.addToCartButton.addEventListener("click", this.addProductToCart.bind(this));
    this.cartDisplay.addEventListener("click", this.handleCartActions.bind(this));
  }
  //#endregion
}

new ShoppingCartApp();
