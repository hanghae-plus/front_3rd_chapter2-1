import React, { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountRate: number;
}

interface Item {
  id: string;
  quantity: number;
  name: string;
  price: number;
}

const initProductList = () => [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50, discountRate: 0.1 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30, discountRate: 0.15 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20, discountRate: 0.2 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0, discountRate: 0.05 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10, discountRate: 0.25 },
];

const TOTAL_QUANTITY_FOR_DISCOUNT = 30;
const TOTAL_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const QUANTITY_FOR_DISCOUNT = 10;

const LUCKY_DELAY_TIME = Math.random() * 10000;
const LUCKY_INTERVAL_TIME = 30000;
const LUCKY_RANDOM_RATE = 0.3;
const LUCKY_DISCOUNT_RATE = 0.2;
const SUGGEST_DELAY_TIME = Math.random() * 20000;
const SUGGEST_INTERVAL_TIME = 60000;
const SUGGEST_DISCOUNT_RATE = 0.05;

function isTuesday() {
  return new Date().getDay() === 2;
}

function calculateTotalDiscountRate({
  totalAmountWithoutDiscount,
  totalAmount,
  totalQuantity,
}) {
  let totalDiscountRate = 0;
  const itemDiscount = totalAmountWithoutDiscount - totalAmount;
  if (totalQuantity >= TOTAL_QUANTITY_FOR_DISCOUNT) {
    const bulkDiscount = totalAmount * TOTAL_DISCOUNT_RATE;
    if (bulkDiscount > itemDiscount) {
      totalAmount = totalAmountWithoutDiscount * (1 - TOTAL_DISCOUNT_RATE);
      totalDiscountRate = TOTAL_DISCOUNT_RATE;
    } else {
      totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
    }
  } else {
    totalDiscountRate = itemDiscount / (totalAmountWithoutDiscount || 1);
  }
  if (isTuesday()) {
    totalDiscountRate = Math.max(totalDiscountRate, TUESDAY_DISCOUNT_RATE);
  }
  return { totalDiscountRate, totalAmount };
}

function createDelayedIntervalFunction(callback, delay, interval) {
  return function () {
    setTimeout(function () {
      setInterval(callback, interval);
    }, delay);
  };
}

function hasClickButton(target) {
  return (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  );
}

