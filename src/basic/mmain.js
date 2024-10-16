import { updateSelOpts } from './productSelect.js';
import { calcCart } from './cartTotal.js';
import { createCartItem, updateCartItem } from './cartItem.js';
import { updateStockStatus } from './stockStatus.js'


export function main(productList, cartList, productSelect, cartTotal, stockStatus) {

    updateSelOpts(productList, productSelect);
    calcCart(cartList, productList, cartTotal);
  
    // 상품 추가 이벤트
    document.getElementById('add-to-cart').addEventListener('click', function () {
      const selectedItem = productList.find(product => product.id === productSelect.value);
      if (!selectedItem || selectedItem.stock <= 0) return;
  
      const cartItem = document.getElementById(selectedItem.id);
      if (cartItem) {
        updateCartItem(cartItem, selectedItem, 1);
      } else {
        cartList.appendChild(createCartItem(selectedItem));
        selectedItem.stock--;
      }
      
      calcCart(cartList, productList, cartTotal);

      // 품절 표시
      updateStockStatus(productList, stockStatus);
      
    });

    // 수량변경 및 삭제
    cartList.addEventListener('click', function (event) {
      const target = event.target;
  
      if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        const product = productList.find(item => item.id === productId);
        const cartItemElement = document.getElementById(productId);
  
        if (target.classList.contains('quantity-change')) {
          const countChange = parseInt(target.dataset.change); // +1인지 -1인지 값 받아오기
          updateCartItem(cartItemElement, product, countChange);
        } else if (target.classList.contains('remove-item')) {
          product.stock += parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]);
          cartItemElement.remove();
        }
        
        calcCart(cartList, productList, cartTotal);  // 장바구니 총액 재계산

        // 품절 표시
        updateStockStatus(productList, stockStatus);

      }
    });
    


    // 20%할인 안내
    setTimeout(function () {
      setInterval(function () {
        let luckyItem = productList[Math.floor(Math.random() * productList.length)];
        if(Math.random() < 0.3 && luckyItem.stock > 0) {
          luckyItem.price = Math.round(luckyItem.price * 0.8);
          alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          updateSelOpts();
        }
      }, 30000);
    }, Math.random() * 10000);

     // 5%추가할인
    setTimeout(function () {
      setInterval(function () {
        const lastProduct = getLastPurchasedProduct();  // 마지막으로 구매한 상품을 추적하는 함수
        if (lastProduct) {
          const suggest = productList.find(item => item.id !== lastProduct.id && item.stock > 0);
          if (suggest) {
            alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
            suggest.price = Math.round(suggest.price * 0.95);
            updateSelOpts(productList);  // 상품 목록 업데이트
          }
        }
      }, 60000);
    }, Math.random() * 20000);

  }

  function getLastPurchasedProduct() {
    // 구매 기록에서 마지막 상품을 가져오는 로직 구현
    // 현재는 더미로 null 반환
    return null;
  }