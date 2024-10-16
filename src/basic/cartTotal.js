import { createElementWithProps } from './createElement.js';
import { renderPointSystem } from './pointSystem.js'
// import { updateStockStatus } from './stockStatus.js';

// 장바구니 총액과 할인 표시, 표인트 적립

export function calcCart(cartList, productList, cartTotal) {
    let totalPrice = 0;
    let totalItem = 0;
    let subTot = 0;
    let discRate = 0;
    
    const cartItems = cartList.children;
    
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const curItem = productList.find(item => item.id === cartItem.id);
      const q = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      const itemTot = curItem.price * q;
      let disc = 0;
  
      totalItem += q;
      subTot += itemTot;
      if (q >= 10) {
        disc = getDiscount(curItem.id);
      }
      totalPrice += itemTot * (1 - disc);
    }
  
    // 할인율 계산
    discRate = calculateDiscountRate(totalItem, subTot, totalPrice);

    // 화요일 10% 추가 할인 적용
    if (new Date().getDay() === 2) {
      totalPrice *= (1 - 0.1);
      discRate = Math.max(discRate, 0.1);  // 기존 할인율과 화요일 할인율 중 더 큰 값을 선택
    }
    
    // 총 금액 및 할인 표시
    cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;
    
    if (discRate > 0) {
      const discountText = createElementWithProps('span', {
        className: 'text-green-500 ml-2',
        textContent: `(${(discRate * 100).toFixed(1)}% 할인 적용)`
      });
      cartTotal.appendChild(discountText);
    }

    // 포인트 적립 시스템 호출
    renderPointSystem(totalPrice, cartTotal);
  }
    

  
  function getDiscount(productId) {
    switch (productId) {
      case 'p1': return 0.1;
      case 'p2': return 0.15;
      case 'p3': return 0.2;
      case 'p4': return 0.05;
      case 'p5': return 0.25;
      default: return 0;
    }
  }
  
  // 할인율
  function calculateDiscountRate(totalItem, subTot, totalPrice) {
    let discRate = 0;
    if (totalItem >= 30) {
      const bulkDisc = totalPrice * 0.25;
      const itemDisc = subTot - totalPrice;
      if (bulkDisc > itemDisc) {
        discRate = 0.25;
      } else {
        discRate = (subTot - totalPrice) / subTot;
      }
    } else {
      discRate = (subTot - totalPrice) / subTot;
    }
    return discRate;
  }
