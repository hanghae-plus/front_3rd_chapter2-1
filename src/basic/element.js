import { calcDiscountPrice } from './calc';

export const createElement = (type, props) => {
  const element = document.createElement(type);
  Object.entries(props).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      element[key] = value;
    }
  });
  return element;
};

export const hTxt = createElement('h1', {
  className: 'text-2xl font-bold mb-4',
  textContent: '장바구니',
});

export const cartDisp = createElement('div', { id: 'cart-items' });

export const sum = createElement('div', {
  id: 'cart-total',
  className: 'text-xl font-bold my-4',
});

export const sel = createElement('select', {
  id: 'product-select',
  className: 'border rounded p-2 mr-2',
});

export const addBtn = createElement('button', {
  id: 'add-to-cart',
  className: 'bg-blue-500 text-white px-4 py-2 rounded',
  textContent: '추가',
});

export const stockInfo = createElement('div', {
  id: 'stock-status',
  className: 'text-sm text-gray-500 mt-2',
});

export const wrap = createElement('div', {
  className:
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
});

export const renderElement = (prodList) => {
  const container = createElement('div', { className: 'bg-gray-100 p-8' });
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  container.appendChild(wrap);

  renderOptions(prodList);

  return container;
};

export const renderOptions = (prodList) => {
  sel.innerHTML = '';
  prodList.forEach(function (item) {
    var opt = document.createElement('option');
    opt.value = item.id;

    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.amount === 0) opt.disabled = true;
    sel.appendChild(opt);
  });
};

const setIntervalAlert = (msg, callback, interval, time) => {
  setTimeout(() => {
    setInterval(() => {
      alert(msg);
      callback;
    }, interval);
  }, Math.random() * time);
};

export const setDiscountAlert = (prodList, lastSel) => {
  const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  if (Math.random() < 0.3 && luckyItem.amount > 0) {
    luckyItem.price = calcDiscountPrice(luckyItem.price, 0.8);
    setIntervalAlert(
      '번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!',
      renderOptions(prodList),
      30000,
      10000
    );
  }
  if (lastSel) {
    const suggest = prodList.find(
      (item) => item.id !== lastSel && item.amount > 0
    );
    if (suggest) {
      suggest.price = calcDiscountPrice(suggest.price, 0.95);
      setIntervalAlert(
        suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
        renderOptions(prodList),
        60000,
        20000
      );
    }
  }
};

export const renderPointTag = (bonusPts) => {
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    sum.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

export const renderStockMsg = (prodList) => {
  let infoMsg = '';
  prodList.forEach(function (item) {
    if (item.amount < 5) {
      infoMsg += `${item.name}: ${item.amount > 0 ? '재고 부족 (' + item.amount + '개 남음)' : '품절'}\n`;
    }
  });
  stockInfo.textContent = infoMsg;
};

export const renderDiscountTxt = (discRate) => {
  const span = createElement('span', {
    className: 'text-green-500 ml-2',
    textContent: `(${(discRate * 100).toFixed(1)}% 할인 적용)`,
  });
  sum.appendChild(span);
};

export const renderItem = (itemToAdd) => {
  const htmlString = `
        <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
            data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
            data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
            data-product-id="${itemToAdd.id}">삭제</button>
        </div>
      `;
  const newItem = createElement('div', {
    id: itemToAdd.id,
    className: 'flex justify-between items-center mb-2',
    innerHTML: htmlString,
  });
  cartDisp.appendChild(newItem);
};
