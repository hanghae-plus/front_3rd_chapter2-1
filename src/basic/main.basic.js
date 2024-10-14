import { AddBtn } from './components/AddBtn';
import { CartDisp } from './components/CartDisp';
import { Select } from './components/Select';
import { StockInfo } from './components/StockInfo';
import { Sum } from './components/Sum';

let lastSel;

function main() {
  const prodList = [
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

  const stockInfo = new StockInfo({ wrap });

  const sum = new Sum({ wrap });
  const cartDisp = new CartDisp({
    wrap,
    prodList,
    sum: sum.$element,
    stockInfo: stockInfo.$element,
  });
  const select = new Select({ wrap, prodList });

  new AddBtn({
    wrap,
    prodList,
    $select: select.$element,
    cartDisp: cartDisp.$element,
    calcCart: (selItem) => {
      cartDisp.calcCart();
      lastSel = selItem;
    },
  });

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        select.updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(suggest.val * 0.95);
          select.updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();
