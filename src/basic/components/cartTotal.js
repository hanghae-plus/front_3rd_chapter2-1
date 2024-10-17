import { createElementWithProps } from '../utils/createElement.js';
import { renderPointSystem } from '../utils/calculatePoint.js'

// 장바구니 총액과 할인 표시, 표인트 적립

export function calculateCart(cartList, productList, cartTotal) {
    let totalPrice = 0;
    let totalItem = 0;
    let subTotal = 0;
    let totalDiscRate = 0;
    
    
    const cartItems = cartList.children;
    
    for (let i = 0; i < cartItems.length; i++) {
      const cartItem = cartItems[i];
      const curentItem = productList.find(item => item.id === cartItem.id);
      const stockNum = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
      const itemTotal = curentItem.price * stockNum;
      let disc = 0;
  
      totalItem += stockNum;
      subTotal += itemTotal;
      if (stockNum >= 10) {
        disc = getDiscount(curentItem.id);
      }
      totalPrice += itemTotal * (1 - disc);
    }
  
    // 할인율 계산
    totalDiscRate = calculateDiscountRate(totalItem, subTotal, totalPrice);

    // 화요일 10% 추가 할인 적용
    if (new Date().getDay() === 2) {
      totalPrice *= (1 - 0.1);
      totalDiscRate = Math.max(totalDiscRate, 0.1);  // 기존 할인율과 화요일 할인율 중 더 큰 값을 선택
    }
    
    // 총 금액 및 할인 표시
    cartTotal.textContent = `총액: ${Math.round(totalPrice)}원`;
    
    if (totalDiscRate > 0) {
      const discountText = createElementWithProps('span', {
        className: 'text-green-500 ml-2',
        textContent: `(${(totalDiscRate * 100).toFixed(1)}% 할인 적용)`
      });
      cartTotal.appendChild(discountText);
    }

    // 포인트 계산
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
  function calculateDiscountRate(totalItem, subTotal, totalPrice) {
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
