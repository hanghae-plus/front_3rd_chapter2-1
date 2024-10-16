export interface IProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ICartItem extends IProduct {
  cartQuantity: number;
}
