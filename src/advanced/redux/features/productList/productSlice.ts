import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { find, findIndex } from 'lodash-es';

interface ProductListState {
  productList: ItemType[];
}

const initialState: ProductListState = {
  productList: [
    {
      id: 'p1',
      name: '상품1',
      price: 10000,
      quantity: 50,
      discount: 0.1,
    },
    {
      id: 'p2',
      name: '상품2',
      price: 20000,
      quantity: 30,
      discount: 0.15,
    },
    {
      id: 'p3',
      name: '상품3',
      price: 30000,
      quantity: 20,
      discount: 0.2,
    },
    {
      id: 'p4',
      name: '상품4',
      price: 15000,
      quantity: 0,
      discount: 0.05,
    },
    {
      id: 'p5',
      name: '상품5',
      price: 25000,
      quantity: 10,
      discount: 0.25,
    },
  ],
};

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    updateStock: (
      state,
      action: PayloadAction<{ id: string; changeStock: number }>
    ) => {
      const { id, changeStock } = action.payload;
      const findProduct = find(state.productList, (item) => item.id === id);

      // 재고 업데이트
      if (findProduct) findProduct.quantity += changeStock;
    },
    updatePrice: (
      state,
      action: PayloadAction<{ id: string; changePrice: number }>
    ) => {
      const { id, changePrice } = action.payload;
      const index = findIndex(state.productList, (item) => item.id === id);

      if (index === -1) return;

      // 가격 업데이트
      state.productList[index].price = changePrice;
    },
  },
});

export const { updateStock, updatePrice } = productListSlice.actions;
export default productListSlice.reducer;
