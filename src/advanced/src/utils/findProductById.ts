import { prodList } from '../constant/productList';

/**
 * @function findProductById
 * @description 제품 목록에서 주어진 ID에 해당하는 제품을 찾아 반환
 * 
 * @param {string} productId - 찾고자 하는 제품의 ID
 * @returns {object|undefined} 해당 ID를 가진 제품 객체를 반환
 */

export const findProductById = (productId: string) => {
  return prodList.find((product) => product.id === productId);
};
