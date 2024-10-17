import { createSelect } from '../createElements';

export const createProductSelect = () => {
  return createSelect({
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
};