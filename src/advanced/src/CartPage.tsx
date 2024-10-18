import React, { useState } from 'react';
import { Layout, ProductSelect, AddToCartButton } from './component/atoms';
import { CartItems, CartTotal, StockStatus } from './component/organisms';
import { useCartHandlers } from './services/useCartHandlers';

/**
 * @function CartPage
 * @description 장바구니 페이지 전체 컴포넌트로
 * 상품 전반적인 계산 로직은 useCartHandlers 훅으로 계산
 *
 * @returns {JSX.Element} 장바구니 페이지 UI 레이아웃 반환
 */
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('p1');

  const { handleAddCartItem, handleQuantityUpdate, handleRemoveCartItem } = useCartHandlers(
    cartItems,
    setCartItems,
  );

  // 상품 선택 드롭다운의 변경을 처리
  const handleSelectChange = (event) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>
      <CartItems
        cartItems={cartItems}
        handleQuantityUpdate={handleQuantityUpdate}
        handleRemoveCartItem={handleRemoveCartItem}
      />
      <CartTotal cartItems={cartItems} />
      <ProductSelect handleSelectChange={handleSelectChange} />
      <AddToCartButton handleAddCartItem={() => handleAddCartItem(selectedProductId)} />
      <StockStatus cartItems={cartItems} />
    </Layout>
  );
};

export default CartPage;
