export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem extends Product {
  cartQuantity: number;
}
