import CartList from '../components/CartList';
import CartSelectForm from '../components/CartSelectForm';
import useCartStore from '../store/useCartStore';

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

// 상품 품절 및 재고 알림 텍스트 컴포넌트
const CartStockInfo: React.FC = () => {
  const { productList, cartList } = useCartStore();
  let stockMsg = '';

  // productList의 각 제품의 재고 상태를 확인
  productList.forEach((product) => {
    const { id, name, count } = product;

    // 장바구니에 해당 제품이 있는지 확인
    const cartItem = cartList.find((cartItem) => cartItem.id === id);

    /*
      장바구니에 해당 제품이 있을 경우:
      - productList 재고에서 장바구니에 담긴 수량을 빼서 남은 재고 확인
      장바구니에 해당 제품이 없을 경우:
      - productList의 재고 수량 그대로 사용
    */
    const remainStock = cartItem ? count - cartItem.count : count;

    // 남은 재고가 5개 미만이면 재고 부족 메시지 추가하고 0개이면 품절 메시지 추가
    if (remainStock < 5) stockMsg += `${name}: ${remainStock > 0 ? `재고 부족(${remainStock}개 남음)` : '품절'}\n`;
  });

  return (
    <div id="stock-status" className="text-sm text-gray-500 mt-2">
      {stockMsg}
    </div>
  );
};

export default CartPage;
