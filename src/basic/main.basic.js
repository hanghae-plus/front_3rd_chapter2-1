import { appendChild, createElement } from '../utils';

const PRODUCT_DISCOUNT_RATES = {
	p1: 0.1,
	p2: 0.15,
	p3: 0.2,
};
const ALL_DISCOUNT_COUNT = 30;
const ALL_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const REWARD_POINT_RATE = 0.001;

const products = [
	{ id: 'p1', name: '상품1', price: 10000, count: 50, remain: 0 },
	{ id: 'p2', name: '상품2', price: 20000, count: 30, remain: 0 },
	{ id: 'p3', name: '상품3', price: 30000, count: 20, remain: 0 },
	{ id: 'p4', name: '상품4', price: 15000, count: 0, remain: 0 },
	{ id: 'p5', name: '상품5', price: 25000, count: 10, remain: 0 },
];

const ElementRoot = document.getElementById('app');

const ElementLayout = createElement('div', { className: 'bg-gray-100 p-8' });

const ElementContainer = createElement('div', {
	className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
});

const ElmentTitle = createElement('h1', { className: 'text-2xl font-bold mb-4', innerHTML: '장바구니' });

const ElementProductSelect = createElement('select', { id: 'product-select', className: 'border rounded p-2 mr-2' });

const ElmentAddProductButton = createElement('button', {
	id: 'add-to-cart',
	className: 'bg-blue-500 text-white px-4 py-2 rounded',
	innerHTML: '추가',
	onClick: onClickProductAddButton,
});

const ElementCartContainer = createElement('div', { id: 'cart-items', onClick: onClickCartContainer });

const ElmentCartTotalPrice = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });

const ElementStockStatus = createElement('div', { id: 'stock-status', className: 'text-sm text-gray-500 mt-2' });

let lastSelectedProductId;
let totalPrice = 0;

function main() {
	renderProductSelectElement();

	appendChild({
		parent: ElementContainer,
		children: [
			ElmentTitle,
			ElementCartContainer,
			ElmentCartTotalPrice,
			ElementProductSelect,
			ElmentAddProductButton,
			ElementStockStatus,
		],
	});
	appendChild({ parent: ElementLayout, children: ElementContainer });
	appendChild({ parent: ElementRoot, children: ElementLayout });

	calculateCartPrice();

	setTimeout(() => {
		setInterval(() => {
			selectLuckyProductItem();
		}, 30000);
	}, Math.random() * 10000);

	setTimeout(() => {
		setInterval(() => {
			suggestProductItem();
		}, 60000);
	}, Math.random() * 20000);
}

function selectLuckyProductItem() {
	const luckyItem = products[Math.floor(Math.random() * products.length)];
	if (Math.random() < 0.3 && luckyItem.count > 0) {
		luckyItem.price = Math.round(luckyItem.price * 0.8);
		alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
		renderProductSelectElement();
	}
}

function suggestProductItem() {
	if (lastSelectedProductId) {
		const suggest = products.find(({ id, count }) => id !== lastSelectedProductId && count > 0);
		if (suggest) {
			alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
			suggest.price = Math.round(suggest.price * 0.95);
			renderProductSelectElement();
		}
	}
}

function calculateCartPrice() {
	const totalProdcutItems = products.reduce((acc, { remain }) => acc + remain, 0);
	const cartTotalPrice = products.reduce((acc, { price, remain }) => acc + price * remain, 0);

	let discountedCartTotalPrice = products.reduce((acc, { id, price, remain }) => {
		let discountRate = 0;
		if (totalProdcutItems >= ALL_DISCOUNT_COUNT) discountRate = ALL_DISCOUNT_RATE;
		else if (remain >= 10) discountRate = PRODUCT_DISCOUNT_RATES[id] || 0;
		return acc + price * remain * (1 - discountRate);
	}, 0);

	if (new Date().getDay() === 2) {
		discountedCartTotalPrice = discountedCartTotalPrice * (1 - TUESDAY_DISCOUNT_RATE);
	}

	ElmentCartTotalPrice.innerHTML = `총액: ${Math.round(discountedCartTotalPrice)}원`;
	totalPrice = discountedCartTotalPrice;
	if (cartTotalPrice !== discountedCartTotalPrice) {
		const totalDiscountRate = (((cartTotalPrice - discountedCartTotalPrice) / cartTotalPrice) * 100).toFixed(1);
		const span = createElement('span', {
			className: 'text-green-500 ml-2',
			innerHTML: `(${totalDiscountRate}% 할인 적용)`,
		});
		appendChild({ parent: ElmentCartTotalPrice, children: span });
	}

	renderStockInfoElement();
	renderBonusPointElement();
}

