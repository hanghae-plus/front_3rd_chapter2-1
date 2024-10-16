export class StockInfo {
  constructor({ wrap, productList }) {
    this.productList = productList;

    this.$root = wrap;
    this.$element = document.createElement('div');
    this.$element.id = 'stock-status';
    this.$element.className = 'text-sm text-gray-500 mt-2';
  }

  mount() {
    this.$root.appendChild(this.$element);
  }

  render() {
    const lowStockItems = this.productList.filter((product) => product.q < 5);
    this.$element.textContent = lowStockItems
      .map(
        (item) =>
          `${item.name}: ${item.q > 0 ? `재고 부족 (${item.q}개 남음)` : `품절`}\n`
      )
      .join('');
  }
}
