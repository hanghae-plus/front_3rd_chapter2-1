import { updateStock } from '@redux/features/productList/productSlice';
import { decreaseItem } from '@redux/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { useCallback } from 'react';
import { find } from 'lodash-es';

export const useDecreaseToCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const decreaseToCart = useCallback(
    (productId: string) => {
      const findItemInCart = find(items, { id: productId });

      if (findItemInCart) {
        dispatch(decreaseItem({ id: productId }));
        dispatch(updateStock({ id: productId, changeStock: 1 }));
      }
    },
    [items]
  );

  return decreaseToCart;
};