function calculatePoint() {
	return Math.floor(totalPrice * REWARD_POINT_RATE);
}

function handleCartItem(targetProductItemId, count) {
	const targetProductItem = products.find(({ id }) => id === targetProductItemId);

	const { count: currentCount, remain, id } = targetProductItem;
	if (remain === currentCount || currentCount < 0) {
		return alert('재고가 부족합니다.');
	}
	if (count === 0) {
		targetProductItem.remain = count;
	} else {
		targetProductItem.remain += count;
	}
	renderCartItemElement(targetProductItemId);
	calculateCartPrice();
	lastSelectedProductId = id;
}

function renderProductSelectElement() {
	ElementProductSelect.innerHTML = '';
	products.forEach(({ id, name, price, count }) => {
		const productOption = createElement('option', {
			value: id,
			innerHTML: `${name} - ${price}원`,
			disabled: count === 0,
		});
		appendChild({ parent: ElementProductSelect, children: productOption });
	});
}

function renderBonusPointElement() {
	const bonusPoint = calculatePoint();
	let ptsTag = document.getElementById('loyalty-points');
	if (!ptsTag) {
		ptsTag = createElement('span', { id: 'loyalty-points', className: 'text-blue-500 ml-2' });
		appendChild({ parent: ElmentCartTotalPrice, children: ptsTag });
	}
	ptsTag.innerHTML = `(포인트: ${bonusPoint})`;
}

function renderCartItemElement(selectedProductId) {
	const ElementTargetProductItem = document.getElementById(selectedProductId);
	const { price, remain, name } = products.find((item) => item.id === selectedProductId);

	if (remain === 0) {
		if (ElementTargetProductItem) {
			ElementTargetProductItem.remove();
		}
		return;
	}
	if (ElementTargetProductItem) {
		ElementTargetProductItem.querySelector('span');
		ElementTargetProductItem.querySelector('span').innerHTML = `${name} - ${price}원 x ${remain}`;
	} else {
		const ElementProductItem = createElement('div', {
			id: selectedProductId,
			className: 'flex justify-between items-center mb-2',
		});

		const ElementProductInfo = createElement('span', { innerHTML: `${name} - ${price}원 x 1` });

		const ElementProductButtonWrap = createElement('div');
		const ElementProductButtonClassName = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
		const ElementProductPlusButton = createElement('button', {
			className: ElementProductButtonClassName,
			innerHTML: '+',
			'data-product-id': selectedProductId,
			'data-change': 1,
		});
		const ElementProductMinusButton = createElement('button', {
			className: ElementProductButtonClassName,
			innerHTML: '-',
			'data-product-id': selectedProductId,
			'data-change': -1,
		});
		const ElementProductItemDeleteButton = createElement('button', {
			className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
			innerHTML: '삭제',
			'data-product-id': selectedProductId,
		});

		appendChild({
			parent: ElementProductButtonWrap,
			children: [ElementProductMinusButton, ElementProductPlusButton, ElementProductItemDeleteButton],
		});

		appendChild({ parent: ElementProductItem, children: [ElementProductInfo, ElementProductButtonWrap] });

		appendChild({ parent: ElementCartContainer, children: ElementProductItem });
	}
}

function renderStockInfoElement() {
	let infoMsg = '';
	products.forEach(({ remain, count, name }) => {
		const remainCount = count - remain;

		if (remainCount < 5) {
			infoMsg += `${name}: ${remainCount > 0 ? `재고 부족 (${remainCount}개 남음)` : '품절'} \n`;
		}
	});
	ElementStockStatus.innerHTML = infoMsg;
}

function onClickProductAddButton() {
	const selectedCartItemId = ElementProductSelect.value;
	handleCartItem(selectedCartItemId, 1);
	renderCartItemElement(selectedCartItemId);
}

function onClickCartContainer(event) {
	const target = event.target;
	if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
		const productId = target.dataset.productId;

		const productChangeCount = target.dataset.change ?? 0;

		handleCartItem(productId, Number(productChangeCount));
	}
}

main();
