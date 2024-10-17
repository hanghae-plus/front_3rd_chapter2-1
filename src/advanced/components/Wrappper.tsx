import { useEffect, useState } from 'react';
import { CartItems } from './CartItems';
import { CartTotal } from './CartTotal';
import { Header } from './Header';
import { ProductSelect } from './ProductSelect';
import { StockInfo } from './StockInfo';

export const Wrapper = () => {
  const initialProducts: Product[] = [
    { id: 'p1', name: '상품1', price: 10000, amount: 50 },
    { id: 'p2', name: '상품2', price: 20000, amount: 30 },
    { id: 'p3', name: '상품3', price: 30000, amount: 20 },
    { id: 'p4', name: '상품4', price: 15000, amount: 0 },
    { id: 'p5', name: '상품5', price: 25000, amount: 10 },
  ];
  const [productList, setProductList] = useState<Product[]>(initialProducts);
  const [cartList, setCartList] = useState<Cart[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const calculateCart = () => {
    cartList.forEach((cartItem) => {
      let total = 0;
      let point = 0;
      const product: Product = productList.find(
        (productItem) => productItem.id === cartItem.productId
      ) || { id: '', name: 'Unknown', price: 0, amount: 0 };
      if (product) {
        const itemPrice = product.price * cartItem.amount;
        total += itemPrice;
        setTotalAmount(total);
        point += Math.floor(total / 1000);
        setBonusPoints(point);
      }
    });
  };
  const changeAmount = (id: string, changeNum: number) => {
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.productId === id
          ? { ...item, amount: item.amount + changeNum }
          : item
      )
    );
  };
  const addCart = (id: string) => {
    console.log(id);
    setCartList((prevCartList) => {
      return [...prevCartList, { productId: id, amount: 1 }];
    });
  };
  useEffect(() => {
    calculateCart();
  }, [cartList]);

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
      <Header />
      <CartItems
        cartList={cartList}
        productList={productList}
        changeAmount={changeAmount}
      />
      <CartTotal totalAmount={totalAmount} bonusPoints={bonusPoints} />
      <ProductSelect productList={productList} addCart={addCart} />
      <StockInfo />
    </div>
  );
};
