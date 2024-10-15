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

    option.textContent = `${product.name}-${product.price} 원`;
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
    let productDiscountRate = 0;
    cartCost += productCartCost;

    const MIN_QUANTITY_PRODUCT_DISCOUNT = 10;
    const P1_DISCOUNT_RATE = 0.1;
    const P2_DISCOUNT_RATE = 0.15;
    const P3_DISCOUNT_RATE = 0.2;
    const P4_DISCOUNT_RATE = 0.05;
    const P5_DISCOUNT_RATE = 0.25;

    if (cartProductQuantity >= MIN_QUANTITY_PRODUCT_DISCOUNT) {
      switch (productInCart.id) {
        case "p1":
          productDiscountRate = P1_DISCOUNT_RATE;
          break;
        case "p2":
          productDiscountRate = P2_DISCOUNT_RATE;
          break;
        case "p3":
          productDiscountRate = P3_DISCOUNT_RATE;
          break;
        case "p4":
          productDiscountRate = P4_DISCOUNT_RATE;
          break;
        case "p5":
          productDiscountRate = P5_DISCOUNT_RATE;
          break;
      }
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

  $totalPrice.textContent = `총액: ${Math.round(finalCost)} 원`;

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
  let textContent = "";
  const MAX_PRODUCT_QUANTITY = 5;
  productList.forEach(product => {
    if (product.quantity < MAX_PRODUCT_QUANTITY) {
      const quantityStatus =
        product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절";
      textContent += `${product.name}: ${quantityStatus}\n`;
    }
  });
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

const main = () => {
  initializeDOM();
  calcCartProduct();
  randomEvent();
};

main();

$addButton.addEventListener("click", () => {
  const selItem = $select.value;
  const itemToAdd = productList.find(p => p.id === selItem);
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty = parseInt(item.querySelector("span").textContent.split("x ")[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector("span").textContent =
          itemToAdd.name + " - " + itemToAdd.price + "원 x " + newQty;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const newItem = document.createElement("div");
      newItem.id = itemToAdd.id;
      newItem.className = "flex justify-between items-center mb-2";
      newItem.innerHTML =
        "<span>" +
        itemToAdd.name +
        " - " +
        itemToAdd.price +
        "원 x 1</span><div>" +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      $cart.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCartProduct();
    lastSel = selItem;
  }
});

$cart.addEventListener("click", event => {
  const tgt = event.target;

  if (tgt.classList.contains("quantity-change") || tgt.classList.contains("remove-item")) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    const prod = productList.find(p => p.id === prodId);
    if (tgt.classList.contains("quantity-change")) {
      const qtyChange = parseInt(tgt.dataset.change);
      const newQty =
        parseInt(itemElem.querySelector("span").textContent.split("x ")[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <=
          prod.quantity + parseInt(itemElem.querySelector("span").textContent.split("x ")[1])
      ) {
        itemElem.querySelector("span").textContent =
          itemElem.querySelector("span").textContent.split("x ")[0] + "x " + newQty;
        prod.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.quantity -= qtyChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (tgt.classList.contains("remove-item")) {
      const remQty = parseInt(itemElem.querySelector("span").textContent.split("x ")[1]);
      prod.quantity += remQty;
      itemElem.remove();
    }
    calcCartProduct();
  }
});
