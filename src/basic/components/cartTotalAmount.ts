import { createElementWithProps } from '@basic/lib/dom';
import CustomHTMLElemnt from '@basic/lib/element';
import { totalAmountStore } from '@basic/store/totalAmount';

export default class CartTotalAmount extends CustomHTMLElemnt {
  private points: number = 0;
  private totalPrice: number = 0;
  private textNode: Text;
  private discountSpan: HTMLSpanElement;

  constructor(tagName: string, props: { [key: string]: string } = {}) {
    super(tagName, props);
    // 총액 표시할 text node 생성
    this.textNode = document.createTextNode('');
    this._dom.appendChild(this.textNode);

    // 할인율 표시할 span 생성
    const discountProps = { className: 'text-green-500 ml-2' };
    this.discountSpan = createElementWithProps('span', discountProps);
    this._dom.appendChild(this.discountSpan);

    // 포인트 DOM 생성
    const newPointsTag = createElementWithProps('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    this._dom.appendChild(newPointsTag);
  }

  // 총액, 할인율, 포인트 업데이트
  update() {
    const { price, rate } = totalAmountStore.getState();
    this.updateTotal(price);
    this.updateDiscount(rate);
    this.updatePoint(price);
  }

  // 총액 업데이트
  updateTotal(discountPrice: number) {
    if (this.totalPrice === discountPrice) return;

    this.totalPrice = discountPrice;
    this.textNode.textContent = `총액: ${Math.round(discountPrice)}원`;
  }

  // 할인율 업데이트
  updateDiscount(discountRate: number) {
    if (discountRate > 0) {
      const rate = Math.floor(discountRate * 100).toFixed(1);
      this.discountSpan.textContent = `(${rate}% 할인 적용)`;
    } else {
      this.discountSpan.textContent = '';
    }
  }

  // 포인트 업데이트
  updatePoint(discountPrice: number) {
    this.points += Math.floor(discountPrice / 1000);

    const pointsTag = document.getElementById('loyalty-points')!;

    const pointText = this.points > 0 ? `(포인트: ${this.points})` : '';
    pointsTag.textContent = pointText;
  }
}
