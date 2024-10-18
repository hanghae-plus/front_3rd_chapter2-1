export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  [key: string]: number;
}
