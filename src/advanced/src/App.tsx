import React from 'react';
import Layout from './_components/Layout';
import { Cart } from './_components/Cart';
import Prodcut from './_components/Prodcut';
import { ProductId, useCartStore } from './store/useCart';
import { useSetInterval } from './hook';

export default function App() {
	const [cartState, cartDispatch] = useCartStore();

	const { products } = cartState;

	// cart에 상품 추가
	const addCartItem = (productId: ProductId) => {
		cartDispatch({ type: 'ADD_CART_ITEM', productId });
	};

	// cart에서 상품 제거
	const removeCartItem = (productId: ProductId) => {
		cartDispatch({ type: 'REMOVE_CART_ITEM', productId });
	};

	// cart에 상품 수량 변경
	const changeCartItemQuantity = (productId: ProductId, quantity: number) => {
		cartDispatch({ type: 'CHANGE_CART_ITEM_QUANTITY', payload: { productId, quantity } });
	};

	// cart에 담긴 상품만 필터링
	const cartItems = products.filter(({ currentCartItemQuantity }) => currentCartItemQuantity > 0);

	// 랜덤 럭키 이벤트!
	useSetInterval(() => {
		cartDispatch({ type: 'LUCKY_PRODUCT_ITEM' });
	}, Math.random() * 20000);

	// 랜덤 추천 이벤트
	useSetInterval(() => {
		cartDispatch({ type: 'SUGGEST_PRODUCT_ITEM' });
	}, Math.random() * 10000);

	return (
		<Layout>
			<div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
				<h1 className="text-2xl font-bold mb-4">장바구니</h1>
				<Cart cartItems={cartItems} removeCartItem={removeCartItem} changeCartItemQuantity={changeCartItemQuantity} />
				<Prodcut products={products} addCartItem={addCartItem} />
			</div>
		</Layout>
	);
}
