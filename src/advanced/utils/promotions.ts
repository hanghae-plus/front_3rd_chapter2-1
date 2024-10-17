import { Product } from '../types';

export function applyRandomFlashSale(products: Product[]): Product[] {
  const availableProducts = products.filter((p) => p.quantity > 0);
  if (availableProducts.length > 0 && Math.random() < 0.3) {
    const luckyProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    luckyProduct.price = Math.round(luckyProduct.price * 0.8);
    alert(`번개세일! ${luckyProduct.name}이(가) 20% 할인 중입니다!`);
  }
  return [...products];
}

export function suggestProduct(products: Product[], lastSelectedProduct: string | null): Product[] {
  if (lastSelectedProduct) {
    const suggestedProduct = products.find((p) => p.id !== lastSelectedProduct && p.quantity > 0);
    if (suggestedProduct) {
      alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      suggestedProduct.price = Math.round(suggestedProduct.price * 0.95);
    }
  }
  return [...products];
}
