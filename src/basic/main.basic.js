var products,
  $productSelect,
  $addToCartButton,
  $cartProducts,
  $cartTotal,
  $stockStatus;
var selectedProduct,
  bonusPoints = 0,
  total = 0,
  productCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 }
  ];

  var $root = document.getElementById('app');
  let $container = document.createElement('div');
  var $cart = document.createElement('div');
  let $title = document.createElement('h1');
  $cartProducts = document.createElement('div');
  $cartTotal = document.createElement('div');
  $productSelect = document.createElement('select');
  $addToCartButton = document.createElement('button');
  $stockStatus = document.createElement('div');
  $cartProducts.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $productSelect.id = 'product-select';
  $addToCartButton.id = 'add-to-cart';

  $stockStatus.id = 'stock-status';
  $container.className = 'bg-gray-100 p-8';
  $cart.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $title.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $productSelect.className = 'border rounded p-2 mr-2';
  $addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';
  $title.textContent = '장바구니';
  $addToCartButton.textContent = '추가';
  addProductSelectOptions();
  $cart.appendChild($title);
  $cart.appendChild($cartProducts);
  $cart.appendChild($cartTotal);
  $cart.appendChild($productSelect);
  $cart.appendChild($addToCartButton);
  $cart.appendChild($stockStatus);
  $container.appendChild($cart);
  $root.appendChild($container);
  calcCart();
  setTimeout(function () {
    setInterval(function () {
      var saleProduct = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && saleProduct.quantity > 0) {
        saleProduct.price = Math.round(saleProduct.price * 0.8);
        alert('번개세일! ' + saleProduct.name + '이(가) 20% 할인 중입니다!');
        addProductSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    setInterval(function () {
      if (selectedProduct) {
        var suggestedProduct = products.find(function (product) {
          return product.id !== selectedProduct && product.quantity > 0;
        });
        if (suggestedProduct) {
          alert(
            suggestedProduct.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
          addProductSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}
function addProductSelectOptions() {
  $productSelect.innerHTML = '';
  products.forEach(function (product) {
    var $option = document.createElement('option');
    $option.value = product.id;

    $option.textContent = product.name + ' - ' + product.price + '원';
    if (product.quantity === 0) $option.disabled = true;
    $productSelect.appendChild($option);
  });
}
function calcCart() {
  total = 0;
  productCount = 0;
  var cartProducts = $cartProducts.children;
  var totalBeforeDiscount = 0;
  for (var i = 0; i < cartProducts.length; i++) {
    (function () {
      var currentProduct;
      for (var j = 0; j < products.length; j++) {
        if (products[j].id === cartProducts[i].id) {
          currentProduct = products[j];
          break;
        }
      }

      var quantity = parseInt(
        cartProducts[i].querySelector('span').textContent.split('x ')[1]
      );
      var currentProductTotal = currentProduct.price * quantity;
      var discountRate = 0;
      productCount += quantity;
      totalBeforeDiscount += currentProductTotal;
      if (quantity >= 10) {
        if (currentProduct.id === 'p1') discountRate = 0.1;
        else if (currentProduct.id === 'p2') discountRate = 0.15;
        else if (currentProduct.id === 'p3') discountRate = 0.2;
        else if (currentProduct.id === 'p4') discountRate = 0.05;
        else if (currentProduct.id === 'p5') discountRate = 0.25;
      }
      total += currentProductTotal * (1 - discountRate);
    })();
  }
  let discountRate = 0;
  if (productCount >= 30) {
    var bulkDiscount = total * 0.25;
    var productDiscount = totalBeforeDiscount - total;
    if (bulkDiscount > productDiscount) {
      total = totalBeforeDiscount * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
    }
  } else {
    discountRate = (totalBeforeDiscount - total) / totalBeforeDiscount;
  }

  if (new Date().getDay() === 2) {
    total *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  $cartTotal.textContent = '총액: ' + Math.round(total) + '원';
  if (discountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild(span);
  }
  updateStockStatusMessage();
  renderbonusPoints();
}
const renderbonusPoints = () => {
  bonusPoints += Math.floor(total / 1000);
  var $pointsTag = document.getElementById('loyalty-points');
  if (!$pointsTag) {
    $pointsTag = document.createElement('span');
    $pointsTag.id = 'loyalty-points';
    $pointsTag.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($pointsTag);
  }
  $pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockStatusMessage() {
  var message = '';
  products.forEach(function (product) {
    if (product.quantity < 5) {
      message +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  $stockStatus.textContent = message;
}
main();
$addToCartButton.addEventListener('click', function () {
  var selectedOption = $productSelect.value;
  var productToAdd = products.find(function (product) {
    return product.id === selectedOption;
  });
  if (productToAdd && productToAdd.quantity > 0) {
    var $cartProduct = document.getElementById(productToAdd.id);
    if ($cartProduct) {
      var updatedQuantity =
        parseInt(
          $cartProduct.querySelector('span').textContent.split('x ')[1]
        ) + 1;
      if (updatedQuantity <= productToAdd.quantity) {
        $cartProduct.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          updatedQuantity;
        productToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newProduct = document.createElement('div');
      newProduct.id = productToAdd.id;
      newProduct.className = 'flex justify-between items-center mb-2';
      newProduct.innerHTML =
        '<span>' +
        productToAdd.name +
        ' - ' +
        productToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';
      $cartProducts.appendChild(newProduct);
      productToAdd.quantity--;
    }
    calcCart();
    selectedProduct = selectedOption;
  }
});
$cartProducts.addEventListener('click', function (event) {
  var target = event.target;

  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    var selectedProductId = target.dataset.productId;
    var $selectedProduct = document.getElementById(selectedProductId);
    var product = products.find(function (product) {
      return product.id === selectedProductId;
    });
    if (target.classList.contains('quantity-change')) {
      var quantityChange = parseInt(target.dataset.change);
      var updatedQuantity =
        parseInt(
          $selectedProduct.querySelector('span').textContent.split('x ')[1]
        ) + quantityChange;
      if (
        updatedQuantity > 0 &&
        updatedQuantity <=
          product.quantity +
            parseInt(
              $selectedProduct.querySelector('span').textContent.split('x ')[1]
            )
      ) {
        $selectedProduct.querySelector('span').textContent =
          $selectedProduct.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          updatedQuantity;
        product.quantity -= quantityChange;
      } else if (updatedQuantity <= 0) {
        $selectedProduct.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      var remainQuantity = parseInt(
        $selectedProduct.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += remainQuantity;
      $selectedProduct.remove();
    }
    calcCart();
  }
});
