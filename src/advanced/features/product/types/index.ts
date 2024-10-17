// Models

export interface IProduct {
  id: string;
  name: string;
  val: number;
  q: number;
}

// API

export type TGetProducts = () => Promise<IProduct[]>;
