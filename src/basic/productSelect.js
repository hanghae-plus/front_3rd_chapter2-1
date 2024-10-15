// 상품 선택 드롭다운 
import { createElementWithProps } from './createElement.js';

export function updateSelOpts(productList, productSelect) {
  productSelect.innerHTML = '';
  productList.forEach((item) => {
    const option = createElementWithProps('option', {
      value: item.id,
      textContent: `${item.name} - ${item.price}원`,
      disabled: item.stock === 0
    });
    productSelect.appendChild(option);
  });
}