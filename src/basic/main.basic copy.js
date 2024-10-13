const productOptions = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const PRODUCT_DISCOUNT_RULES = {
  p1: {
    minQuantity: 10,
    rate: 0.1,
  },
  p2: {
    minQuantity: 10,
    rate: 0.15,
  },
  p3: {
    minQuantity: 10,
    rate: 0.2,
  },
  p4: {
    minQuantity: 10,
    rate: 0.05,
  },
  p5: {
    minQuantity: 10,
    rate: 0.25,
  },
};

const WEEKDAY_DISCOUNT_RATE = {
  0: 0,
  1: 0,
  2: 0.1,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

class DiscountController {
  constructor(cartItems) {
    this._cartItems = cartItems;

    this._bulkRate = 0.25;
    this._bulkSize = 30;
  }

  _getDiscountRate(productId, quantity) {
    const discountRule = PRODUCT_DISCOUNT_RULES[productId];
    if (!discountRule) return 0;
    const { minQuantity, rate } = discountRule;
    const isOverMinQuantity = quantity >= minQuantity;
    const discountRate = isOverMinQuantity ? rate : 0;

    return discountRate;
  }

  getBulkSize() {
    return this._bulkSize;
  }

  _getOriginalTotalPrice() {
    return this._cartItems.reduce((acc, curr) => acc + curr.val * curr.q, 0);
  }

  _calculateItemPrice(itemId, quantity) {
    const discountRate = this._getDiscountRate(itemId, quantity);
    const itemPrice = this._cartItems.find((item) => item.id === itemId).val;
    const itemTotal = itemPrice * quantity;
    return itemTotal * (1 - discountRate);
  }

  _calculateTotalPrice() {
    if (this._cartItems.length === 0) return 0;
    return this._cartItems.reduce((acc, curr) => acc + this._calculateItemPrice(curr.id, curr.q), 0);
  }

  _calculateWeekdayDiscountPrice(weekday, totalPrice) {
    return totalPrice * (1 - WEEKDAY_DISCOUNT_RATE[weekday]);
  }

  _calculateBulkDiscountPrice(price) {
    return price * (1 - this._bulkRate);
  }

  calculate() {
    return {
      discountedTotalPrice: this._calculateTotalPrice(),
      discountRate: (this._getOriginalTotalPrice() - this._calculateTotalPrice()) / this._getOriginalTotalPrice(),
    };
  }

  calculateBulk() {
    return {
      bulkDiscountPrice: this._calculateBulkDiscountPrice(this._calculateTotalPrice()),
      bulkDiscountRate: this._bulkRate,
    };
  }

  calculateWeekday(weekday) {
    return {
      weekDayDiscountPrice: this._calculateWeekdayDiscountPrice(weekday, this._calculateTotalPrice()),
      weekDayDiscountRate: WEEKDAY_DISCOUNT_RATE[weekday],
    };
  }
}

class CartController {
  constructor(originalItems = productOptions) {
    this._cartItems = [];
    this._originalItems = [...originalItems];
  }

  _checkItemExist(itemId) {
    const item = this._cartItems.find((item) => item.id === itemId);
    if (!item) throw new Error("장바구니에 해당 상품이 없습니다.");
    return true;
  }

  getInstance() {
    if (!CartController.instance) {
      CartController.instance = new CartController();
    }
    return CartController.instance;
  }

  get(itemId) {
    this._checkItemExist(itemId);
    return this._cartItems.find((item) => item.id === itemId);
  }

  getAll() {
    return this._cartItems;
  }

  getOriginal(itemId) {
    return this._originalItems.find((item) => item.id === itemId);
  }

  getAllOriginal() {
    return this._originalItems;
  }
  getTotalPrice() {
    if (this._cartItems.length === 0) return 0;
    return this._cartItems.reduce((acc, curr) => {
      return acc + curr.val * curr.q;
    }, 0);
  }

  getTotalQuantity() {
    if (this._cartItems.length === 0) return 0;
    return this._cartItems.reduce((acc, curr) => acc + curr.q, 0);
  }

  add(item) {
    this._cartItems.push(item);
  }

  remove(itemId) {
    this._checkItemExist(itemId);
    this._cartItems = this._cartItems.filter((item) => item.id !== itemId);
  }

  update(itemId, newData) {
    this._checkItemExist(itemId);
    this._cartItems = this._cartItems.map((item) => (item.id === itemId ? { ...item, ...newData } : item));
  }

  updateOriginal(newData) {
    this._originalItems = [...newData];
    return this._originalItems;
  }
}

class QuantityController {
  constructor(cartController = new CartController().getInstance()) {
    this._cartController = cartController;
    this._item = null;
    this._originalItem = null;
  }

  getInstance() {
    if (!QuantityController.instance) {
      QuantityController.instance = new QuantityController();
    }
    return QuantityController.instance;
  }

  get() {
    return this._item.q;
  }

  getRemainedStock() {
    return this._originalItem.q - this._item.q;
  }

  isOverQuantity() {
    return this._originalItem.q < this._item.q;
  }

  setItem(itemId) {
    if (!itemId) return;
    this.reset();

    const item = this._cartController.get(itemId);
    const originalItem = this._cartController.getOriginal(itemId);

    this._item = { ...item };
    this._originalItem = { ...originalItem };
  }

  set(quantity) {
    if (quantity < 0) return this._item;
    this._item.q = quantity;
    return this._item;
  }

  reset() {
    this._item = null;
    this._originalItem = null;
  }
}

class Element {
  constructor(tagName, options = {}) {
    this._el = document.createElement(tagName);
    this._children = [];
    const { dataset, ...rest } = options;
    Object.assign(this._el, rest);
    if (dataset) {
      Object.assign(this._el.dataset, dataset);
    }
  }

  get el() {
    if (!this._el) {
      throw new Error("존재하지 않는 요소입니다.");
    }
    return this._el;
  }

  renderChildren(children) {
    if (!this._el) {
      throw new Error("존재하지 않는 요소입니다.");
    }
    const childrenArray = Array.isArray(children) ? children : [children];
    childrenArray.forEach((c) => {
      if (c instanceof Element) {
        this._el.appendChild(c.el);
      } else {
        this._el.appendChild(c);
      }
    });
    this._children = childrenArray;
  }

  resetChildren() {
    this._children = [];
    this.el.innerHTML = "";
  }

  updateAttributes(attributes) {
    Object.assign(this._el, attributes);
  }

  updateChildren(child) {
    const children = this._children.map((item) => {
      if (child === item) return child;
      return item;
    });
    this.renderChildren(children);
  }
}

class BonusPointController {
  constructor() {
    this.point = 0;
  }

  getInstance() {
    if (!BonusPointController.instance) {
      BonusPointController.instance = new BonusPointController();
    }
    return BonusPointController.instance;
  }

  get() {
    return this.point;
  }

  add(price) {
    this.point += Math.floor(price / 1000);
  }
}

const bonusController = new BonusPointController().getInstance();
const cartController = new CartController().getInstance();
const quantityController = new QuantityController(cartController).getInstance();

const $select = new Element("select", {
  id: "product-select",
  className: "border rounded p-2 mr-2",
});

const $header = new Element("h1", {
  className: "text-2xl font-bold mb-4",
  textContent: "장바구니",
});

const $cartItems = new Element("div", {
  id: "cart-items",
});

const $totalPrice = new Element("div", {
  className: "text-xl font-bold my-4",
  id: "cart-total",
});

const $addBtn = new Element("button", {
  id: "add-to-cart",
  className: "bg-blue-500 text-white px-4 py-2 rounded",
  textContent: "추가",
});

const $stockStatus = new Element("div", {
  id: "stock-status",
  className: "text-sm text-gray-500 mt-2 whitespace-pre-wrap",
});

const $container = new Element("div", {
  className: "bg-gray-100 p-8",
});

const $wrapper = new Element("div", {
  className: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
});

function renderProductSelect(list) {
  $select.resetChildren();
  const options = list.map(
    (item) =>
      new Element("option", {
        value: item.id,
        textContent: `${item.name} - ${item.val}원`,
        disabled: item.q === 0,
      }),
  );

  $select.renderChildren(options);
  return $select;
}

const renderCart = () => {
  renderStockStatus();
  renderTotalPrice();
  renderBonusPoint();
  renderDiscountInfo();
};

const removeCartItem = (productId) => {
  const $currentElement = document.getElementById(productId);
  $currentElement.remove();
  cartController.remove(productId);
};

function main() {
  // DOM 요소 생성 및 초기화
  const $root = document.getElementById("app");
  const $select = renderProductSelect(productOptions);
  $wrapper.renderChildren([$header.el, $cartItems.el, $totalPrice.el, $select.el, $addBtn.el, $stockStatus.el]);
  $container.renderChildren($wrapper.el);
  $root.appendChild($container.el);

  // 초기 장바구니 상태 렌더링
  renderCart();

  //TODO: 번개 세일 or 추천 상품 타이머 설정 함수 setTimeout 기반
  // luckyDiscount();
}

function luckyDiscount() {
  const interval = () => {
    setInterval(() => {
      const luckyItem = { ...productOptions[Math.floor(Math.random() * productOptions.length)] };
      if (luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
        const updatedList = productOptions.map((item) => (item.id === luckyItem.id ? luckyItem : item));
        const list = cartController.updateOriginal(updatedList);
        const $select = renderProductSelect(list);
        $wrapper.updateChildren($select);
      }
    }, 10000);
  };

  setTimeout(interval, 1000);
}

function renderStockStatus() {
  const allItems = cartController.getAll();
  const stockStatus = allItems.map((item) => {
    quantityController.setItem(item.id);
    const remainingStock = quantityController.getRemainedStock();
    if (remainingStock < 5) {
      return `${item.name}: ${remainingStock > 0 ? `재고 부족 (${remainingStock}개 남음)` : "품절"}`;
    }
    return "";
  });

  $stockStatus.el.textContent = stockStatus.join("\n");
}

function updateCartItemQuantity(productId, quantityChange) {
  quantityController.setItem(productId);

  const newQuantity = quantityController.get() + quantityChange;

  const updatedItem = quantityController.set(newQuantity);
  const remainingStock = quantityController.getRemainedStock();

  if (remainingStock < 0) {
    alert("재고가 부족합니다.");
    return;
  }

  if (updatedItem.q <= 0) {
    removeCartItem(productId);
    return;
  }

  if (quantityController.isOverQuantity()) {
    return;
  }

  const $currentElement = document.getElementById(productId);
  $currentElement.querySelector("span").textContent = `${updatedItem.name} - ${updatedItem.val}원 x ${updatedItem.q}`;
  cartController.update(productId, updatedItem);
}

function renderBonusPoint() {
  const { discountedTotalPrice } = calculateTotalPrice();
  bonusController.add(discountedTotalPrice);

  const $bonusPoint = new Element("span", {
    id: "loyalty-points",
    className: "text-blue-500 ml-2",
    textContent: `(포인트: ${bonusController.get()})`,
  });
  $totalPrice.renderChildren($bonusPoint.el);
}

function calculateTotalPrice() {
  const cartItems = cartController.getAll();
  const totalQuantity = cartController.getTotalQuantity();

  const discountController = new DiscountController(cartItems);

  const discountType = {
    bulk: totalQuantity >= discountController.getBulkSize(),
    weekday: new Date().getDay() === 2,
    noItem: cartItems.length === 0,
  };

  if (discountType.noItem) {
    return { discountedTotalPrice: 0, discountRate: 0 };
  }

  // 대량 할인
  if (discountType.bulk) {
    const { bulkDiscountPrice: baseBulkDiscountedPrice, bulkDiscountRate } = discountController.calculateBulk();
    return { discountedTotalPrice: baseBulkDiscountedPrice, discountRate: bulkDiscountRate };
  }

  // 화요일 할인
  if (discountType.weekday) {
    const { weekDayDiscountPrice, weekDayDiscountRate } = discountController.calculateWeekday(new Date().getDay());
    return { discountedTotalPrice: weekDayDiscountPrice, discountRate: weekDayDiscountRate };
  }

  // 기본 할인
  return discountController.calculate();
}

function renderTotalPrice() {
  const { discountedTotalPrice } = calculateTotalPrice();
  $totalPrice.el.textContent = `총액: ${discountedTotalPrice}원`;
}

function renderDiscountInfo() {
  const { discountRate } = calculateTotalPrice();

  if (discountRate <= 0) return;
  const $discountInfo = new Element("span", {
    className: "text-green-500 ml-2",
    textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
  });

  $totalPrice.renderChildren($discountInfo.el);
}

function renderInitialCartItem(item) {
  const $newItem = new Element("div", {
    id: item.id,
    className: "flex justify-between items-center mb-2",
  });

  const $textInfo = new Element("span", {
    textContent: `${item.name} - ${item.val}원 x 1`,
  });

  const $buttonGroup = new Element("div");

  const $plusQuantityButton = new Element("button", {
    className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
    textContent: "+",
    dataset: {
      productId: item.id,
      change: 1,
    },
  });
  const $minusQuantityButton = new Element("button", {
    className: "quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1",
    textContent: "-",
    dataset: {
      productId: item.id,
      change: -1,
    },
  });
  const $removeItemButton = new Element("button", {
    className: "remove-item bg-red-500 text-white px-2 py-1 rounded",
    textContent: "삭제",
    dataset: {
      productId: item.id,
    },
  });

  $buttonGroup.renderChildren([$minusQuantityButton.el, $plusQuantityButton.el, $removeItemButton.el]);

  $newItem.renderChildren([$textInfo.el, $buttonGroup.el]);
  $cartItems.renderChildren($newItem.el);
}

main();

$addBtn.el.addEventListener("click", () => {
  const currentProductId = $select.el.value;
  const currentProduct = productOptions.find((item) => item.id === currentProductId);

  if (!currentProduct) return;
  const $currentElement = document.getElementById(currentProduct.id);

  if (currentProduct.q <= 0) {
    cartController.add(currentProduct);
    renderStockStatus();
    return;
  }

  const alreadyExist = !!$currentElement;

  if (alreadyExist) {
    updateCartItemQuantity(currentProduct.id, 1);
  } else {
    const newItem = { ...currentProduct, q: 1 };
    renderInitialCartItem(newItem);
    cartController.add(newItem);
  }
  renderCart();
});

$cartItems.el.addEventListener("click", (event) => {
  const target = event.target;
  const change = target.classList.contains("quantity-change");
  const remove = target.classList.contains("remove-item");

  // 이벤트 위임
  if (change || remove) {
    const productId = target.dataset.productId;
    if (change) {
      const quantityChange = parseInt(target.dataset.change);
      updateCartItemQuantity(productId, quantityChange);
    }
    if (remove) {
      removeCartItem(productId);
    }
    renderCart();
  }
});
