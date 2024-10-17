const productList = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

let lastControledProduct;
let bonusPoint = 0;
let finalCost = 0;

const $root = document.getElementById("app");
const $layout = document.createElement("div");
const $wrap = document.createElement("div");
const $title = document.createElement("h1");
const $addButton = document.createElement("button");
const $select = document.createElement("select");
const $cart = document.createElement("div");
const $totalPrice = document.createElement("div");
const $remainedStock = document.createElement("div");

const initializeDOM = () => {
  $cart.id = "cart-items";
  $totalPrice.id = "cart-total";
  $select.id = "product-select";
  $addButton.id = "add-to-cart";
  $remainedStock.id = "stock-status";

  $layout.className = "bg-gray-100 p-8";
  $wrap.className =
    "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
  $title.className = "text-2xl font-bold mb-4";
  $totalPrice.className = "text-xl font-bold my-4";
  $select.className = "border rounded p-2 mr-2";
  $addButton.className = "bg-blue-500 text-white px-4 py-2 rounded";
  $remainedStock.className = "text-sm text-gray-500 mt-2";

  $title.textContent = "장바구니";
  $addButton.textContent = "추가";

  updateSelectOption();

  $wrap.appendChild($title);
  $wrap.appendChild($cart);
  $wrap.appendChild($totalPrice);
  $wrap.appendChild($select);
  $wrap.appendChild($addButton);
  $wrap.appendChild($remainedStock);
  $layout.appendChild($wrap);
  $root.appendChild($layout);
};

const updateSelectOption = () => {
  $select.innerHTML = "";
  productList.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;

    option.textContent = `${product.name} - ${product.price}원`;
    if (product.quantity === 0) {
      option.disabled = true;
    }
    $select.appendChild(option);
  });
};

