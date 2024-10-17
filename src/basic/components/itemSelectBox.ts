import { createElementWithProps } from '@basic/lib/dom';
import { productStore } from '@basic/store/product';

export default class ItemSelectBox {
  _dom: HTMLSelectElement;
  get selectValue() {
    return this._dom.value;
  }
  constructor(props: { [key: string]: string }) {
    this._dom = createElementWithProps('select', props) as HTMLSelectElement;
    this.update();
  }

  update() {
    this._dom.replaceChildren();

    const { productList } = productStore.getState();

    productList.forEach(({ id, name, price, quantity }: ProductType) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = `${name} - ${price}원`;
      if (quantity === 0) option.disabled = true;

      this._dom.appendChild(option);
    });
  }
}
