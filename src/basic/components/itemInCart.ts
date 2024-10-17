import { findCartItemById } from '@basic/utils/find';
import CustomHTMLElemnt from '@basic/lib/element';
import { appendChildren } from '@basic/lib/dom';

export default class ItemInCart extends CustomHTMLElemnt {
  get label(): HTMLSpanElement | null {
    return this._dom.querySelector('span');
  }
  constructor(tagName: string, props: { [key: string]: string } = {}) {
    super(tagName, props);
  }

  update() {
    if (!this.label) return;

    const itemData = findCartItemById(this.elementId);
    if (!itemData) return;

    const { name, price, quantity } = itemData;
    this.label!.textContent = `${name} - ${price}원 x ${quantity}`;
  }

  append(elements: HTMLElement[]) {
    appendChildren(this._dom, elements);
  }
}
