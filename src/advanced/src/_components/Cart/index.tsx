// cart를 보여주는 컴포넌트

import React from 'react';
import TotalCartPrice from './TotalCartPrice';
import type { Product, ProductId } from '../../store/useCart';
import { soldOutProduct } from '../../utils';

type Props = {
	cartItems: Product[];
	removeCartItem: (productId: ProductId) => void;
	changeCartItemQuantity: (productId: ProductId, quantity: number) => void;
};

export function Cart({ cartItems, removeCartItem, changeCartItemQuantity }: Props) {
	const handleRemoveCartItemButton = (productId: ProductId) => () => {
		removeCartItem(productId);
	};

	//
	/**
	 * 장바구니 수량 변경 버튼 클릭 핸들러
	 * @param {ProductId} productId - 변경 될 상품 ID
	 * @param {number} change - 변경 될 수량
	 */
	const handleChangeCartItemQuantityButton = (productId: ProductId, change: number) => () => {
		if (change === 1) {
			const { currentCartItemQuantity = 0, quantity = 0 } = cartItems.find(({ id }) => id === productId) || {};
			if (currentCartItemQuantity - quantity >= 0) {
				return soldOutProduct();
			}
		}

		changeCartItemQuantity(productId, change);
	};

	return (
		<div>
			<div id="cart-items">
				{cartItems.map(({ price, currentCartItemQuantity, id, name }) => (
					<div key={id} id={id} className="flex justify-between items-center mb-2">
						<span>
							{name} - {price.toLocaleString()}원 x {currentCartItemQuantity}
						</span>
						<div>
							<button
								className="quantity-change bg-blue-500 text-white mr-1 px-2 py-1 rounded"
								data-product-id={id}
								data-change={1}
								onClick={handleChangeCartItemQuantityButton(id, 1)}
							>
								+
							</button>
							<button
								className="quantity-change bg-blue-500 text-white mr-1 px-2 py-1 rounded"
								data-product-id={id}
								data-change={-1}
								onClick={handleChangeCartItemQuantityButton(id, -1)}
							>
								-
							</button>
							<button
								className="remove-item bg-red-500 text-white px-2 py-1 rounded"
								data-product-id={id}
								onClick={handleRemoveCartItemButton(id)}
							>
								삭제
							</button>
						</div>
					</div>
				))}
			</div>
			<TotalCartPrice cartItems={cartItems} />
		</div>
	);
}
