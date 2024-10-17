import { useProductContext } from '../utils/hooks';

export default function ProductSelect({
  selectRef,
}: {
  selectRef: React.RefObject<HTMLSelectElement>;
}) {
  const { productList } = useProductContext();

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
