const CartList: React.FC = () => {
  return (
    <>
      <div id="cart-items">{/** cartItems.map(<CartItem />) */}</div>
      <CartTotalInfo />
    </>
  );
};

const CartTotalInfo: React.FC = () => {
  return <div id="cart-total" className="text-xl font-bold my-4"></div>;
};

export default CartList;
