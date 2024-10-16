export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  cartQuantity: number;
}
