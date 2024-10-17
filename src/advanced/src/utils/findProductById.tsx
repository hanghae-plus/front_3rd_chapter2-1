export const findProductById = (productId: string) => {
  return prodList.find((product) => product.id === productId);
};