const randomEvent = () => {
  const LIGHTNING_SALE_TIMEOUT = 10000;
  const LIGHTNING_SALE_INTERVAL = 30000;
  const LIGHTNING_SALE_RANDOM_PROBABILITY = 0.3;
  const LIGHTNING_SALE_RATE = 0.8;

  setTimeout(() => {
    setInterval(() => {
      const randomProduct = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < LIGHTNING_SALE_RANDOM_PROBABILITY && randomProduct.quantity > 0) {
        randomProduct.price = Math.round(randomProduct.price * LIGHTNING_SALE_RATE);
        alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
        updateSelectOption();
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, Math.random() * LIGHTNING_SALE_TIMEOUT);
  const ADDITIONAL_SALE_TIMEOUT = 20000;
  const ADDITIONAL_SALE_INTERVAL = 60000;
  const ADDITIONAL_SALE_RATE = 0.95;

  setTimeout(() => {
    setInterval(() => {
      if (lastControledProduct) {
        const suggestedProuduct = productList.find(
          product => product.id !== lastControledProduct && product.quantity > 0,
        );
        if (suggestedProuduct !== undefined) {
          alert(`${suggestedProuduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestedProuduct.price = Math.round(suggestedProuduct.price * ADDITIONAL_SALE_RATE);
          updateSelectOption();
        }
      }
    }, ADDITIONAL_SALE_INTERVAL);
  }, Math.random() * ADDITIONAL_SALE_TIMEOUT);
};

const calcCartProduct = () => {
  finalCost = 0;
  let cartQuantity = 0;
  const cartProductList = $cart.children;
  let cartCost = 0;

  // 장바구니의 상품들 할인율 계산해서 총 값을 계산하는 반복문
  // 이걸 함수로 빼고싶었지만, 다른 변수들과 연관성이 있어 빼지 못했다.
  for (const cartProduct of cartProductList) {
    const productInCart = productList.find(product => product.id === cartProduct.id);

    const cartProductQuantity = parseInt(
      cartProduct.querySelector("span").textContent.split("x ")[1],
    );
    const productCartCost = productInCart.price * cartProductQuantity;
    cartQuantity += cartProductQuantity;
    cartCost += productCartCost;

    let productDiscountRate = 0;
    const MIN_QUANTITY_PRODUCT_DISCOUNT = 10;
    const PRODUCT_DISCOUNT_RATE = {
      p1: 0.1,
      p2: 0.15,
      p3: 0.2,
      p4: 0.05,
      p5: 0.25,
    };

    if (cartProductQuantity >= MIN_QUANTITY_PRODUCT_DISCOUNT) {
      productDiscountRate = PRODUCT_DISCOUNT_RATE[productInCart.id];
    }
    finalCost += productCartCost * (1 - productDiscountRate);
  }

  // 이부분도 마찬가지. 함수로 빼고 싶었지만 못뺌.
  let totalDiscountRate = 0;
  const MIN_TOTAL_DISCONUT_QUANTITY = 30;
  const BULK_PURCHASE_DISCOUNT_RATE = 0.25;

  if (cartQuantity >= MIN_TOTAL_DISCONUT_QUANTITY) {
    const bulkDisc = finalCost * BULK_PURCHASE_DISCOUNT_RATE;
    const itemDisc = cartCost - finalCost;
    if (bulkDisc > itemDisc) {
      finalCost = cartCost * (1 - BULK_PURCHASE_DISCOUNT_RATE);
      totalDiscountRate = BULK_PURCHASE_DISCOUNT_RATE;
    } else {
      totalDiscountRate = (cartCost - finalCost) / cartCost;
    }
  } else {
    totalDiscountRate = (cartCost - finalCost) / cartCost;
  }

  const TUESDAY_GET_NUMBER = 2;
  const TUESDAY_DISCOUNT_RATE = 0.1;
  const FORMAT_PERCENTAGE = 100;

  if (new Date().getDay() === TUESDAY_GET_NUMBER) {
    finalCost *= 1 - TUESDAY_DISCOUNT_RATE;
    totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
  }

  $totalPrice.textContent = `총액: ${Math.round(finalCost)}원`;

  if (totalDiscountRate > 0) {
    const $applyDiscountText = document.createElement("span");
    $applyDiscountText.className = "text-green-500 ml-2";
    $applyDiscountText.textContent = `(${(totalDiscountRate * FORMAT_PERCENTAGE).toFixed(1)}% 할인 적용)`;
    $totalPrice.appendChild($applyDiscountText);
  }
  updateStock();
  updateBonusPoint();
};

const updateStock = () => {
  const MAX_PRODUCT_QUANTITY = 5;
  const textContent = productList
    .filter(product => product.quantity < MAX_PRODUCT_QUANTITY)
    .reduce((acc, product) => {
      const quantityStatus =
        product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절";
      // eslint-disable-next-line prefer-template
      return acc + `${product.name}: ${quantityStatus}\n`;
    }, "");
  $remainedStock.textContent = textContent;
};

const updateBonusPoint = () => {
  const BONUS_POINT_RATE = 1000;
  bonusPoint += Math.floor(finalCost / BONUS_POINT_RATE);

  let $bonusPoint = document.getElementById("loyalty-points");
  if ($bonusPoint === null) {
    $bonusPoint = document.createElement("span");
    $bonusPoint.id = "loyalty-points";
    $bonusPoint.className = "text-blue-500 ml-2";
    $totalPrice.appendChild($bonusPoint);
  }
  $bonusPoint.textContent = `(포인트: ${bonusPoint})`;
};

const createCartElement = toAddProduct => {
  const addNewCart = document.createElement("div");
  addNewCart.id = toAddProduct.id;
  addNewCart.className = "flex justify-between items-center mb-2";
  addNewCart.innerHTML =
    `<span>${toAddProduct.name} - ${toAddProduct.price}원 x 1</span><div>` +
    `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
      toAddProduct.id
    }" data-change="-1">-</button>` +
    `<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${
      toAddProduct.id
    }" data-change="1">+</button>` +
    `<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${
      toAddProduct.id
    }">삭제</button></div>`;
  $cart.appendChild(addNewCart);
};

const changeCartProductQuantity = ({ $target, $taretProduct, targetProduct }) => {
  const quantityChange = parseInt($target.dataset.change);
  const cartProductQuantity =
    parseInt($taretProduct.querySelector("span").textContent.split("x ")[1]) + quantityChange;
  if (
    cartProductQuantity > 0 &&
    cartProductQuantity <=
      targetProduct.quantity +
        parseInt($taretProduct.querySelector("span").textContent.split("x ")[1])
  ) {
    $taretProduct.querySelector("span").textContent =
      `${$taretProduct.querySelector("span").textContent.split("x ")[0]}x ${cartProductQuantity}`;
    targetProduct.quantity -= quantityChange;
  } else if (cartProductQuantity <= 0) {
    $taretProduct.remove();
    targetProduct.quantity -= quantityChange;
  } else {
    alert("재고가 부족합니다.");
  }
};

const removeCartProduct = ({ $taretProduct, targetProduct }) => {
  const cartProductQuantity = parseInt(
    $taretProduct.querySelector("span").textContent.split("x ")[1],
  );
  targetProduct.quantity += cartProductQuantity;
  $taretProduct.remove();
};

const main = () => {
  initializeDOM();
  calcCartProduct();
  randomEvent();
};

main();

$addButton.addEventListener("click", () => {
  const selectedProductId = $select.value;
  const toAddProduct = productList.find(product => product.id === selectedProductId);

  if (toAddProduct === undefined || toAddProduct.quantity <= 0) {
    return;
  }

  const addProductId = document.getElementById(toAddProduct.id);

  if (addProductId !== null) {
    const addProductQuantity =
      parseInt(addProductId.querySelector("span").textContent.split("x ")[1]) + 1;
    if (addProductQuantity <= toAddProduct.quantity) {
      addProductId.querySelector("span").textContent =
        `${toAddProduct.name} - ${toAddProduct.price}원 x ${addProductQuantity}`;
      toAddProduct.quantity--;
    } else {
      alert("재고가 부족합니다.");
    }
  } else {
    createCartElement(toAddProduct);
    toAddProduct.quantity--;
  }

  calcCartProduct();
  lastControledProduct = selectedProductId;
});

$cart.addEventListener("click", event => {
  const $target = event.target;
  if (
    !$target.classList.contains("quantity-change") &&
    !$target.classList.contains("remove-item")
  ) {
    return;
  }

  const targetProductId = $target.dataset.productId;
  const $taretProduct = document.getElementById(targetProductId);
  const targetProduct = productList.find(product => product.id === targetProductId);

  if ($target.classList.contains("quantity-change")) {
    changeCartProductQuantity({ $target, $taretProduct, targetProduct });
  } else if ($target.classList.contains("remove-item")) {
    removeCartProduct({ $taretProduct, targetProduct });
  }
  calcCartProduct();
});
