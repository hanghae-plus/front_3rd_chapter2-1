import { calcDayDiscount, validDayDiscount } from '@basic/hooks/discount/day';
import { createElementWithProps, appendChildren } from '@basic/lib/dom';
import { findCartItemById, findProductById } from '@basic/utils/find';
import { getProductData, updateStock } from '@basic/store/product';
import { totalAmountStore } from '@basic/store/totalAmount';
import { addEvent } from '@basic/utils/event/eventManager';
import CustomHTMLElemnt from '@basic/lib/element';
import ItemInCart from './itemInCart';
import {
  calcBulkDiscount,
  calcDiscountRate,
  getDiscountRate,
  validBulkDiscount,
} from '@basic/hooks/discount';
import {
  createQuantityButton,
  createRemoveButton,
  getCartItemDOM,
  getProductIdBySelectTag,
} from '@basic/hooks/cart';
import {
  decreaseItemInCart,
  increaseItemInCart,
  removeItemToCart,
  addItemToCart,
  cartStore,
} from '@basic/store/cart';

export default class Cart extends CustomHTMLElemnt {
  private itemList: ItemInCart[] = [];
  constructor(tagName: string, props: { [key: string]: string } = {}) {
    super(tagName, props);
  }

  reduceCartData() {
    const { cartItems } = cartStore.getState();
    const { discountedPrice, originalPrice, itemQty } = cartItems.reduce(
      (
        acc: {
          discountedPrice: number;
          originalPrice: number;
          itemQty: number;
        },
        cur: ItemType
      ) => {
        const discountRate = getDiscountRate(cur.id, cur.quantity);
        const totalPrice = cur.price * cur.quantity;

        acc.discountedPrice += totalPrice * (1 - discountRate);
        acc.originalPrice += totalPrice;
        acc.itemQty += cur.quantity;
        return acc;
      },
      { discountedPrice: 0, originalPrice: 0, itemQty: 0 }
    );

    return { discountedPrice, originalPrice, itemQty };
  }

  update() {
    const { discountedPrice, originalPrice, itemQty } = this.reduceCartData();
    let price = discountedPrice;
    let rate = calcDiscountRate(originalPrice, discountedPrice);

    // 대량구매 적용 조건
    const validBulk = validBulkDiscount(
      discountedPrice, //할인 적용된 총액
      originalPrice, // 할인 적용안된 총액
      itemQty // 장바구니 총 수량
    );

    if (validBulk) {
      // 대량 구매 할인
      const { bulkPrice, bulkRate } = calcBulkDiscount(originalPrice);
      price = bulkPrice;
      rate = bulkRate;
    }

    // 요일 추가 할인 적용 조건
    const validDay = validDayDiscount();
    if (validDay) {
      const { dayPrice, dayRate } = calcDayDiscount(price, rate);
      price = dayPrice;
      rate = dayRate;
    }

    // 총액, 할인율 업데이트
    totalAmountStore.setState({ price, rate });

    this.updateItemDOM();
  }

  // 장바구니에 아이템 추가
  addItem() {
    // 선택한 제품 찾기
    const productId = getProductIdBySelectTag();
    const itemData = getProductData(productId);

    const existingItem = document.getElementById(itemData.id);
    if (existingItem) {
      // 장바구니에 제품이 있으면 수량 증가
      this.increaseItem(productId);
    } else {
      // 장바구니에 제품이 없으면 생성
      this.createItem(itemData);
    }
  }

  // 장바구니에 아이템 생성
  createItem(itemData: ProductType) {
    const { id, name, price, quantity } = itemData;
    if (quantity <= 0) return;

    // 장바구니 아이템 DOM 생성
    this.createItemDOM(id, name, price);

    // cart item 최신화
    addItemToCart({ id, name, price, quantity });

    // productList 재고 최신화
    updateStock(id, -1);
  }

