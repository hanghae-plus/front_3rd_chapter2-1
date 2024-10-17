export interface Product {
  id: string;
  name: string;
  value: number;
  quantity: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}
