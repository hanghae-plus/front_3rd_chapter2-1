import { prodList } from '../constant';

export const getProductById = (productId) => {
  return prodList.find((p) => p.id === productId);
};
