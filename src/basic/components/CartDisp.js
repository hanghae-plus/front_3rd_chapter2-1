// 할인 계산
const DISCOUNTS = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

export class CartDisp {
  constructor({ wrap, prodList, updateStockInfo, updateSumDetails }) {
    this.totalAmt = 0;
    this.itemCnt = 0;
    this.prodList = prodList;
    this.updateStockInfo = updateStockInfo;
    this.updateSumDetails = updateSumDetails;

    // 카트 렌더링
    this.$element = document.createElement('div');
    this.$element.id = 'cart-items';
    wrap.appendChild(this.$element);

    // 카트 초기 계산
    this.calcCart();

    // 이벤트 리스너 등록
    this.$element.addEventListener('click', (event) =>
      this.handleCartClick(event)
    );
  }

  /** 현재 아이템에 맞는 할인율 계산 */
  calculateDiscount(id, quantity) {
    if (quantity >= 10 && DISCOUNTS[id]) {
      return DISCOUNTS[id];
    }
    return 0;
  }

  /** 아이템 총 가격 계산 */
  calculateItemTotal(item, quantity) {
    return (
      item.val * quantity * (1 - this.calculateDiscount(item.id, quantity))
    );
  }

  /** 카트 계산 메서드 */
  calcCart() {
    this.totalAmt = 0;
    this.itemCnt = 0;
    let subTot = 0;

    Array.from(this.$element.children).forEach((cartItem) => {
      const curItem = this.prodList.find((p) => p.id === cartItem.id);
      if (curItem) {
        const quantity = parseInt(
          cartItem.querySelector('span').textContent.split('x ')[1]
        );
        const itemTotal = this.calculateItemTotal(curItem, quantity);
        this.itemCnt += quantity;
        subTot += curItem.val * quantity;
        this.totalAmt += itemTotal;
      }
    });

    // 대량 구매 할인 적용
    const bulkDiscount = this.itemCnt >= 30 ? 0.25 : 0;
    let discRate =
      bulkDiscount > 0 ? bulkDiscount : (subTot - this.totalAmt) / subTot;

    // 화요일 특별 할인 적용
    if (new Date().getDay() === 2) {
      this.totalAmt *= 0.9; // 10% 할인 적용
      discRate = Math.max(discRate, 0.1);
    }

    this.updateSumDetails({
      totalPrice: this.totalAmt,
      discount: discRate,
    });
    this.updateStockInfo(this.prodList);
  }

  /** 기존 아이템 수량 업데이트 */
  updateExistingItem(itemElem, itemToAdd) {
    const newQty =
      parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + 1;
    if (newQty <= itemToAdd.q) {
      itemElem.querySelector('span').textContent =
        `${itemToAdd.name} - ${itemToAdd.val}원 x ${newQty}`;
      itemToAdd.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  }

  /** 새로운 아이템 추가 */
  addNewItemToCart(itemToAdd) {
    const newItem = document.createElement('div');
    newItem.id = itemToAdd.id;
    newItem.className = 'flex justify-between items-center mb-2';
    newItem.innerHTML = `
        <span>${itemToAdd.name} - ${itemToAdd.val}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
        </div>
      `;
    this.$element.appendChild(newItem);
    itemToAdd.q--;
  }

  /** 카트에 아이템 추가 처리 */
  handleAddToCart(itemToAdd) {
    if (itemToAdd && itemToAdd.q > 0) {
      const existingItem = document.getElementById(itemToAdd.id);

      if (existingItem) {
        this.updateExistingItem(existingItem, itemToAdd);
      } else {
        this.addNewItemToCart(itemToAdd);
      }

      // 카트 재계산
      this.calcCart();
    } else {
      alert('재고가 부족합니다.');
    }
  }

  /** 카트 클릭 이벤트 핸들러 */
  handleCartClick(event) {
    const tgt = event.target;
    if (
      tgt.classList.contains('quantity-change') ||
      tgt.classList.contains('remove-item')
    ) {
      const prodId = tgt.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prod = this.prodList.find((p) => p.id === prodId);

      if (!prod || !itemElem) return;

      const currentQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );

      if (tgt.classList.contains('quantity-change')) {
        const qtyChange = parseInt(tgt.dataset.change);
        const newQty = currentQty + qtyChange;

        if (newQty > 0 && newQty <= prod.q + currentQty) {
          itemElem.querySelector('span').textContent =
            `${itemElem.querySelector('span').textContent.split('x ')[0]}x ${newQty}`;
          prod.q -= qtyChange;
        } else if (newQty <= 0) {
          itemElem.remove();
          prod.q += currentQty;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (tgt.classList.contains('remove-item')) {
        prod.q += currentQty;
        itemElem.remove();
      }

      this.calcCart();
    }
  }
}
