import { BoxTitle } from '../templates/BoxTitle';
import { CartItems } from './CartItems';
import { CartTotal } from './CartTotal';
import { ProductSelector } from './ProductSelector';
import { StockStatus } from './StockStatus';

export const Cart = () => {
    return (
        <div className='bg-gray-100 p-8'>
            <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
                <BoxTitle />
                <CartItems />
                <CartTotal />
                <ProductSelector />
                <StockStatus />
            </div>
        </div>
    );
};
