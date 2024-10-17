interface Product {
  id: string;
  price: number;
  count: number;
}

// 할인율과 상품 매핑
const discountRates: { [key: string]: number } = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

// 장바구니에 담긴 상품 목록을 받아 총액과 할인율을 계산하는 함수
export const calculateTotalAmount = (cartItems: Product[]): { totalAmount: number; discountRate: number } => {
  let totalAmount = 0;
  let originalPrice = 0;
  let totalCount = 0;

  cartItems.forEach((item) => {
    const quantity = item.count;
    const totalPrice = item.price * quantity;
    const discount = quantity >= 10 ? discountRates[item.id] || 0 : 0;

    totalCount += quantity;
    originalPrice += totalPrice;
    totalAmount += totalPrice * (1 - discount);
  });

  let discountRate = 0;

  // 대량 구매 할인
  if (totalCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = originalPrice - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = originalPrice * 0.75;
      discountRate = 0.25;
    } else {
      discountRate = (originalPrice - totalAmount) / originalPrice;
    }
  } else {
    discountRate = (originalPrice - totalAmount) / originalPrice;
  }

  // 화요일 추가 할인
  if (new Date().getDay() === 2) {
    totalAmount *= 0.9;
    discountRate = Math.max(discountRate, 0.1);
  }

  return { totalAmount, discountRate };
};

export const calculatePoints = (totalAmount: number): number => {
  return Math.floor(totalAmount / 1000);
};
