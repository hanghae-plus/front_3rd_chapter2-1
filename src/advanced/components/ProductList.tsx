// components/AddToCart.tsx
import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Product } from '../types/Cart';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = () => {
  const { products, addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<string>('');

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      const firstAvailableProduct = products.find((p) => p.stock > 0);
      if (firstAvailableProduct) {
        setSelectedProduct(firstAvailableProduct.id);
      }
    }
  }, [products, selectedProduct]);

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === selectedProduct);
    console.log(product);

    if (product) {
      if (product.stock > 0) {
        addToCart(product);
      } else {
        alert('재고가 부족합니다.');
      }
    }
  };

  return (
    <div>
      <select
        id='product-select'
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className='border rounded p-2 mr-2'
      >
        {products.map((product) => (
          <option
            key={product.id}
            value={product.id}
            disabled={product.stock === 0}
          >
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        id='add-to-cart'
        className='bg-blue-500 text-white px-4 py-2 rounded'
        onClick={handleAddToCart}
      >
        추가
      </button>
    </div>
  );
};

export default ProductList;
