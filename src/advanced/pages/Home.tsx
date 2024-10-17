import { useCallback, useEffect, useRef, useState } from 'react';
import AddToCartButton from '../components/AddToCartButton';
import CartList from '../components/CartList';
import CartTotal from '../components/CartTotal';
import ProductSelect from '../components/ProductSelect';
import StockInfo from '../components/StockInfo';
import { Cart, Product } from '../types';
import calculateCart from '../utils/calculateCart';

export default function Home() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ]);
  const [cartList, setCartList] = useState<Cart[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    // activateLuckySale();
    // activateSuggestSale();
  }, []);

  useEffect(() => {
    const [_totalPrice, _discountRate] = calculateCart(cartList);
    setTotalPrice(_totalPrice);
    setDiscountRate(_discountRate);
  }, [cartList]);

  const handleAddToCart = useCallback(() => {
    const $select = selectRef.current;
    if (!$select) return;

    const selectedProductId = $select.value;
    const selectedProduct = productList.find(
      (product) => product.id === selectedProductId
    );
    if (!selectedProduct) return;

    const existProduct = cartList.find((cart) => cart.id === selectedProductId);
    if (existProduct) {
      const newCartList = cartList.map((cart) =>
        cart.id === selectedProductId
          ? { ...cart, quantity: cart.quantity + 1 }
          : cart
      );
      setCartList(newCartList);
    } else {
      setCartList([
        ...cartList,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        },
      ]);
    }
  }, [selectRef.current]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartList cartList={cartList} />
        <CartTotal
          totalPrice={totalPrice}
          discountRate={discountRate}
          bonusPoints={bonusPoints}
        />
        <ProductSelect productList={productList} selectRef={selectRef} />
        <AddToCartButton onClick={handleAddToCart} />
        <StockInfo productList={productList} />
      </div>
    </div>
  );
}
