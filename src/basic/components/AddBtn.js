export class AddBtn {
  constructor({ wrap, prodList, setProdList, $select, cartDisp, calcCart }) {
    this.prodList = prodList;
    this.setProdList = setProdList;
    this.$select = $select;
    this.cartDisp = cartDisp;
    this.calcCart = calcCart;

    // 버튼 렌더링
    this.$element = document.createElement('button');
    this.$element.id = 'add-to-cart';
    this.$element.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    this.$element.textContent = '추가';
    wrap.appendChild(this.$element);

    // 버튼 클릭 이벤트 등록
    this.$element.addEventListener('click', () => this.handleAddToCart());
  }

  /** 선택한 아이템 반환 */
  getSelectedItem() {
    const selItem = this.$select.value;
    return this.prodList.find((p) => p.id === selItem);
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
    this.cartDisp.appendChild(newItem);
    itemToAdd.q--;
  }

  /** 카트에 아이템 추가 처리 */
  handleAddToCart() {
    const itemToAdd = this.getSelectedItem();

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
}
