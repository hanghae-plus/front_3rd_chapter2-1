// 상품 선택 드롭다운 
import { createElementWithProps } from './createElement.js';

export function updateSelOpts(productList, productSelect) {

  productSelect.innerHTML = '';

  productList.forEach((product) => {
    const option = createElementWithProps('option', {
      value: product.id,
      textContent: `${product.name} - ${product.price}원`,
      disabled: product.stock === 0
    });
    productSelect.appendChild(option);
  });

}