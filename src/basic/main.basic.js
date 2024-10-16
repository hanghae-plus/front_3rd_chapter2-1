import { AddCartButton } from './components/AddCartButton';
import { CartList } from './components/CartList';
import { Select } from './components/Select';
import { StockInfo } from './components/StockInfo';
import { Sum } from './components/Sum';

class Main {
  #prodList = [];
  #lastSel;

  constructor() {
    /**
     * TODO:
     * 1. getter, setter 만들기
     * 2. 컴포넌트에 handler로 넘겨주기 (각 컴포넌트에서 직접조작X)
     */
    this.prodList = [
      { id: 'p1', name: '상품1', val: 10000, q: 50 },
      { id: 'p2', name: '상품2', val: 20000, q: 30 },
      { id: 'p3', name: '상품3', val: 30000, q: 20 },
      { id: 'p4', name: '상품4', val: 15000, q: 0 },
      { id: 'p5', name: '상품5', val: 25000, q: 10 },
    ];

    const root = document.getElementById('app');
    const cont = document.createElement('div');
    const wrap = document.createElement('div');
    const hTxt = document.createElement('h1');

    cont.className = 'bg-gray-100 p-8';
    wrap.className =
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
    hTxt.className = 'text-2xl font-bold mb-4';

    hTxt.textContent = '장바구니';

    wrap.appendChild(hTxt);
    cont.appendChild(wrap);
    root.appendChild(cont);

    // 컴포넌트 초기화
    this.stockInfo = new StockInfo({ wrap, productList: this.prodList });
    const sum = new Sum({ wrap });
    const cartDisp = new CartList({
      $root: wrap,
      productList: this.#prodList,
      setProductList: (productList) => {
        this.prodList = productList;
      },
      updateSumDetails: ({ totalPrice, discount }) => {
        sum.totalPrice = totalPrice;
        sum.discountRate = discount;
      },
    });
    this.select = new Select({ wrap, prodList: this.#prodList });

    new AddCartButton({
      $root: wrap,
      $select: this.select.$element,
      productList: this.#prodList,
      handleAddCart: (itemToAdd) => cartDisp.handleAddToCart(itemToAdd),
    });

    this.stockInfo.mount();

    this.startFlashSale();
    this.startSuggestionSale();
  }

  get prodList() {
    return this.#prodList;
  }
  set prodList(nextProdList) {
    this.#prodList = nextProdList;

    this.stockInfo?.render();
    this.select?.render();
  }

  // 우선 단일상품만 업데이트되도록
  updateProductList(nextProduct) {
    if (!nextProduct) return;

    this.prodList = this.prodList.map((item) =>
      item.id === nextProduct.id ? nextProduct : item
    );
  }

  startFlashSale() {
    setTimeout(function () {
      setInterval(function () {
        const luckyItem =
          this.prodList[Math.floor(Math.random() * this.prodList.length)];
        if (Math.random() < 0.3 && luckyItem.q > 0) {
          luckyItem.val = Math.round(luckyItem.val * 0.8);
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          this.updateProductList(luckyItem);
        }
      }, 30000);
    }, Math.random() * 10000);
  }

  startSuggestionSale() {
    setTimeout(function () {
      setInterval(function () {
        if (this.#lastSel) {
          const suggest = this.prodList.find(function (item) {
            return item.id !== this.#lastSel && item.q > 0;
          });
          if (suggest) {
            alert(
              suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
            );
            suggest.val = Math.round(suggest.val * 0.95);
            this.updateProductList(suggest);
          }
        }
      }, 60000);
    }, Math.random() * 20000);
  }
}

new Main();
