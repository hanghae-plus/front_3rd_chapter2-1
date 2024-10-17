export interface ProductList {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartSummaryProps {
  finalTotalPrice: number;
  itemCount: number;
  preDiscountTotalPrice: number;
}
