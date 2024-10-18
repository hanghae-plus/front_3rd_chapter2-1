const PRODUCT_LIST = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

const TWICE = 2;
const TEN = 10;
const SECOND_BY_MILLISECOND = 1000;
const SECOND_TO_MINUTE = 60;

const LUCKY_SALE_RANGE_TERM = SECOND_BY_MILLISECOND * SECOND_TO_MINUTE;
const LUCKY_SALE_END_TERM = SECOND_BY_MILLISECOND * TEN * Math.random();
const SUGGEST_RANGE_TERM = (SECOND_BY_MILLISECOND * SECOND_TO_MINUTE) / TWICE;
const SUGGEST_END_TERM = SECOND_BY_MILLISECOND * TWICE * TEN * Math.random();

const LUCKY_SALE_SUCCESS_RATE = 0.3;
const LUCKY_SALE_DISCOUNT_RATE = 0.8;
const SUGGEST_DISCOUNT_RATE = 0.95;
const DISCOUNT_START_QUANTITY = 10;

const PRODUCT_DISCOUNT_RATE = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 };

const BULK_DISCOUNT_START_QUANTITY = 30;
const BULK_DISCOUNT_RATE = 0.25;

const DATE_TO_TUESDAY = 2;
const TUESDAY_DISCOUNT_RATE = 0.1;
const RATE_TO_PERCENT = 100;

const POINT_PER_AMOUNT = 1000;
const STOCK_QUANTITY_TO_INFO = 5;

const $app = document.getElementById("app");

const $container = document.createElement("div");
const $wrapper = document.createElement("div");
const $title = document.createElement("h1");
const $cartItemList = document.createElement("div");
const $productSelect = document.createElement("select");
const $cartTotal = document.createElement("div");
const $stockStatus = document.createElement("div");
const $addToCartButton = document.createElement("button");

$cartItemList.id = "cart-items";
$productSelect.id = "product-select";
$cartTotal.id = "cart-total";
$stockStatus.id = "stock-status";
$addToCartButton.id = "add-to-cart";

$container.className = "bg-gray-100 p-8";
$wrapper.className =
  "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8";
$title.className = "text-2xl font-bold mb-4";
$productSelect.className = "border rounded p-2 mr-2";
$cartTotal.className = "text-xl font-bold my-4";
$stockStatus.className = "text-sm text-gray-500 mt-2";
$addToCartButton.className = "bg-blue-500 text-white px-4 py-2 rounded";

$title.textContent = "장바구니";
$addToCartButton.textContent = "추가";

let lastSelectedItem,
  bonusPoint = 0,
  totalAmount = 0,
  itemCount = 0;

const main = () => {
  selectProductOption();

  $app.appendChild($container);
  $container.appendChild($wrapper);
  $wrapper.appendChild($title);
  $wrapper.appendChild($cartItemList);
  $wrapper.appendChild($productSelect);
  $wrapper.appendChild($cartTotal);
  $wrapper.appendChild($stockStatus);
  $wrapper.appendChild($addToCartButton);

  calculateCartTotal();

  setTimeout(() => {
    setInterval(() => {
      const luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];

      if (Math.random() < LUCKY_SALE_SUCCESS_RATE && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * LUCKY_SALE_DISCOUNT_RATE);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        selectProductOption();
      }
    }, LUCKY_SALE_RANGE_TERM);
  }, LUCKY_SALE_END_TERM);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedItem) {
        const suggest = PRODUCT_LIST.find(
          item => item.id !== lastSelectedItem && item.quantity > 0,
        );

        if (suggest) {
          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggest.price = Math.round(suggest.price * SUGGEST_DISCOUNT_RATE);
          selectProductOption();
        }
      }
    }, SUGGEST_RANGE_TERM);
  }, SUGGEST_END_TERM);
};

const selectProductOption = () => {
  $productSelect.innerHTML = "";
  PRODUCT_LIST.forEach(product => {
    const $option = document.createElement("option");
    $option.value = product.id;

    $option.textContent = `${product.name} - ${product.price}원`;
    if (product.quantity === 0) {
      $option.disabled = true;
    }
    $productSelect.appendChild($option);
  });
};

const renderDiscountInfo = discountRate => {
  const span = document.createElement("span");
  span.className = "text-green-500 ml-2";
  span.textContent = `(${(discountRate * RATE_TO_PERCENT).toFixed(1)}% 할인 적용)`;
  $cartTotal.appendChild(span);
};

