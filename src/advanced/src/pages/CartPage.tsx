import CartItems from '../components/CartItems';
import CartTotalPrice from '../components/CartTotalPrice';
import ProductSelect from '../components/ProductSelect';
import Title from '../components/Title';
// import useAlertDiscount from '../hooks/useAlertDiscount';

const CartPage = () => {
  // useAlertDiscount();

  return (
    <main className="bg-gray-100 p-8">
      <section className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <Title />

        <CartItems />
        <CartTotalPrice />

        <ProductSelect />

        <div id="stock-status" className="text-sm text-gray-500 mt-2">
          상품4: 품절
        </div>
      </section>
    </main>
  );
};

export default CartPage;
