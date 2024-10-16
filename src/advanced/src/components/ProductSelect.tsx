import { useProductSelect } from '../hooks';
import { useProductStore } from '../stores';

const ProductSelect = () => {
  const products = useProductStore((state) => state.products);
  const { selectedProduct, handleSelectProduct, handleAddToCart } = useProductSelect();

  return (
    <>
      <select
        onChange={handleSelectProduct}
        value={selectedProduct}
        id="product-select"
        className="border rounded p-2 mr-2"
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>

      <button onClick={handleAddToCart} id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </>
  );
};

export default ProductSelect;
