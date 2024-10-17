import { createElementWithProps } from '../utils/createElement';
import { renderPoint } from '../utils/renderPoint';
import {
  SPECIAL_DISCOUNT_DAY,
  SPECIAL_DISCOUNT_RATE,
  BULK_DISCOUNT_AMOUNT,
  BULK_DISCOUNT_RATE,
} from '../data/storeData';

// 장바구니 총액과 할인 표시, 포인트 적립

interface CartItem {
  id: string;
  quantity: number;
}

interface Product {
  id: string;
  price: number;
}

export function calculateCart(cartList: HTMLElement, productList: Product[], cartTotal: HTMLElement): void {
  let totalPrice = 0;
  let totalItem = 0;
  let subTotal = 0;
  let totalDiscRate = 0;
  const cartItems = Array.from(cartList.children) as HTMLElement[];

  cartItems.forEach((cartItem) => {
    const currentItem = productList.find((item) => item.id === cartItem.id);
    if (currentItem) {
      const quantity = getCartItemQuantity(cartItem);
      const itemTotal = currentItem.price * quantity;
      const discount =
        quantity >= BULK_DISCOUNT_AMOUNT ? getDiscount(currentItem.id) : 0;

      totalItem += quantity;
      subTotal += itemTotal;
      totalPrice += itemTotal * (1 - discount);
    }
  });

  // 할인율 계산
  totalDiscRate = calculateDiscountRate(totalItem, subTotal, totalPrice);

  // 화요일 10% 추가 할인 적용
  if (new Date().getDay() === SPECIAL_DISCOUNT_DAY) {
    totalPrice *= 1 - SPECIAL_DISCOUNT_RATE;
    totalDiscRate = Math.max(totalDiscRate, SPECIAL_DISCOUNT_RATE); // 기존 할인율과 화요일 할인율 중 더 큰 값을 선택
  }

  updateCartTotal(cartTotal, totalPrice, totalDiscRate);
  renderPoint(totalPrice, cartTotal);
}

function getCartItemQuantity(cartItem: HTMLElement): number {
  return parseInt(cartItem.querySelector('span')!.textContent!.split('x ')[1]); // !를 사용하여 null이 아님을 보장
}

function getDiscount(productId: string): number {
  return BULK_DISCOUNT_RATE[productId] || 0;
}

function calculateDiscountRate(totalItem: number, subTotal: number, totalPrice: number): number {
  let discRate = 0;
  if (totalItem >= 30) {
    const bulkDisc = totalPrice * 0.25;
    const itemDisc = subTotal - totalPrice;
    if (bulkDisc > itemDisc) {
      discRate = 0.25;
    } else {
      discRate = (subTotal - totalPrice) / subTotal;
    }
  } else {
    discRate = (subTotal - totalPrice) / subTotal;
  }
  return discRate;
}

function updateCartTotal(cartTotal: HTMLElement, totalPrice: number, totalDiscRate: number): void {
  cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;

  if (totalDiscRate > 0) {
    const discountText = createElementWithProps('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(totalDiscRate * 100).toFixed(1)}% 할인 적용)`,
    });
    cartTotal.appendChild(discountText);
  }
}
