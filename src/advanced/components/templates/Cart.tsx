import { rateToPercent } from '@advanced/utils/rateToPercent ';
import CartTotalLabel from '@molecules/CartTotalLabel';
import CartSelectBox from '@molecules/CartSelectBox';
import ItemsInCart from '../molecules/ItemsInCart';
import StockLabel from '@molecules/StockLabel';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import React, { useMemo } from 'react';

const Cart: React.FC = () => {
  const { productList } = useSelector((state: RootState) => state.productStore);
  const { items, discountedPrice, point, discount } = useSelector(
    (state: RootState) => state.cart
  );

  const memoDisCount = useMemo(() => rateToPercent(discount), [discount]);
  const memoCartItems = useMemo(() => items, [items]);
  const memoProductList = useMemo(() => productList, [productList]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <h1 className="text-2xl font-bold mb-4">장바구니</h1>

      <ItemsInCart items={memoCartItems} />

      <CartTotalLabel
        totalPrice={discountedPrice}
        discount={memoDisCount}
        point={point}
      />

      <CartSelectBox productList={memoProductList} />

      <StockLabel productList={memoProductList} />
    </div>
  );
};

export default Cart;
