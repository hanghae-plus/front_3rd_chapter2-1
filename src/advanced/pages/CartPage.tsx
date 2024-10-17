import React from 'react';
import CartList from '../components/CartList';
import CartSaleEvent from '../components/CartSaleEvent';
import CartSelectForm from '../components/CartSelectForm';
import useCartStore from '../store/userCartStore';

// 장바구니 페이지 전체 레이아웃 컴포넌트
const CartPage: React.FC = () => {
  const products = useCartStore((state) => state.products);
  const soldOutProduct = products.filter((product) => product.quantity === 0); // quantity로 변경

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartSaleEvent />
        <CartList />
        <CartSelectForm products={products} />
        <CartStockInfo soldOutProduct={soldOutProduct} />
      </div>
    </div>
  );
};

interface CartStockInfoProps {
  soldOutProduct: { id: string; name: string }[];
}

const CartStockInfo: React.FC<CartStockInfoProps> = ({ soldOutProduct }) => {
  if (soldOutProduct.length === 0) {
    return null;
  }
  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      <ul>
        {soldOutProduct.map((product) => (
          <li key={product.id}>{product.name}: 품절</li>
        ))}
      </ul>
    </div>
  );
};

export default CartPage;
