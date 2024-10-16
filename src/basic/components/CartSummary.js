export class CartSummary {
  #totalPrice;
  #discountRate;
  #point = 0;

  constructor({ wrap }) {
    this.$element = document.createElement('div');
    this.$element.id = 'cart-total';
    this.$element.className = 'text-xl font-bold my-4';
    wrap.appendChild(this.$element);
  }

  set totalPrice(totalPrice) {
    this.#totalPrice = totalPrice;
    this.#point += Math.floor(totalPrice / 1000);

    this.render();
  }
  get totalPrice() {
    return this.#totalPrice;
  }

  set discountRate(discountRate) {
    this.#discountRate = discountRate;
    this.render();
  }
  get discountRate() {
    return this.#discountRate;
  }

  render() {
    this.$element.innerHTML = `총액: ${Math.round(this.totalPrice)}원${
      this.#discountRate > 0
        ? `<span class="text-green-500 ml-2">(${(this.#discountRate * 100).toFixed(1)}% 할인 적용)</span>`
        : ''
    }<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${this.#point})</span>
    `;
  }
}
