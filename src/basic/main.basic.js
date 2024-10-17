import { calculateCart } from "./controller/calculateCart";
import { createOptions } from './createElements';
import renderApp from './renderApp';
import { prodList } from "./constants/prodList";
let sel, addBtn, cartsDiv, sumDiv, stockInfoDiv;
let lastSel;

function main() {
  let root = document.getElementById('app');
  root.appendChild(renderApp());

  sel = document.getElementById('product-select');
  addBtn = document.getElementById('add-to-cart');
  cartsDiv = document.getElementById('cart-items');
  sumDiv = document.getElementById('cart-total');
  stockInfoDiv = document.getElementById('stock-status');

  updateSelOpts(sel, prodList);

  calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });

  setTimeout(function () {
    setInterval(function () {
      let luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts(sel, prodList);
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        let suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts(sel, prodList);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function updateSelOpts(sel, prodList) {
  if (!sel) return null;

  sel.innerHTML = '';
  prodList.forEach((item) => {
    const { id, name, val, q } = item;
    const opt = createOptions({ val: id, text: `${name} - ${val}원`, disabled: q === 0 });

    sel.appendChild(opt);
  });
}

main();

addBtn.addEventListener('click', function () {
  let selItem = sel.value;
  let itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.q > 0) {
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.q) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else alert('재고가 부족합니다.');
    } else {
      let newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      cartsDiv.appendChild(newItem);
      itemToAdd.q--;
    }
    calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
    lastSel = selItem;
  }
});

cartsDiv.addEventListener('click', function (event) {
  let tgt = event.target;

  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    let prodId = tgt.dataset.productId;
    let itemElem = document.getElementById(prodId);
    let prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    if (tgt.classList.contains('quantity-change')) {
      let qtyChange = parseInt(tgt.dataset.change);
      let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= prod.q + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.q -= qtyChange;
      } else alert('재고가 부족합니다.');
    } else if (tgt.classList.contains('remove-item')) {
      let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      prod.q += remQty;
      itemElem.remove();
    }
    calculateCart({ prodList, sumDiv, cartsDiv, stockInfoDiv });
  }
});