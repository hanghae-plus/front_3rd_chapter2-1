export class Select {
  constructor({ wrap, prodList }) {
    this.productList = prodList;

    this.$element = document.createElement('select');
    this.$element.id = 'product-select';
    this.$element.className = 'border rounded p-2 mr-2';
    wrap.appendChild(this.$element);

    this.render();
  }

  render() {
    this.$element.innerHTML = this.productList
      .map((item) => {
        const disabled = item.q === 0 ? 'disabled' : '';
        const label = `${item.name} - ${item.val}원`;
        return `<option value="${item.id}" ${disabled}>${label}</option>`;
      })
      .join('');
  }
}
