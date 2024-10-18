import CartList from '../components/CartList';
import CartSelectForm from '../components/CartSelectForm';
import CartStockInfo from '../components/CartStockInfo';

const CartPage: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <CartList />
        <CartSelectForm />
        <CartStockInfo />
      </div>
    </div>
  );
};
export default CartPage;
