import { updateStock } from '@redux/features/productList/productSlice';
import { addItem } from '@redux/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { useCallback } from 'react';
import { find } from 'lodash-es';

export const useAddToCart = () => {
  const dispatch = useDispatch();
  const { productList } = useSelector((state: RootState) => state.productStore);

  const addToCart = useCallback(
    (productId: string) => {
      const product = find(productList, { id: productId }); // 재고 있는지 확인

      if (product?.quantity === 0) {
        alert('재고가 부족합니다.');
        return;
      }

      if (product) {
        dispatch(addItem(product));
        dispatch(updateStock({ id: productId, changeStock: -1 }));
      }
    },
    [productList]
  );

  return addToCart;
};
