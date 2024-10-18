import useCartStore from '../store/useCartStore';

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
export default CartStockInfo;
