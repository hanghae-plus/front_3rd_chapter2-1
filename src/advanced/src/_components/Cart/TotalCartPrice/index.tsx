// Cart에 담긴 금액을 보여주는 컴포넌트

import React from 'react';
import type { Product } from '../../../store/useCart';
import {
	ALL_DISCOUNT_QUANTITY,
	ALL_DISCOUNT_RATE,
	PRODUCT_DISCOUNT_QUANTITY,
	PRODUCT_DISCOUNT_RATES,
	REWARD_POINT_RATE,
	TUESDAY_DISCOUNT_RATE,
} from '../../../contant';

type Props = {
	cartItems: Product[];
};

export default function TotalCartPrice({ cartItems }: Props) {
	// cartItems의 총 수량
	const totalCartItemQuantity = cartItems.reduce(
		(acc, { currentCartItemQuantity }) => acc + currentCartItemQuantity,
		0,
	);

	// cartItems의 총 금액
	const totalPrice = cartItems.reduce(
		(acc, { currentCartItemQuantity, price }) => acc + currentCartItemQuantity * price,
		0,
	);

	// 할인 적용된 cartItems의 총 금액
	const discountedPrice = cartItems.reduce((acc, { currentCartItemQuantity, price, id }) => {
		let discountedRate = 0;

		if (currentCartItemQuantity >= PRODUCT_DISCOUNT_QUANTITY) {
			discountedRate = PRODUCT_DISCOUNT_RATES[id] || 0;
		}

		if (totalCartItemQuantity >= ALL_DISCOUNT_QUANTITY) {
			discountedRate = ALL_DISCOUNT_RATE;
		}

		return acc + currentCartItemQuantity * price * (1 - discountedRate);
	}, 0);

	// 0원인지 확인 0/0은 NaN이므로 0으로 처리
	const isZero = totalPrice === 0;

	// 0원인 경우 할인율은 0으로 처리
	const discountRate = isZero ? 0 : (((totalPrice - discountedPrice) / totalPrice) * 100).toFixed(1);

	// 포인트 계산
	const point = Math.floor(totalPrice * REWARD_POINT_RATE);

	// 화요일인지 확인
	const isTuesday = new Date().getDay() === 2;

	// 화요일인 경우 화요일 할인율 적용
	const resultPrice = isTuesday ? discountedPrice * (1 - TUESDAY_DISCOUNT_RATE) : discountedPrice;

	return (
		<div id="cart-total" className="text-xl font-bold my-4">
			총액: {resultPrice.toLocaleString()}원<span className="text-green-500 ml-2">({discountRate}% 할인 적용)</span>
			<span id="loyalty-points" className="text-blue-500 ml-2">
				(포인트: {point})
			</span>
		</div>
	);
}