  /**
   * 장바구니 아이템 DOM 생성
   * @param {string} id
   * @param {string} name
   * @param {number} price
   */
  createItemDOM(id: string, name: string, price: number) {
    // DOM 생성
    const wrapProps = {
      id,
      className: 'flex justify-between items-center mb-2',
    };
    const itemWrap = new ItemInCart('div', wrapProps);

    const label = createElementWithProps('span');
    label.textContent = `${name} - ${price}원 x 1`;

    const btnWrap = createElementWithProps('div');

    const decreaseBtn = createQuantityButton(id, -1, '-');
    const increaseBtn = createQuantityButton(id, 1, '+');
    const removeBtn = createRemoveButton(id);

    this.itemList.push(itemWrap);

    // EVNET 등록
    addEvent('click', decreaseBtn, this.handleItemCountActions.bind(this));
    addEvent('click', increaseBtn, this.handleItemCountActions.bind(this));
    addEvent('click', removeBtn, this.handleItemCountActions.bind(this));

    // append
    appendChildren(btnWrap, [decreaseBtn, increaseBtn, removeBtn]);
    itemWrap.append([label, btnWrap]);
    appendChildren(this._dom, itemWrap._dom);
  }

  updateItemDOM() {
    this.itemList.forEach((item) => item.update());
  }

  /**
   * 장바구니 내부 아이템 수량 조정 이벤트
   * @param {Event} event
   * @returns
   */
  handleItemCountActions(event: Event) {
    const { target } = event as unknown as { target: HTMLElement };
    if (!target.matches('button')) return;

    const { productId, change } = target.dataset;

    const isRemove = target.classList.contains('remove-item');

    // 수량 +1
    if (change === '1') this.increaseItem(productId!);
    // 수량 -1
    else if (change === '-1') this.decreaseItem(productId!);
    // 제거
    else if (isRemove) this.removeItem(productId!);
  }

  /**
   * 장바구니 내부 아이템 수량 -1
   * @param {string} productId
   */
  decreaseItem(productId: string) {
    const itemData = findProductById(productId);
    const { id } = itemData;

    const itemInCart = findCartItemById(productId);
    if (itemInCart.quantity - 1 === 0) {
      const { itemWrap } = getCartItemDOM(id);
      this._dom.removeChild(itemWrap);
    }

    // cart item 최신화
    decreaseItemInCart(id);

    // productList 재고 최신화
    updateStock(id, 1);
  }

  /**
   * 장바구니 내부 아이템 수량 + 1
   * @param {string} productId
   */
  increaseItem(productId: string) {
    const { id, quantity } = findProductById(productId);

    // 재고가 없으면 return
    if (!quantity) {
      alert('재고가 부족합니다.');
      return;
    }

    const itemInCart = this.itemList.find(
      (item) => item.elementId === productId
    );
    if (!itemInCart) return;

    // cart item 최신화
    increaseItemInCart(id);

    // productList 재고 최신화
    updateStock(id, -1);
  }

  /**
   * 장바구니 내부 아이템 제거
   * @param {stirng} productId
   */
  removeItem(productId: string) {
    const itemData = findCartItemById(productId);
    const { id } = itemData;
    const { itemWrap, currentQty } = getCartItemDOM(id);

    // cart item 최신화
    removeItemToCart(id);

    // productList 재고 최신화
    updateStock(id, currentQty);

    // DOM 제거
    this._dom.removeChild(itemWrap);
  }

  // 장바구니 내부 아이템 수량 업데이트
  changeItemDOMLabel = (
    id: string,
    name: string,
    price: number,
    up: boolean
  ) => {
    const { label, currentQty, itemWrap } = getCartItemDOM(id);
    const changeQty = up ? currentQty + 1 : currentQty - 1;

    if (changeQty <= 0) {
      // 장바구니 아이템 수량 0이면 DOM 제거
      this._dom.removeChild(itemWrap);
    } else {
      // 장바구니 아이템 수량 업데이트
      label.textContent = `${name} - ${price}원 x ${changeQty}`;
    }
  };
}
