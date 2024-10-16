import CartItem from './CartItem';

const CartInfo = () => {
  return `
  <div id="cart-items">
    ${CartItem({ id: 'p1', title: 'testTitle' })}
    ${CartItem({ id: 'p2', title: 'testTitle' })}
    ${CartItem({ id: 'p3', title: 'testTitle' })}
  </div>`;
};

export default CartInfo;
