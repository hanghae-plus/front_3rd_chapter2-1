export class AddCartButton {
  constructor({ $root, productList, $select, handleAddCart }) {
    this.productList = productList;
    this.$select = $select;

    // 버튼 렌더링
    this.$element = document.createElement('button');
    this.$element.id = 'add-to-cart';
    this.$element.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    this.$element.textContent = '추가';
    $root.appendChild(this.$element);

    // 버튼 클릭 이벤트 등록
    this.$element.addEventListener('click', () =>
      handleAddCart(this.#getSelectedItem())
    );
  }

  /** 선택한 아이템 반환 */
  #getSelectedItem() {
    const selectedItem = this.$select.value;
    return this.productList.find((p) => p.id === selectedItem);
  }
}
