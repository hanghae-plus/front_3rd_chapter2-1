// 대량 할인
export const MINIMUM_BULK_DISCOUNT_QTY = 30; // 대량 할인 최소 수량
export const BULK_DISCOUNT_RATE = 0.25; // 25% 할인

// 요일 할인
export const DAY_DISCOUNT_RATE = 0.1; // 10% 할인

// 번개 세일
export const LIGHTNING_INTERVAL_KEY = 'lightning-interval';
export const LIGHTNING_DISCOUNT_RATE = 0.2; // 20% 할인
export const LIGHTNING_SALE_PROBABILITY = 0.3; // 30% 확률
export const LIGHTNING_SALE_INTERVAL = 30000; // 인터벌 => 30초
export const LIGHTNING_SALE_DELAY = Math.random() * 10000; //0 ~ 10초 랜덤 지연

// 추천 할인
export const SUGGESTION_INTERVAL_KEY = 'suggestion-interval';
export const SUGGESTION_DISCOUNT_RATE = 0.05; // 5% 추가 할인
export const SUGGESTION_DISCOUNT_INTERVAL = 60000; // 인터벌 => 60초
export const SUGGESTION_DISCOUNT_DELAY = Math.random() * 20000; // 0 ~ 20초 랜덤 지연