const calculateCartTotal = () => {
  totalAmount = 0;
  itemCount = 0;

  const cartItemList = $cartItemList.children;

  let subAmount = 0;

  for (let i = 0; i < cartItemList.length; i++) {
    const currentItem = PRODUCT_LIST.find(product => product.id === cartItemList[i].id);

    const $cartItem = cartItemList[i].querySelector("span");

    const quantity = parseInt($cartItem.textContent.split("x ")[1]);
    const itemTotalPrice = currentItem.price * quantity;

    let discount = 0;

    itemCount += quantity;
    subAmount += itemTotalPrice;

    if (quantity >= DISCOUNT_START_QUANTITY) {
      discount = PRODUCT_DISCOUNT_RATE[currentItem.id];
    }
    totalAmount += itemTotalPrice * (1 - discount);
  }

  let discountRate = 0;

  if (itemCount >= BULK_DISCOUNT_START_QUANTITY) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    const itemDiscount = subAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subAmount * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = (subAmount - totalAmount) / subAmount;
    }
  } else {
    discountRate = (subAmount - totalAmount) / subAmount;
  }

  if (new Date().getDay() === DATE_TO_TUESDAY) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }

  $cartTotal.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    renderDiscountInfo(discountRate);
  }

  updateStockInfo();
  renderBonusPts();
};

const renderBonusPts = () => {
  bonusPoint += Math.floor(totalAmount / POINT_PER_AMOUNT);

  let $loyaltyPoint = document.getElementById("loyalty-points");

  if (!$loyaltyPoint) {
    $loyaltyPoint = document.createElement("span");
    $loyaltyPoint.id = "loyalty-points";
    $loyaltyPoint.className = "text-blue-500 ml-2";
    $cartTotal.appendChild($loyaltyPoint);
  }
  $loyaltyPoint.textContent = `(포인트: ${bonusPoint})`;
};

const updateStockInfo = () => {
  let infoMessage = "";

  PRODUCT_LIST.forEach(product => {
    if (product.quantity < STOCK_QUANTITY_TO_INFO) {
      infoMessage += `${product.name}: ${product.quantity > 0 ? `재고 부족 (${product.quantity}개 남음)` : "품절"}\n`;
    }
  });

  $stockStatus.textContent = infoMessage;
};

main();

$addToCartButton.addEventListener("click", () => {
  const selectedItem = $productSelect.value;
  const itemToAdd = PRODUCT_LIST.find(product => product.id === selectedItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const $item = document.getElementById(itemToAdd.id);

    if ($item) {
      const newQuantity = parseInt($item.querySelector("span").textContent.split("x ")[1]) + 1;

      if (newQuantity <= itemToAdd.quantity) {
        $item.querySelector("span").textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQuantity}`;
        itemToAdd.quantity--;
      } else {
        alert("재고가 부족합니다.");
      }
    } else {
      const $newItem = document.createElement("div");

      $newItem.id = itemToAdd.id;
      $newItem.className = "flex justify-between items-center mb-2";
      $newItem.innerHTML = `
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
      </div>
      `;

      $cartItemList.appendChild($newItem);

      itemToAdd.quantity--;
    }
    calculateCartTotal();

    lastSelectedItem = selectedItem;
  }
});

$cartItemList.addEventListener("click", event => {
  const target = event.target;

  if (target.classList.contains("quantity-change") || target.classList.contains("remove-item")) {
    const productId = target.dataset.productId;
    const productElement = document.getElementById(productId);
    const targetProduct = PRODUCT_LIST.find(product => product.id === productId);

    const changedProduct = productElement.querySelector("span");
    const [changedProductInfo, currentQuantity] = changedProduct.textContent.split("x ");

    if (target.classList.contains("quantity-change")) {
      const quantityChange = parseInt(target.dataset.change);

      const newQuantity = parseInt(currentQuantity) + quantityChange;
      const productQuantity = targetProduct.quantity + parseInt(currentQuantity);

      if (newQuantity > 0 && newQuantity <= productQuantity) {
        changedProduct.textContent = `${changedProductInfo}x ${newQuantity}`;
        targetProduct.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        productElement.remove();
        targetProduct.quantity -= quantityChange;
      } else {
        alert("재고가 부족합니다.");
      }
    } else if (target.classList.contains("remove-item")) {
      const removeQuantity = parseInt(currentQuantity);
      targetProduct.quantity += removeQuantity;
      productElement.remove();
    }

    calculateCartTotal();
  }
});
