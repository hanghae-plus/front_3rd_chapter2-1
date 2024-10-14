let bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

export function CartDisp({ wrap, prodList, sum, stockInfo }) {
  const cartDisp = document.createElement('div');
  cartDisp.id = 'cart-items';
  wrap.appendChild(cartDisp);

  this.$element = cartDisp;

  this.calcCart = () => {
    totalAmt = 0;
    itemCnt = 0;
    const cartItems = cartDisp.children;
    let subTot = 0;
    for (let i = 0; i < cartItems.length; i++) {
      (function () {
        let curItem;
        for (let j = 0; j < prodList.length; j++) {
          if (prodList[j].id === cartItems[i].id) {
            curItem = prodList[j];
            break;
          }
        }

        const q = parseInt(
          cartItems[i].querySelector('span').textContent.split('x ')[1]
        );
        const itemTot = curItem.val * q;
        let disc = 0;
        itemCnt += q;
        subTot += itemTot;
        if (q >= 10) {
          if (curItem.id === 'p1') disc = 0.1;
          else if (curItem.id === 'p2') disc = 0.15;
          else if (curItem.id === 'p3') disc = 0.2;
          else if (curItem.id === 'p4') disc = 0.05;
          else if (curItem.id === 'p5') disc = 0.25;
        }
        totalAmt += itemTot * (1 - disc);
      })();
    }
    let discRate = 0;
    if (itemCnt >= 30) {
      const bulkDisc = totalAmt * 0.25;
      const itemDisc = subTot - totalAmt;
      if (bulkDisc > itemDisc) {
        totalAmt = subTot * (1 - 0.25);
        discRate = 0.25;
      } else {
        discRate = (subTot - totalAmt) / subTot;
      }
    } else {
      discRate = (subTot - totalAmt) / subTot;
    }

    if (new Date().getDay() === 2) {
      totalAmt *= 1 - 0.1;
      discRate = Math.max(discRate, 0.1);
    }
    sum.textContent = '총액: ' + Math.round(totalAmt) + '원';

    if (discRate > 0) {
      const span = document.createElement('span');
      span.className = 'text-green-500 ml-2';
      span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
      sum.appendChild(span);
    }
    const renderBonusPts = () => {
      bonusPts += Math.floor(totalAmt / 1000);
      let ptsTag = document.getElementById('loyalty-points');
      if (!ptsTag) {
        ptsTag = document.createElement('span');
        ptsTag.id = 'loyalty-points';
        ptsTag.className = 'text-blue-500 ml-2';
        sum.appendChild(ptsTag);
      }
      ptsTag.textContent = '(포인트: ' + bonusPts + ')';
    };

    function updateStockInfo() {
      let infoMsg = '';
      prodList.forEach(function (item) {
        if (item.q < 5) {
          infoMsg +=
            item.name +
            ': ' +
            (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
            '\n';
        }
      });
      stockInfo.textContent = infoMsg;
    }

    updateStockInfo();
    renderBonusPts();
  };

  this.calcCart();

  cartDisp.addEventListener('click', (event) => {
    const tgt = event.target;

    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = prodList.find(function (p) {
        return p.id === prodId;
      });
      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const newQty =
          parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
          qtyChange;
        if (
          newQty > 0 &&
          newQty <=
            prod.q +
              parseInt(
                itemElem.querySelector('span').textContent.split('x ')[1]
              )
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] +
            'x ' +
            newQty;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.q -= qtyChange;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        const remQty = parseInt(
          itemElem.querySelector('span').textContent.split('x ')[1]
        );
        prod.q += remQty;
        itemElem.remove();
      }
      this.calcCart();
    }
  });
}
