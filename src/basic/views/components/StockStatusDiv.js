import { createDiv } from '../createElements';

export const createStockStatusDiv = () => {
  return createDiv({ id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });
};