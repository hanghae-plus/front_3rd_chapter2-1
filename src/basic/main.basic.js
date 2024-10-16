import { AddCartButton } from './components/AddCartButton';
import { CartList } from './components/CartList';
import { CartSummary } from './components/CartSummary';
import { Select } from './components/Select';
import { StockInfo } from './components/StockInfo';

class Main {
  #productList = [];
  #lastSel;

  constructor() {
    this.productList = [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 },
    ];

    const $root = document.getElementById('app');
    const $container = document.createElement('div');
    const $cart = document.createElement('div');
    const $title = document.createElement('h1');

    $container.className = 'bg-gray-100 p-8';
    $cart.className =
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
    $title.className = 'text-2xl font-bold mb-4';
    $title.textContent = '장바구니';

    $cart.appendChild($title);
    $container.appendChild($cart);
    $root.appendChild($container);

    // 컴포넌트 초기화
    this.CartSummary = new CartSummary({ $root: $cart });

    this.CartList = new CartList({
      $root: $cart,
      productList: this.#productList,
      setProductList: (productList) => {
        this.productList = productList;
      },
      updateSumDetails: ({ totalPrice, discount }) => {
        this.CartSummary.totalPrice = totalPrice;
        this.CartSummary.discountRate = discount;
      },
    });

    this.Select = new Select({ wrap: $cart, prodList: this.#productList });

    new AddCartButton({
      $root: $cart,
      productList: this.#productList,
      getSelectId: () => this.Select.$element.value,
      handleAddCart: (itemToAdd) => this.CartList.handleAddToCart(itemToAdd),
    });

    this.StockInfo = new StockInfo({
      $root: $cart,
      productList: this.productList,
    });

    // 세일 초기화
    this.startFlashSale();
    this.startSuggestionSale();
  }

  get productList() {
    return this.#productList;
  }

  set productList(nextProdList) {
    this.#productList = nextProdList;

    this.StockInfo?.render();
    this.Select?.render();
  }

  /** 개별 상품 업데이트 */
  updateProduct(nextProduct) {
    if (!nextProduct) return;

    this.productList = this.productList.map((item) =>
      item.id === nextProduct.id ? nextProduct : item
    );
  }

  /** 번개 세일 시작 */
  startFlashSale() {
    setTimeout(() => {
      setInterval(() => {
        const discountItem =
          this.productList[Math.floor(Math.random() * this.productList.length)];
        if (Math.random() < 0.3 && discountItem.q > 0) {
          alert('번개세일! ' + discountItem.name + '이(가) 20% 할인 중입니다!');
          this.updateProduct({
            ...discountItem,
            val: Math.round(discountItem.val * 0.8),
          });
        }
      }, 30000);
    }, Math.random() * 10000);
  }

  /** 추천 상품 세일 시작 */
  startSuggestionSale() {
    setTimeout(() => {
      setInterval(() => {
        if (!this.#lastSel) return;

        const discountItem = this.productList.find(
          (item) => item.id !== this.#lastSel && item.q > 0
        );
        if (discountItem) {
          alert(
            discountItem.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          this.updateProduct({
            ...discountItem,
            val: Math.round(discountItem.val * 0.95),
          });
        }
      }, 60000);
    }, Math.random() * 20000);
  }
}

new Main();
