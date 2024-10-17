import ProductStore from '../store';
let bonusPoints = 0;

export function createTotalPriceElement(finalPrice, fianlDiscountRate) {
  const finalPriceText = `총액: ${Math.round(finalPrice)}원`;
  const $totalPriceEl = document.getElementById('cart-total');

  $totalPriceEl.textContent = finalPriceText;

  if (fianlDiscountRate > 0) {
    const finalDiscountRateText = `(${(fianlDiscountRate * 100).toFixed(1)}% 할인 적용)`;
    const $span = `<span class="text-green-500 ml-2">${finalDiscountRateText}</span>`;
    $totalPriceEl.innerHTML += $span;
  }
}

export function createBonusPoints(finalPrice) {
  bonusPoints += Math.floor(finalPrice / 1000);

  let $pointsTag = document.getElementById('loyalty-points');

  if (!$pointsTag) {
    $pointsTag = document.createElement('span');
    $pointsTag.id = 'loyalty-points';
    $pointsTag.className = 'text-blue-500 ml-2';
    document.getElementById('cart-total').appendChild($pointsTag);
  }
  $pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
}

export function updateStockInfo() {
  const infoMessage = ProductStore.getAllProductList().reduce((acc, curProduct) => {
    if (curProduct.stock >= 5) {
      return acc + '';
    }

    const text =
      curProduct.stock > 0
        ? `${curProduct.name}: 재고 부죽 (${curProduct.stock}개 남음)\n`
        : `${curProduct.name}: 품절\n`;

    return acc + text;
  }, '');

  const $stockStatus = document.getElementById('stock-status');

  $stockStatus.textContent = infoMessage;
}

export function updateSelectOptions() {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';
  ProductStore.getAllProductList().forEach(function (product) {
    const opt = document.createElement('option');
    opt.value = product.id;

    opt.textContent = product.name + ' - ' + product.price + '원';
    if (product.stock === 0) opt.disabled = true;
    $productSelect.appendChild(opt);
  });
}
