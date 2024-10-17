import Amount from './components/Amount';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import StockInfo from './components/StockInfo';
import { CartProvider } from './context/cart/CartProvider';
import { Product } from './types/Cart';

const products: Product[] = [
  { id: '1', name: '상품1', price: 10000, stock: 50 },
  { id: '2', name: '상품2', price: 20000, stock: 30 },
  { id: '3', name: '상품3', price: 30000, stock: 20 },
  { id: '4', name: '상품4', price: 15000, stock: 0 },
  { id: '5', name: '상품5', price: 25000, stock: 10 },
];

const App: React.FC = () => {
  return (
    <CartProvider initialProducts={products}>
      <div className='bg-gray-100 p-8'>
        <div className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8'>
          <Cart />
          <Amount />
          <ProductList products={products} />
          <StockInfo products={products} />
        </div>
      </div>
    </CartProvider>
  );
};

export default App;
