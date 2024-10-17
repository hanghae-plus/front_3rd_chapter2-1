export type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discountRate: number;
};

export type CartProduct = {
  id: string;
  quantity: number;
  name: string;
  price: number;
};
