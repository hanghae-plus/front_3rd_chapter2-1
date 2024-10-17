import { createElement } from '../utils/domHelpers';

export class UIManager {
    constructor(rootElement, productManager, cartManager) {
      this.root = rootElement;
      this.productManager = productManager;
      this.cartManager = cartManager;
      this.elements = {};
    }
  
    initialize() {
      this.createElements();
      this.renderProductSelect();
      this.attachEventListeners();
      this.updateCartDisplay();
    }
  
    createElements() {
      const container = createElement('div', 'bg-gray-100 p-8');
      const wrapper = createElement('div', 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8');
      
      this.elements = {
        title: createElement('h1', 'text-2xl font-bold mb-4', '장바구니'),
        cartItems: createElement('div', '', '', 'cart-items'),
        cartTotal: createElement('div', 'text-xl font-bold my-4', '', 'cart-total'),
        productSelect: createElement('select', 'border rounded p-2 mr-2', '', 'product-select'),
        addButton: createElement('button', 'bg-blue-500 text-white px-4 py-2 rounded', '추가', 'add-to-cart'),
        stockInfo: createElement('div', 'text-sm text-gray-500 mt-2', '', 'stock-status')
      };
  
      wrapper.append(
        this.elements.title,
        this.elements.cartItems,
        this.elements.cartTotal,
        this.elements.productSelect,
        this.elements.addButton,
        this.elements.stockInfo
      );
      container.appendChild(wrapper);
      this.root.appendChild(container);
    }
  
    renderProductSelect() {
      this.elements.productSelect.innerHTML = '';
      this.productManager.products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = `${product.name} - ${product.price}원`;
        option.disabled = product.quantity === 0;
        this.elements.productSelect.appendChild(option);
      });
    }
  
    attachEventListeners() {
      this.elements.addButton.addEventListener('click', () => this.handleAddToCart());
      this.elements.cartItems.addEventListener('click', (event) => this.handleCartAction(event));
    }
  
    handleAddToCart() {
      const productId = this.elements.productSelect.value;
      if (this.cartManager.addItem(productId)) {
        this.updateCartDisplay();
        this.renderProductSelect();
      } else {
        alert('재고가 부족합니다.');
      }
    }
  
    handleCartAction(event) {
      const target = event.target;
      if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
        const productId = target.dataset.productId;
        if (target.classList.contains('quantity-change')) {
          const change = parseInt(target.dataset.change);
          this.cartManager.updateItemQuantity(productId, change);
        } else if (target.classList.contains('remove-item')) {
          this.cartManager.removeItem(productId);
        }
        this.updateCartDisplay();
        this.renderProductSelect();
      }
    }
  
    updateCartDisplay() {
      this.elements.cartItems.innerHTML = '';
      for (const [id, item] of this.cartManager.items) {
        const itemElement = createElement('div', 'flex justify-between items-center mb-2');
        itemElement.innerHTML = `
          <span>${item.name} - ${item.price}원 x ${item.quantity}</span>
          <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${id}" data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${id}">삭제</button>
          </div>
        `;
        this.elements.cartItems.appendChild(itemElement);
      }
  
      const { 
        finalTotal, 
        totalDiscountRate, 
        tuesdayDiscountRate, 
        bonusPoints, 
        itemDiscounts, 
        isThursday 
      } = this.cartManager.calculateTotal();      
      this.elements.cartTotal.textContent = `총액: ${finalTotal}원`;
    
      if (totalDiscountRate > 0) {
        const discountSpan = createElement('span', 'text-green-500 ml-2', 
          `(${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)`);
        discountSpan.id = 'discount-rate';
        this.elements.cartTotal.appendChild(discountSpan);
      }
    
      if (isThursday) {
        const tuesdayDiscountSpan = createElement('span', 'text-blue-500 ml-2', 
          `(화요일 특별 할인 포함)`);
        tuesdayDiscountSpan.id = 'tuesday-discount-info';
        this.elements.cartTotal.appendChild(tuesdayDiscountSpan);
      }
    
      const pointsSpan = createElement('span', 'text-blue-500 ml-2', `(포인트: ${bonusPoints})`);
      pointsSpan.id = 'loyalty-points';
      this.elements.cartTotal.appendChild(pointsSpan);
  
      this.updateStockInfo();
    }
  
    updateStockInfo() {
      const lowStockItems = this.productManager.products.filter(item => item.quantity < 5);
      this.elements.stockInfo.textContent = lowStockItems.map(item => 
        `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}`
      ).join('\n');
    }
  
    showLightningSale(product) {
      alert(`번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
      this.renderProductSelect();
    }
  
    showSuggestion(product) {
      alert(`${product.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      product.price = Math.round(product.price * 0.95);
      this.renderProductSelect();
    }
  }