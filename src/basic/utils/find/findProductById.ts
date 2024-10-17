import { productStore } from '@basic/store/product';

export const findProductById = (id: string) => {
  const { productList } = productStore.getState();
  return productList.find((item: ProductType) => item.id === id);
};