const App: React.FC = () => {
  const [productList, setProductList] = useState(initProductList());
  const [itemList, setItemList] = useState<Item[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscountRate, setTotalDiscountRate] = useState(0);
  const [lastAddedProduct, setLastAddedProduct] = useState<null | string>(null);
  const [selectedItemId, setSelectedItemId] = useState(productList[0].id);

  // renderCart
  const calculateCart = () => {
    const initTotalAmount = itemList.reduce((acc, cur) => {
      const currentItem = productList.find(
        (product) => product.id === cur.id,
      ) as Product;
      const quantity = cur.quantity;
      const itemAmount = currentItem.price * quantity;
      const discountRate =
        quantity >= QUANTITY_FOR_DISCOUNT ? currentItem.discountRate : 0;
      return acc + itemAmount * (1 - discountRate);
    }, 0);

    const totalAmountWithoutDiscount = itemList.reduce((acc, cur) => {
      const currentItem = productList.find(
        (product) => product.id === cur.id,
      ) as Product;
      const quantity = cur.quantity;
      return acc + currentItem.price * quantity;
    }, 0);
    const totalQuantity = itemList.reduce((acc, cur) => acc + cur.quantity, 0);

    let { totalDiscountRate: _totalDiscountRate, totalAmount: _totalAmount } =
      calculateTotalDiscountRate({
        totalAmountWithoutDiscount,
        totalAmount: initTotalAmount,
        totalQuantity,
      });

    if (isTuesday()) {
      _totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    }
    setLoyaltyPoints(Math.floor(_totalAmount / 1000));
    setTotalAmount(_totalAmount);
    setTotalDiscountRate(_totalDiscountRate);
  };

  useEffect(() => {
    calculateCart();
    createDelayedIntervalFunction(
      () => {
        const _productList = [...productList];
        const luckyItem =
          _productList[Math.floor(Math.random() * _productList.length)];
        if (Math.random() < LUCKY_RANDOM_RATE && luckyItem.quantity > 0) {
          luckyItem.price = Math.round(
            luckyItem.price * (1 - LUCKY_DISCOUNT_RATE),
          );
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          setProductList(_productList);
        }
      },
      LUCKY_DELAY_TIME,
      LUCKY_INTERVAL_TIME,
    )();
    createDelayedIntervalFunction(
      () => {
        if (!lastAddedProduct) return;
        const _productList = [...productList];
        const suggest = _productList.find(
          (_product) =>
            _product.id !== lastAddedProduct && _product.quantity > 0,
        );
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(
            suggest.price * (1 - SUGGEST_DISCOUNT_RATE),
          );
          setProductList(_productList);
        }
      },
      SUGGEST_DELAY_TIME,
      SUGGEST_INTERVAL_TIME,
    )();
  }, []);

  const handleAddClick = () => {
    const _productList = [...productList];
    const _itemList = [...itemList];
    const selectedProduct = _productList.find(
      (product) => product.id === selectedItemId,
    );
    if (!selectedProduct || selectedProduct.quantity <= 0) return;
    const selectedItem = _itemList.find((_item) => selectedItemId === _item.id);
    if (selectedItem) {
      const newQuantity = selectedItem.quantity + 1;
      if (newQuantity <= selectedProduct.quantity) {
        selectedItem.quantity += 1;
        setItemList(_itemList);
        selectedProduct.quantity--;
        setProductList(_productList);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      _itemList.push({
        id: selectedItemId,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      });
      selectedProduct.quantity--;
      setItemList(_itemList);
      setProductList(_productList);
    }
    calculateCart();
    setLastAddedProduct(selectedItemId);
  };

  const handleCartItemsClick = (event) => {
    const target = event.target;
    if (!hasClickButton(target)) {
      return;
    }
    const itemId = target.dataset.productId;
    const _productList = [...productList];
    const _itemList = [...itemList];
    const product = _productList.find(
      (_product) => _product.id === itemId,
    ) as Product;
    const item = _itemList.find((_item) => _item.id === itemId) as Item;

    if (target.classList.contains('quantity-change')) {
      const changedQuantity = parseInt(target.dataset.change);
      const newQuantity = item.quantity + changedQuantity;
      if (newQuantity > 0 && changedQuantity <= product.quantity) {
        item.quantity = newQuantity;
        product.quantity -= changedQuantity;
        setItemList(_itemList);
        setProductList(_productList);
      } else if (newQuantity <= 0) {
        setItemList(_itemList.filter((_item) => _item.id !== itemId));
        product.quantity -= changedQuantity;
        setProductList(_productList);
      } else {
        alert('재고가 부족합니다.');
      }
    }

    if (target.classList.contains('remove-item')) {
      const removeQuantity = item.quantity;
      product.quantity += removeQuantity;
      setProductList(_productList);
      setItemList(_itemList.filter((_item) => _item.id !== itemId));
    }
    calculateCart();
  };

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items" onClick={handleCartItemsClick}>
          {itemList.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{`${item.name} - ${item.price}원 x ${item.quantity}`}</span>
              <div>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={item.id}
                  data-change="-1"
                >
                  -
                </button>
                <button
                  className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  data-product-id={item.id}
                  data-change="1"
                >
                  +
                </button>
                <button
                  className="remove-item bg-red-500 text-white px-2 py-1 rounded"
                  data-product-id={item.id}
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
        <div id="cart-total" className="text-xl font-bold my-4">
          {`총액: ${Math.round(totalAmount)}원`}
          {totalDiscountRate > 0 && (
            <span className="text-green-500 ml-2">{`(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)`}</span>
          )}
          <span id="loyalty-points" className="text-blue-500 ml-2">
            {`(포인트: ${loyaltyPoints})`}
          </span>
        </div>
        <select
          id="product-select"
          className="border rounded p-2 mr-2"
          value={selectedItemId}
          onChange={({ target: { value } }) => setSelectedItemId(value)}
        >
          {productList.map((product) => (
            <option
              key={product.id}
              value={product.id}
              disabled={product.quantity === 0}
            >
              {`${product.name} - ${product.price}원`}
            </option>
          ))}
        </select>
        <button
          id="add-to-cart"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddClick}
        >
          추가
        </button>
        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          {productList
            .filter((product) => product.quantity < 5)
            .reduce(
              (acc, cur) =>
                `${acc}${cur.name}: ${cur.quantity > 0 ? `재고 부족 (${cur.quantity}개 남음` : '품절'}\n`,
              '',
            )}
        </div>
      </div>
    </div>
  );
};

export default App;
