export const FLASH_SALE_INTERVAL = 30000
export const SUGGESTION_INTERVAL = 60000
export const FLASH_SALE_CHANCE = 0.3
export const POINT_RATE = 1000
export const MIN_STOCK = 5
export const DISCOUNT_RATE = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 }
export const MIN_FOR_DISCOUNT = 10
export const BULK_LIMIT = 30
export const TUESDAY = 2
export const FLASH_SALE_DISCOUNT = 20
export const RECOMMENDED_SALE_DISCOUNT = 5
export const BULK_DISCOUNT = 25
export const TUESDAY_DISCOUNT = 10
export const MESSAGE = {
  STOCK_STATUS: {
    EMPTY: '품절',
    INSUFFICIENT: '재고가 부족합니다.',
    LOW: (quantity: number) => `재고 부족 (${quantity}개 남음)`,
  },
  PROMOTION: {
    FLASH_SALE: (name: string) => `번개세일! ${name}이(가) 20% 할인 중입니다!`,
    SUGGESTION: (name: string) => `${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`,
  },
  DISCOUNT: (rate: string) => `(${rate}% 할인 적용)`,
}
