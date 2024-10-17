// cart 상태를 관리하는 useCartStore 훅

import { useReducer } from 'react';

export type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export type Product = {
	id: ProductId;
	name: string;
	price: number;
	quantity: number;
	currentCartItemQuantity: number;
};

export type State = {
	products: Product[];
	lastSelectedProductId: ProductId | null;
};

export type Action =
	| { type: 'ADD_CART_ITEM' | 'REMOVE_CART_ITEM'; productId: ProductId }
	| {
			type: 'CHANGE_CART_ITEM_QUANTITY';
			payload: { productId: ProductId; quantity: number };
	  }
	| { type: 'UPDATE_TOTAL_PRICE'; payload: { discountRate: number } }
	| { type: 'LUCKY_PRODUCT_ITEM' }
	| { type: 'SUGGEST_PRODUCT_ITEM' };

// 초기 상태값
const initProducts: Product[] = [
	{ id: 'p1', name: '상품1', price: 10000, quantity: 50, currentCartItemQuantity: 0 },
	{ id: 'p2', name: '상품2', price: 20000, quantity: 30, currentCartItemQuantity: 0 },
	{ id: 'p3', name: '상품3', price: 30000, quantity: 20, currentCartItemQuantity: 0 },
	{ id: 'p4', name: '상품4', price: 15000, quantity: 0, currentCartItemQuantity: 0 },
	{ id: 'p5', name: '상품5', price: 25000, quantity: 10, currentCartItemQuantity: 0 },
];

// reducer함수
function reducer(state: State, action: Action): State {
	const { products, lastSelectedProductId } = state;

	switch (action.type) {
		// 장바구니 상품 추가
		case 'ADD_CART_ITEM': {
			const { productId } = action;

			return {
				...state,
				products: products.map((product) => {
					if (product.id === productId) {
						const { currentCartItemQuantity } = product;

						return {
							...product,
							currentCartItemQuantity: currentCartItemQuantity + 1,
						};
					}
					return product;
				}),
			};
		}

		// 장바구니 상품 제거
		case 'REMOVE_CART_ITEM': {
			const { productId } = action;

			return {
				...state,
				products: products.map((product) => {
					if (product.id === productId) {
						return {
							...product,
							currentCartItemQuantity: 0,
						};
					}
					return product;
				}),
			};
		}

		// 장바구니 상품 수량 변경
		case 'CHANGE_CART_ITEM_QUANTITY': {
			const { productId, quantity } = action.payload;

			return {
				...state,
				products: products.map((product) => {
					if (product.id === productId) {
						const { currentCartItemQuantity } = product;

						return {
							...product,
							currentCartItemQuantity: currentCartItemQuantity + quantity,
						};
					}
					return product;
				}),
				lastSelectedProductId: productId,
			};
		}

		// 깜짝 상품 할인 이벤트
		case 'LUCKY_PRODUCT_ITEM': {
			const luckyItem = products[Math.floor(Math.random() * products.length)];
			const { quantity, price, id, name } = luckyItem;

			if (Math.random() < 0.3 && quantity > 0) {
				const luckyPrice = Math.round(price * 0.8);
				alert(`번개세일! ${name}이(가) 20% 할인 중입니다!`);

				return {
					...state,
					products: products.map((product) => (product.id === id ? { ...product, price: luckyPrice } : product)),
				};
			}
			return state;
		}

		// 추천 상품 이벤트
		case 'SUGGEST_PRODUCT_ITEM': {
			if (lastSelectedProductId) {
				const suggest = products.find(
					({ id, currentCartItemQuantity }) => id !== lastSelectedProductId && currentCartItemQuantity > 0,
				);
				if (suggest) {
					alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
					const suggestPrice = Math.round(suggest.price * 0.95);
					return {
						...state,
						products: products.map((product) =>
							product.id === suggest.id ? { ...product, price: suggestPrice } : product,
						),
					};
				}
			}
			return state;
		}
		default:
			return state;
	}
}

export function useCartStore() {
	const [state, dispatch] = useReducer(reducer, {
		products: initProducts,
		lastSelectedProductId: null,
	});

	return [state, dispatch] as const;
}
