import CartItems from '../components/CartItems';
import CartTotalPrice from '../components/CartTotalPrice';
import ProductSelect from '../components/ProductSelect';
import Title from '../components/Title';

const CartPage = () => {
  return (
    <main className="bg-gray-100 p-8">
      <section className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Title />

        <CartItems />
        <CartTotalPrice />

        <ProductSelect />
        <button onClick={() => {}} id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
          추가
        </button>

        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          상품4: 품절
        </div>
      </section>
    </main>
  );
};

export default CartPage;
