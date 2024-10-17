import { useEffect, useRef } from 'react';
import { useCartContext, useProductContext } from '../utils/hooks';

export default function AddToCartButton({
  selectRef,
}: {
  selectRef: React.RefObject<HTMLSelectElement>;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { productList, setProductQuantity } = useProductContext();
  const {
    setCartQuantity: addCartQuantity,
    getCart,
    addCart,
  } = useCartContext();

  const handleAddToCart = () => {
    const id = selectRef.current?.value;
    if (!id) return;

    const selectedProduct = productList.find((product) => product.id === id);
    if (!selectedProduct) return;

    const isSoldOut = selectedProduct.quantity === 0;
    if (isSoldOut) return alert('재고가 부족합니다.');

    const existProduct = getCart(id);
    if (existProduct) addCartQuantity(id, 1);
    else {
      addCart({
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: 1,
      });
    }

    setProductQuantity(id, selectedProduct.quantity - 1);
  };

  useEffect(() => {
    buttonRef.current?.addEventListener('click', handleAddToCart);

    return () => {
      buttonRef.current?.removeEventListener('click', handleAddToCart);
    };
  }, [buttonRef.current]);

  return (
    <button
      id="add-to-cart"
      className="bg-blue-500 text-white px-4 py-2 rounded"
      ref={buttonRef}
    >
      추가
    </button>
  );
}
