import { createElementWithProps } from '../utils/createElement';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductSelectProps {
  productList: Product[];
  productSelect: HTMLSelectElement;
}

export function updateProductSelect(productList: Product[], productSelect: HTMLSelectElement): void {

  if(!productSelect) return;
  productSelect.innerHTML = ''; // 기존 옵션 삭제

  productList.forEach((product) => {
      const option = createElementWithProps('option', {
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
        disabled: product.stock === 0,
      });
      productSelect.appendChild(option);
    });

}
