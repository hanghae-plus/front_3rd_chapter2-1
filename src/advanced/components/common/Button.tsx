import useCartStore from '../../store/useCartStore';

interface ButtonProps {
  type: 'addCart' | 'removeCart' | 'addCount' | 'substractCount';
  dataProductId: string;
}

const Button: React.FC<ButtonProps> = ({ type, dataProductId }) => {
  const { getCartEntry, getProductEntry, addToCart, substractToCart, removeToCart } = useCartStore();

  // 제품을 장바구니에 추가하는 핸들러
  const handleAddToCart = () => {
    const cartEntry = getCartEntry(dataProductId); // 장바구니의 제품 정보 가져오기
    const productEntry = getProductEntry(dataProductId); // 제품의 재고 정보 가져오기

    if (cartEntry?.count >= productEntry?.count) {
      alert('재고가 부족합니다.'); // 재고 부족 시 경고
      return;
    }

    addToCart(dataProductId); // 장바구니에 제품 추가
  };

  // 수량 감소 핸들러
  const handleCountDown = () => substractToCart(dataProductId);

  // 장바구니에서 제품 제거 핸들러
  const handleRemoveFromCart = () => removeToCart(dataProductId);

  // 버튼 속성 설정
  const buttonConfig = {
    addCart: {
      id: 'add-to-cart',
      className: 'bg-blue-500 text-white px-4 py-2 rounded',
      onClick: handleAddToCart,
      label: '추가',
    },
    removeCart: {
      id: 'remove-from-cart',
      className: 'bg-red-500 text-white px-2 py-1 rounded',
      onClick: handleRemoveFromCart,
      label: '삭제',
    },
    addCount: {
      id: 'increase-count',
      className: 'bg-blue-500 text-white px-2 py-1 rounded mr-1',
      onClick: handleAddToCart,
      label: '+',
    },
    substractCount: {
      id: 'decrease-count',
      className: 'bg-blue-500 text-white px-2 py-1 rounded mr-1',
      onClick: handleCountDown,
      label: '-',
    },
  };

  const { id, className, onClick, label } = buttonConfig[type];

  return (
    <button id={id} className={className} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
