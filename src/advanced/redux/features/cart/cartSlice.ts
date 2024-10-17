import { getDiscountSummary } from '@advanced/hooks/discount/getDiscountSummary';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { find, findIndex } from 'lodash-es';

interface CartState {
  items: ItemType[];
  totalPrice: number;
  discountedPrice: number;
  discount: number;
  point: number;
  lastPickItemId: string;
}

const initialState: CartState = {
  items: [],
  totalPrice: 0,
  discountedPrice: 0,
  discount: 0,
  point: 0,
  lastPickItemId: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    pickItemId: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.lastPickItemId = id;
    },
    decreaseItem: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const index = findIndex(state.items, (item) => item.id === id);

      if (index === -1) return;

      const item = state.items[index];

      // 장바구니에 있을 경우 수량 - 1
      if (item) item.quantity--;

      // 수량이 0이면 장바구니에서 제거
      if (item.quantity === 0) state.items.splice(index, 1);

      // 장바구니 총액 업데이트
      state.totalPrice -= item.price;

      // (10개이상 , 대량, 요일 등 ) 할인 이벤트 조건부 적용
      const [price, rate] = getDiscountSummary(state.items);
      state.discountedPrice = price;
      state.discount = rate;

      // 포인트 업데이트
      state.point += Math.floor(price / 1000);
    },
    addItem: (state, action: PayloadAction<ItemType>) => {
      const updateItem = action.payload;
      const { id } = updateItem;

      const existingItem = find(state.items, (item) => item.id === id);

      // 장바구니에 있을 경우 수량 + 1
      if (existingItem) existingItem.quantity++;
      // 장바구니에 없을 경우 추가
      else state.items.push({ ...updateItem, quantity: 1 });

      // 장바구니 총액 업데이트
      state.totalPrice += updateItem.price;

      // (10개이상 , 대량, 요일 등 ) 할인 이벤트 조건부 적용
      const [price, rate] = getDiscountSummary(state.items);
      state.discountedPrice = price;
      state.discount = rate;

      // 포인트 업데이트
      state.point += Math.floor(price / 1000);
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const index = findIndex(state.items, (item) => item.id === id);

      if (index === -1) return;

      const item = state.items[index];

      // 장바구니에서 제거
      state.items.splice(index, 1);

      // 장바구니 총액 업데이트
      state.totalPrice -= item.price * item.quantity;

      // (10개이상 , 대량, 요일 등 ) 할인 이벤트 조건부 적용
      const [price, rate] = getDiscountSummary(state.items);
      state.discountedPrice = price;
      state.discount = rate;
    },
  },
});

export const { addItem, removeItem, decreaseItem, pickItemId } =
  cartSlice.actions;
export default cartSlice.reducer;
