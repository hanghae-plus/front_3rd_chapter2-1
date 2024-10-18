import useCart from '../hooks/useCart';
import { Product } from '../types';

const ProductSelect = () => {
  const { addToCart: handleAddToCart, productList } = useCart();

  return (
    <>
      <select id="product-select" className="border rounded p-2 mr-2">
        {productList.map((product: Product) => (
          <option key={product.id} value={product.id} disabled={product.quantity === 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAddToCart('p1')}>
        추가
      </button>
    </>
  );
};

export default ProductSelect;
