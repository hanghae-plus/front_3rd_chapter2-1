import { DISCOUNT_RATES, BULK_DISCOUNT_THRESHOLD, BULK_DISCOUNT_RATE, TUESDAY_DISCOUNT_RATE } from '../constants';

export class CartManager {
    constructor(productManager){
        this.productManager = productManager;
        this.items = new Map();
        this.bonusPoints = 0;
    }

    addItem(productId) {
        const product = this.productManager.getProduct(productId);
        if(product && product.quantity > 0){
            const currentQuantity = this.items.get(productId)?.quantity || 0;
            this.items.set(productId,{
                ...product,
                quantity: currentQuantity + 1
            });
            this.productManager.updateProductQuantity(productId,-1);
            return true;
        }
        return false;
    }

    removeItem(productId){
        const item = this.items.get(productId);
        if(item){
            this.productManager.updateProductQuantity(productId,item.quantity);
            this.items.delete(productId);
        }
    }
    
    updateItemQuantity(productId, change) {
        const item = this.items.get(productId);
        if (item) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0) {
            this.items.set(productId, { ...item, quantity: newQuantity });
            this.productManager.updateProductQuantity(productId, -change);
          } else {
            this.removeItem(productId);
          }
        }
      }


      calculateTotal() {
        let subTotal = 0;
        let itemCount = 0;
        let maxRegularDiscount = 0;
        let itemDiscounts = new Map();
      
        // 개별 상품 할인 계산
        for (const [id, item] of this.items) {
          const itemTotal = item.price * item.quantity;
          subTotal += itemTotal;
          itemCount += item.quantity;
      
          if (item.quantity >= 10) {
            const discount = itemTotal * DISCOUNT_RATES[id];
            itemDiscounts.set(id, discount);
            maxRegularDiscount = Math.max(maxRegularDiscount, discount);
          }
        }
      
        // 대량 구매 할인 계산
        const bulkDiscount = itemCount >= BULK_DISCOUNT_THRESHOLD ? subTotal * BULK_DISCOUNT_RATE : 0;
        
        // 정규 할인 중 가장 큰 값 선택
        const regularDiscount = Math.max(maxRegularDiscount, bulkDiscount);
      
        // 정규 할인 적용 후 금액 계산
        const regularDiscountedTotal = subTotal - regularDiscount;
      
        // 화요일 할인 계산
        const isThursday = new Date().getDay() === 2;
        const tuesdayDiscount = isThursday ? regularDiscountedTotal * TUESDAY_DISCOUNT_RATE : 0;
      
        // 최종 할인 계산
        const finalTotal = regularDiscountedTotal - tuesdayDiscount;
      
        this.bonusPoints += Math.floor(finalTotal / 1000);
      
        // 전체 할인율 계산
        const totalDiscountRate = (subTotal - finalTotal) / subTotal;
      
        return {
          subTotal,
          regularDiscount,
          tuesdayDiscount,
          finalTotal: Math.round(finalTotal),
          itemCount,
          regularDiscountRate: regularDiscount / subTotal,
          tuesdayDiscountRate: isThursday ? TUESDAY_DISCOUNT_RATE : 0,
          totalDiscountRate,
          bonusPoints: this.bonusPoints,
          itemDiscounts,
          isThursday,
        };
      }
    }