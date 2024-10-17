import { Product } from '../types';

export default function ProductSelect({
  productList,
  selectRef,
}: {
  productList: Product[];
  selectRef: React.RefObject<HTMLSelectElement>;
}) {
  return (
    <select
      ref={selectRef}
      id="product-select"
      className="border rounded p-2 mr-2"
    >
      {productList.map((product) => (
        <option
          key={product.id}
          value={product.id}
          disabled={product.quantity === 0}
        >
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
}
