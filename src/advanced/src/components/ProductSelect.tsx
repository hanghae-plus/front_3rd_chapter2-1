import useCart from '../hooks/useCart';
import { Product } from '../types';

const ProductSelect = () => {
  const { addToCart, productList } = useCart();

  return (
    <select id="product-select" className="border rounded p-2 mr-2" onChange={(e) => addToCart(e.target.value)}>
      {productList.map((product: Product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
