import { createElementWithProps } from '../utils/createElement.js';

export function updateProductSelect(productList, productSelect) {

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