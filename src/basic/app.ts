import { appendChildren, createElementWithProps } from '@basic/lib/dom';
import CartTotalAmount from '@basic/components/cartTotalAmount';
import { setEventListeners } from '@basic/utils/event/eventManager';
import ItemSelectBox from '@basic/components/itemSelectBox';
import StockStatus from '@basic/components/stockStatus';
import Button from '@basic/components/button';
import Cart from '@basic/components/cart';
import { cartStore } from './store/cart';
import { productStore } from './store/product';
import {
  clearAllIntervals,
  startDiscountIntervals,
} from './utils/interval/intervalManager';
import { totalAmountStore } from './store/totalAmount';

export default class App {
  public static getInstance(): App {
    if (!App.instance) App.instance = new App();
    return App.instance;
  }
  private static instance: App;
  private _root: HTMLElement;
  private addBtn: Button;
  private renderList: Array<HTMLElement> = [];
  private lastSelectItemId: string = '';

  cartList: Cart;
  cartTotalAmount: CartTotalAmount;
  selectBox: ItemSelectBox;
  stockStatus: StockStatus;

  get lastItemId(): string {
    return this.lastSelectItemId;
  }
  set lastItemId(id: string) {
    this.lastSelectItemId = id;
  }

  constructor() {
    App.instance = this;
    this._root = document.getElementById('app')!;

    // 장바구니 UI 생성
    this.cartList = new Cart('div', { id: 'cart-items' });

    // 장바구니 총액 UI 생성
    const cartTotalProps = { id: 'cart-total', className: 'total-price' };
    this.cartTotalAmount = new CartTotalAmount('div', cartTotalProps);

    // 제품 select-box 생성
    this.selectBox = new ItemSelectBox({
      id: 'product-select',
      className: 'border rounded p-2 mr-2',
    });

    // 추가 버튼 생성
    this.addBtn = new Button({ id: 'add-to-cart', className: 'cart-btn' });
    this.addBtn.updateText('추가');
    this.addBtn.addEventListener(
      'click',
      this.cartList.addItem.bind(this.cartList)
    );

    // 재고 상태 UI 생성
    const stockStatusProps = { id: 'stock-status', className: 'stock-status' };
    this.stockStatus = new StockStatus('div', stockStatusProps);
  }

  init() {
    clearAllIntervals();

    const title = createElementWithProps('h1', { className: 'card-title' });
    title.textContent = '장바구니';

    this.renderList = [
      title,
      this.cartList._dom,
      this.cartTotalAmount._dom,
      this.selectBox._dom,
      this.addBtn._dom,
      this.stockStatus._dom,
    ];
  }

  render() {
    const container = createElementWithProps('div', { className: 'container' });
    const wrapper = createElementWithProps('div', { className: 'card-wrap' });

    appendChildren(wrapper, this.renderList);
    appendChildren(container, wrapper);
    appendChildren(this._root, container);

    // 이벤트 등록
    setEventListeners(this._root);

    // 번개 / 추천 할인 인터벌
    startDiscountIntervals();

    // 옵저버 등록
    cartStore.subscribe(this.cartList.update.bind(this.cartList));
    totalAmountStore.subscribe(
      this.cartTotalAmount.update.bind(this.cartTotalAmount)
    );
    productStore.subscribe(this.stockStatus.update.bind(this.stockStatus));
  }
}
