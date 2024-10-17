import { updateStock } from '@redux/features/productList/productSlice';
import { removeItem } from '@redux/features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { useCallback } from 'react';
import { find } from 'lodash-es';

export const useRemoveToCart = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const removeToCart = useCallback(
    (productId: string) => {
      const findItemInCart = find(items, { id: productId });

      if (findItemInCart) {
        dispatch(removeItem({ id: productId }));
        dispatch(
          updateStock({ id: productId, changeStock: findItemInCart.quantity })
        );
      }
    },
    [items]
  );

  return removeToCart;
};
