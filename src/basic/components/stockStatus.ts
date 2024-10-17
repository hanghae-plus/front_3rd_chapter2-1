import { productStore } from '@basic/store/product';
import CustomHTMLElemnt from '@basic/lib/element';

export default class StockStatus extends CustomHTMLElemnt {
  status: string = '';
  constructor(tagName: string, props: { [key: string]: string }) {
    super(tagName, props);
  }

  //재고 상태 정보를 업데이트합니다.
  update() {
    this.status = '';

    const { productList } = productStore.getState();

    productList.forEach(({ name, quantity }: ProductType) => {
      if (quantity < 5) {
        this.status += `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}\n`;
      }
    });

    this._dom.textContent = this.status;
  }
}
