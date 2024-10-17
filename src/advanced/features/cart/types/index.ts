import { IProduct } from '../../product/types';

export interface ICart extends Pick<IProduct, 'id' | 'name'> {
  price: number;
  quantity: number;
}
