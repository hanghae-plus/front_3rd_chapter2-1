import React from 'react';

export const CartTotal = () => {
    return (
        <div id='cart-total' className='text-xl font-bold my-4'>
            총액: 0원
            <span id='loyalty-points' className='text-blue-500 ml-2'>
                (포인트: 0)
            </span>
        </div>
    );
};
