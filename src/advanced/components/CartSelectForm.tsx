import React, { useState } from 'react';
import useCartStore, { Product } from '../store/userCartStore';

interface CartSelectFormProps {
  products: Product[];
}

// 상품 리스트를 보여주고 선택한 상품 장바구니 추가 컴포넌트
const CartSelectForm: React.FC<CartSelectFormProps> = ({ products }) => {
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const addCartItem = useCartStore((state) => state.addCartItem);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  const handleCartItem = () => {
    if (!selectedProductId) return;
    const selectedProduct = products.find((product) => product.id === selectedProductId);
    if (!selectedProduct || selectedProduct.quantity <= 0) return;
    addCartItem(selectedProductId);
  };

  return (
    <div>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        value={selectedProductId}
        onChange={handleSelectChange}>
        <option value="">상품 선택</option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity <= 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCartItem}>
        추가
      </button>
    </div>
  );
};

export default CartSelectForm;
