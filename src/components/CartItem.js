const CartItem = ({ id, title }) => {
  return `
    <div id="${id}" class="flex justify-between items-center mb-2">
			<span>상품1 - 10000원 x 8${title}</span>
			<div>
				<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="-1">-</button>
      	<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="p1" data-change="1">+</button>
      	<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="p1">삭제</button>
    	</div>
  	</div>
    `;
};

export default CartItem;
