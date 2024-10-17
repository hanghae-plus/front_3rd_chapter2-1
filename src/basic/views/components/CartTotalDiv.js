import { createDiv } from '../../createElements';

export const createCartTotalDiv = () => {
  return createDiv({ id: 'cart-total', className: 'text-xl font-bold my-4' });
};
