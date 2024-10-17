import { useEffect, useRef, useState } from 'react';
import AddToCartButton from '../components/AddToCartButton';
import CartList from '../components/CartList';
import CartTotal from '../components/CartTotal';
import ProductSelect from '../components/ProductSelect';
import StockInfo from '../components/StockInfo';
// import calculateCart from '../utils/calculateCart';

export default function Home() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    // activateLuckySale();
    // activateSuggestSale();
  }, []);

  // useEffect(() => {
  //   const [_totalPrice, _discountRate] = calculateCart(cartList);
  //   setTotalPrice(_totalPrice);
  //   setDiscountRate(_discountRate);
  //   setBonusPoints((prev) => prev + Math.floor(totalPrice / 1000));
  // }, [cartList]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartList />
        <CartTotal
          totalPrice={totalPrice}
          discountRate={discountRate}
          bonusPoints={bonusPoints}
        />
        <ProductSelect selectRef={selectRef} />
        <AddToCartButton selectRef={selectRef} />
        <StockInfo />
      </div>
    </div>
  );
}
