import { pickItemId } from '@advanced/redux/features/cart/cartSlice';
import { useAddToCart } from '@advanced/hooks/cart/useAddToCart';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@advanced/redux/store';
import React, { useCallback, useRef } from 'react';

type ChangeEvent = React.ChangeEvent<HTMLSelectElement>;

const CartSelectBox: React.FC<SelectPropsType> = ({ productList = [] }) => {
  const selectBoxRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch();
  const addToCart = useAddToCart();

  // select 박스에서 선택된 값 업데이트
  const handleSelectChange = useCallback((e: ChangeEvent) => {
    dispatch(pickItemId({ id: e.target.value }));
  }, []);

  const handleAddToCart = () => {
    const id = selectBoxRef.current!.value;
    addToCart(id);
  };

  return (
    <>
      <select
        id="product-select"
        data-testid="product-select"
        className="border rounded p-2 mr-2"
        onChange={handleSelectChange}
        ref={selectBoxRef}
      >
        {productList.map(({ id, name, price, quantity }, index) => (
          <option
            value={id}
            disabled={quantity === 0}
            key={`${id}-${index}th-option`}
          >
            {`${name} - ${price}원`}
          </option>
        ))}
      </select>
      <button
        id="add-to-cart"
        data-testid="add-to-cart"
        onClick={handleAddToCart}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        추가
      </button>
    </>
  );
};

export default CartSelectBox;
