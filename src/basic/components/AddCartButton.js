export class AddCartButton {
  constructor({ $root, productList, handleAddCart, getSelectId }) {
    this.productList = productList;

    this.$element = document.createElement('button');
    this.$element.id = 'add-to-cart';
    this.$element.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    this.$element.textContent = '추가';
    $root.appendChild(this.$element);

    this.$element.addEventListener('click', () =>
      handleAddCart(this.#getSelectedItem(getSelectId))
    );
  }

  /** 선택한 아이템 반환 */
  #getSelectedItem(getSelectId) {
    return this.productList.find((p) => p.id === getSelectId());
  }
}
