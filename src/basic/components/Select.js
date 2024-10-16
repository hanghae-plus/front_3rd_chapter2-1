export class Select {
  #productList = [];

  constructor({ wrap, prodList }) {
    this.$element = document.createElement('select');
    this.$element.id = 'product-select';
    this.$element.className = 'border rounded p-2 mr-2';
    wrap.appendChild(this.$element);

    this.#productList = prodList;

    this.render();
  }

  render() {
    this.$element.innerHTML = this.#productList
      .map((item) => {
        const disabled = item.q === 0 ? 'disabled' : '';
        const label = `${item.name} - ${item.val}원`;
        return `<option value="${item.id}" ${disabled}>${label}</option>`;
      })
      .join('');
  }
}
