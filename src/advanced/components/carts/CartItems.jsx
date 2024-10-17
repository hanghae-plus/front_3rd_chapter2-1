import React from 'react';

export const CartItems = () => {
    return (
        <div id='cart-items'>
            <div id='p1' className='flex justify-between items-center mb-2'>
                <span>상품1 - 0.2원 x 1</span>
                <div>
                    <button className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1' data-product-id='${itemToAdd.id}' data-change='-1'>
                        -
                    </button>
                    <button className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1' data-product-id='${itemToAdd.id}' data-change='1'>
                        +
                    </button>
                    <button className='remove-item bg-red-500 text-white px-2 py-1 rounded' data-product-id='${itemToAdd.id}'>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};
