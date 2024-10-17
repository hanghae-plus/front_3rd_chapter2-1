import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, products } = useCart();

  const handleQuantityChange = (productId: string, change: number) => {
    const item = cart.find((i) => i.id === productId);
    const product = products.find((p) => p.id === productId);

    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity > 0 && newQuantity <= product.stock + item.quantity) {
      updateQuantity(productId, newQuantity);
      product.stock -= change;
    } else if (newQuantity <= 0) {
      removeFromCart(productId);
      product.stock += item.quantity;
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const handleRemoveItem = (productId: string) => {
    const item = cart.find((i) => i.id === productId);
    const product = products.find((p) => p.id === productId);

    if (item && product) {
      product.stock += item.quantity;
      removeFromCart(productId);
    }
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>장바구니</h1>
      <div id='cart-items'>
        {cart.map((item) => (
          <div
            key={item.id}
            className='flex justify-between items-center mb-2'
            id={item.id}
          >
            <span>
              {item.name} - {item.price}원 x {item.quantity}
            </span>
            <div>
              <button
                className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                onClick={() => handleQuantityChange(item.id, -1)}
                data-product-id={item.id}
                data-change='-1'
              >
                -
              </button>
              <button
                className='quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1'
                onClick={() => handleQuantityChange(item.id, 1)}
                data-product-id={item.id}
                data-change='1'
              >
                +
              </button>
              <button
                className='remove-item bg-red-500 text-white px-2 py-1 rounded'
                onClick={() => handleRemoveItem(item.id)}
                data-product-id={item.id}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;
