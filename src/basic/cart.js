import { prodList } from './productList.js';
import { cartDisp, renderCartDetails, sum } from './ui.js';
import { sel } from './ui.js';

let totalAmt = 0,
  itemCnt = 0,
  bonusPts = 0;

export function initializeCart() {
  calcCart();
}

export function calcCart() {
  totalAmt = 0;
  itemCnt = 0;
  const cartItems = cartDisp.children;
  let subTot = 0;

  Array.from(cartItems).forEach((cartItem) => {
    const curItem = prodList.find(({ id }) => id === cartItem.id);
    if (!curItem) {
      console.error('Item not found in prodList:', cartItem.id);
      return;
    }

    const curStock = parseInt(
      cartItem.querySelector('span').textContent.split('x ')[1],
    );
    if (isNaN(curStock)) {
      console.error('Invalid stock for item:', cartItem.id);
      return;
    }

    const itemTot = curItem.price * curStock;
    if (isNaN(itemTot)) {
      console.error('Invalid itemTot for item:', cartItem.id, 'price:', curItem.price, 'stock:', curStock);
      return;
    }

    let disc = calculateItemDiscount(curItem, curStock) || 0;

    itemCnt += curStock;
    subTot += itemTot;
    totalAmt += itemTot * (1 - disc);
  });

  let discountRate = subTot > 0 ? (subTot - totalAmt) / subTot : 0;

  if (itemCnt >= 30) {
    const bulkDisc = totalAmt * 0.25;
    const itemDisc = subTot - totalAmt;
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * 0.75;
    }
  }

  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 2) {
    totalAmt *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  if (isNaN(totalAmt) || isNaN(discountRate)) {
    console.error('NaN detected in final calculation. Using fallback values.');
    totalAmt = subTot;
    discountRate = 0;
  }

  bonusPts += Math.floor(totalAmt / 1000);

  renderCartDetails(totalAmt, discountRate);
  updateStockInfo();
  renderBonusPts();
}


function calculateItemDiscount(item, quantity) {
  if (quantity >= 10) {
    switch (item.id) {
      case 'p1': return 0.1;
      case 'p2': return 0.15;
      case 'p3': return 0.2;
      case 'p4': return 0.05;
      case 'p5': return 0.25;
      default: return 0;
    }
  }
  return 0;
}

export function updateStockInfo() {
  let infoMsg = prodList
    .filter(item => item.stock < 5)
    .map(({ name, stock }) => `${name}: ${stock > 0 ? '재고 부족 (' + stock + '개 남음)' : '품절'}`)
    .join('\n');

  document.getElementById('stock-status').textContent = infoMsg;
}

export function renderBonusPts() {
  let ptsTag = document.getElementById('loyalty-points')
  if (!ptsTag) {
    ptsTag = document.createElement('span')
    ptsTag.id = 'loyalty-points'
    ptsTag.className = 'text-blue-500 ml-2'
    sum.appendChild(ptsTag)
  }
  ptsTag.textContent = `(포인트: ${bonusPts})`
}

export function handleAddToCart() {
  const selItem = sel.value; 
  const itemToAdd = prodList.find(stock => stock.id === selItem);

  if (itemToAdd && itemToAdd.stock > 0) {
    
    let item = document.getElementById(itemToAdd.id);
    if (item) {
      
      const currentQty = parseInt(item.querySelector('span').textContent.split('x ')[1]);
      const newQty = currentQty + 1;

      if (newQty <= itemToAdd.stock) { 
        item.querySelector('span').textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.stock--; 
      } else {
        alert('재고가 부족합니다.'); 
      }
    } else {
      
      item = document.createElement('div');
      item.id = itemToAdd.id; 
      item.className = 'flex justify-between items-center mb-2';
      item.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>`;
        
      cartDisp.appendChild(item); 
      itemToAdd.stock--; 
    }
    calcCart(); 
    updateStockInfo()
  } else {
    alert('재고가 부족합니다.'); 
  }
}

export function handleCartInteraction(event) {
  const tgt = event.target; 

  
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId; 
    const itemElem = document.getElementById(prodId); 
    const prod = prodList.find(p => p.id === prodId); 

    if (tgt.classList.contains('quantity-change')) {
      const qtyChange = parseInt(tgt.dataset.change); 
      const currentQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]); 
      const newQty = currentQty + qtyChange; 
      if (newQty > 0 && newQty <= (prod.stock + currentQty)) { 
        itemElem.querySelector('span').textContent = `${prod.name} - ${prod.price}원 x ${newQty}`; 
        prod.stock -= qtyChange; 
      } else if (newQty <= 0) {
        itemElem.remove();
        prod.stock += currentQty; 
      } else {
        alert('재고가 부족합니다.'); 
      }
    } else if (tgt.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]); 
      prod.stock += remQty; 
      itemElem.remove(); 
    }
    calcCart(); 
    updateStockInfo(); 
  }
}