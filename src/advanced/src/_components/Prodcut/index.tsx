// product 관리하는 컴포넌트

import React from 'react';
import type { Product, ProductId } from '../../store/useCart';
import { soldOutProduct } from '../../utils';

type Props = {
	products: Product[];
	addCartItem: (productId: ProductId) => void;
};

export default function Prodcut({ products, addCartItem }: Props) {
	const selectRef = React.useRef<HTMLSelectElement>(null);

	// 상품 추가 버튼 클릭 핸들러
	const handleAddButton = () => {
		if (!selectRef.current) return;

		const productId = selectRef.current.value as ProductId;
		const { currentCartItemQuantity = 0, quantity = 0 } = products.find(({ id }) => id === productId) || {};
		if (currentCartItemQuantity - quantity >= 0) {
			return soldOutProduct();
		}

		addCartItem(productId);
	};

	// 5개 이하의 재고 상품 필터링
	const filteredRemain5Products = products.filter(
		({ quantity, currentCartItemQuantity }) => quantity - currentCartItemQuantity <= 5,
	);

	return (
		<div>
			<select ref={selectRef} id="product-select" className="border rounded p-2 mr-2">
				{products.map(({ quantity, price, id, name }) => (
					<option key={id} value={id} disabled={quantity === 0}>
						{name} - {price.toLocaleString()}원
					</option>
				))}
			</select>
			<button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddButton}>
				추가
			</button>
			<div id="stock-status" className="text-sm text-gray-500 mt-2">
				{filteredRemain5Products.map(({ quantity, currentCartItemQuantity, name }, idx, { length }) => {
					const isLastItem = idx !== length - 1;
					const isSoldOut = currentCartItemQuantity - quantity >= 0;

					return (
						<span key={name}>
							{name}: {isSoldOut ? '품절' : `${quantity - currentCartItemQuantity}개 남음`}
							{isLastItem ? ', ' : ''}
						</span>
					);
				})}
			</div>
		</div>
	);
}
