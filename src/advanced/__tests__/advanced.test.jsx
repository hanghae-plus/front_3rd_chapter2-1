import {
  beforeAll,
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App.tsx';
import React from 'react';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Cart from '../components/templates/Cart.tsx';
import CartSelectBox from '../components/molecules/CartSelectBox.tsx';
import { pickItemId } from '../redux/features/cart/cartSlice';
import {
  LIGHTNING_SALE_DELAY,
  LIGHTNING_SALE_INTERVAL,
  SUGGESTION_DISCOUNT_DELAY,
  SUGGESTION_DISCOUNT_INTERVAL,
} from '../constants/discount.ts';

describe('advanced test', () => {
  describe.each([
    { type: 'origin', loadFile: () => import('../../main.js') },
    { type: 'advanced', loadFile: () => import('../main.advanced.js') },
  ])('$type 장바구니 시나리오 테스트', ({ type, loadFile }) => {
    let sel, addBtn, cartDisp, sum, stockInfo;

    beforeAll(async () => {
      // DOM 초기화
      document.body.innerHTML = '<div id="app"></div>';
      await loadFile();

      if (type === 'origin') {
        // 전역 변수 참조
        sel = document.getElementById('product-select');
        addBtn = document.getElementById('add-to-cart');
        cartDisp = document.getElementById('cart-items');
        sum = document.getElementById('cart-total');
        stockInfo = document.getElementById('stock-status');
      }
    });

    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(window, 'alert').mockImplementation(() => {});

      //월요일
      const mockDate = new Date('2024-10-14');
      vi.setSystemTime(mockDate);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
      if (type === 'origin') {
        expect(sel).toBeDefined();
        expect(sel.tagName.toLowerCase()).toBe('select');
        expect(sel.children.length).toBe(5);

        // 첫 번째 상품 확인
        expect(sel.children[0].value).toBe('p1');
        expect(sel.children[0].textContent).toBe('상품1 - 10000원');
        expect(sel.children[0].disabled).toBe(false);

        // 마지막 상품 확인
        expect(sel.children[4].value).toBe('p5');
        expect(sel.children[4].textContent).toBe('상품5 - 25000원');
        expect(sel.children[4].disabled).toBe(false);

        // 재고 없는 상품 확인 (상품4)
        expect(sel.children[3].value).toBe('p4');
        expect(sel.children[3].textContent).toBe('상품4 - 15000원');
        expect(sel.children[3].disabled).toBe(true);
      }

      if (type === 'advanced') {
        render(<App />);

        const selectBox = screen.getByTestId('product-select');
        expect(selectBox).toBeDefined();
        expect(selectBox).toBeInstanceOf(HTMLSelectElement);
        expect(selectBox.children.length).toBe(5);

        // 첫 번째 상품 확인
        const options = within(selectBox).getAllByRole('option');
        const p1 = options[0];
        expect(p1.value).toBe('p1');
        expect(p1.textContent).toBe('상품1 - 10000원');
        expect(p1.disabled).toBe(false);

        // 마지막 상품 확인
        const p5 = options[4];
        expect(p5.value).toBe('p5');
        expect(p5.textContent).toBe('상품5 - 25000원');
        expect(p5.disabled).toBe(false);

        // 재고 없는 상품 확인 (상품4)
        const p4 = options[3];
        expect(p4.value).toBe('p4');
        expect(p4.textContent).toBe('상품4 - 15000원');
        expect(p4.disabled).toBe(true);
      }
    });

    it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
      if (type === 'origin') {
        expect(document.querySelector('h1').textContent).toBe('장바구니');
        expect(sel).toBeDefined();
        expect(addBtn).toBeDefined();
        expect(cartDisp).toBeDefined();
        expect(sum).toBeDefined();
        expect(stockInfo).toBeDefined();
      }

      if (type === 'advanced') {
        render(<App />);

        expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
          '장바구니'
        );
        expect(screen.getByTestId('product-select')).toBeDefined();
        expect(screen.getByTestId('add-to-cart')).toBeDefined();
        expect(screen.getByTestId('cart-items')).toBeDefined();
        expect(screen.getByTestId('cart-total')).toBeDefined();
        expect(screen.getByTestId('stock-status')).toBeDefined();
      }
    });

    it('상품을 장바구니에 추가할 수 있는지 확인', async () => {
      if (type === 'origin') {
        sel.value = 'p1';
        addBtn.click();

        expect(cartDisp.children.length).toBe(1);
        expect(
          cartDisp.children[0].querySelector('span').textContent
        ).toContain('상품1 - 10000원 x 1');
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품1 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p1' } });

        // 추가 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        const cartItems = screen.getByTestId('cart-items');
        expect(cartItems.children.length).toBe(1);

        const cartItemText =
          cartItems.children[0].querySelector('span').textContent;
        expect(cartItemText).toContain('상품1 - 10000원 x 1');
      }
    });

    it('장바구니에서 상품 수량을 변경할 수 있는지 확인', async () => {
      if (type === 'origin') {
        const increaseBtn = cartDisp.querySelector(
          '.quantity-change[data-change="1"]'
        );
        increaseBtn.click();
        expect(
          cartDisp.children[0].querySelector('span').textContent
        ).toContain('상품1 - 10000원 x 2');
      }

      if (type === 'advanced') {
        render(<App />);

        // 상품1의 +1 버튼
        const increaseBtn = screen.getByTestId('p1-item-increase-btn');
        fireEvent.click(increaseBtn);

        const cartItems = screen.getByTestId('cart-items');
        const cartItemText = within(cartItems.children[0]).getByRole(
          'p1-cart-data-label'
        ).textContent;

        expect(cartItemText).toContain('상품1 - 10000원 x 2');
      }
    });

    it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
      if (type === 'origin') {
        sel.value = 'p1';
        addBtn.click();
        const removeBtn = cartDisp.querySelector('.remove-item');
        removeBtn.click();
        expect(cartDisp.children.length).toBe(0);
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품1 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p1' } });

        // 상품1 +1 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        // 상품1 제거 버튼을 클릭
        const removeBtn = screen.getByTestId('p1-item-remove-btn');
        fireEvent.click(removeBtn);

        const cartItems = screen.getByTestId('cart-items');
        expect(cartItems.children.length).toBe(0);
      }
    });

    it('총액이 올바르게 계산되는지 확인', () => {
      if (type === 'origin') {
        sel.value = 'p1';
        addBtn.click();
        addBtn.click();
        expect(sum.textContent).toContain('총액: 20000원(포인트: 90)');
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품1 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p1' } });

        // 상품1 +1 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);
        fireEvent.click(addButton);

        const sum = screen.getByTestId('cart-total');
        expect(sum.textContent).toContain('총액: 20000원(포인트: 90)');
      }
    });

    it('할인이 올바르게 적용되는지 확인', () => {
      if (type === 'origin') {
        sel.value = 'p1';
        for (let i = 0; i < 10; i++) {
          addBtn.click();
        }
        expect(sum.textContent).toContain('(10.0% 할인 적용)');
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품1 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p1' } });

        // 상품1 +1 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        for (let i = 0; i < 10; i++) {
          fireEvent.click(addButton);
        }

        const sum = screen.getByTestId('cart-total');
        expect(sum.textContent).toContain('(10.0% 할인 적용)');
      }
    });

    it('포인트가 올바르게 계산되는지 확인', () => {
      if (type === 'origin') {
        sel.value = 'p2';
        addBtn.click();
        expect(document.getElementById('loyalty-points').textContent).toContain(
          '(포인트: 935)'
        );
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품2 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p2' } });

        // 상품2 +1 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        // 포인트 검증
        const pointLabel = screen.getByTestId('loyalty-points');
        expect(pointLabel.textContent).toContain('(포인트: 935)');
      }
    });

    it('번개세일 기능이 정상적으로 동작하는지 확인', () => {
      if (type === 'origin') return;

      // 1. 모킹 스토어 설정
      const mockStore = configureMockStore();
      // 2. 모킹된 초기 상태 정의
      const store = mockStore({
        cart: {
          items: [],
          totalPrice: 0,
          discountedPrice: 0,
          discount: 0,
          point: 0,
          lastPickItemId: 'p1',
        },
        productStore: {
          productsList: [
            {
              id: 'p1',
              name: '상품1',
              price: 10000,
              quantity: 50,
              discount: 0.1,
            },
          ],
        },
      });

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Given: 랜덤 요소 모킹
      const mockRandomValue = 0; // 첫 번째 제품 선택
      vi.spyOn(Math, 'random').mockReturnValue(mockRandomValue);

      // Given: 번개세일 확률 모킹
      global.LIGHTNING_SALE_PROBABILITY = 1;

      // When: 번개세일 인터벌 실행 및 타이머 경과
      vi.advanceTimersByTime(LIGHTNING_SALE_DELAY); // 첫 번째 setTimeout 경과
      vi.advanceTimersByTime(LIGHTNING_SALE_INTERVAL); // 첫 번째 setInterval 경과

      // Then: 번개세일 팝업 / 셀렉트박스 업데이트 확인
      expect(window.alert).toHaveBeenCalledWith(
        `번개세일! 상품1이(가) 20% 할인 중입니다!`
      );
    });

    it('추천 상품 알림이 표시되는지 확인', () => {
      if (type === 'origin') return;

      // 1. 모킹 스토어 설정
      const mockStore = configureMockStore();
      // 2. 모킹된 초기 상태 정의
      const store = mockStore({
        cart: {
          items: [],
          totalPrice: 0,
          discountedPrice: 0,
          discount: 0,
          point: 0,
          lastPickItemId: 'p2',
        },
        productStore: {
          productsList: [
            {
              id: 'p1',
              name: '상품1',
              price: 10000,
              quantity: 50,
              discount: 0.1,
            },
            {
              id: 'p2',
              name: '상품1',
              price: 10000,
              quantity: 0,
              discount: 0.25,
            },
          ],
        },
      });

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      // Given: 랜덤 요소 모킹

      // When: 번개세일 인터벌 실행 및 타이머 경과
      vi.advanceTimersByTime(SUGGESTION_DISCOUNT_DELAY); // 첫 번째 setTimeout 경과
      vi.advanceTimersByTime(SUGGESTION_DISCOUNT_INTERVAL); // 첫 번째 setInterval 경과

      // Then: 번개세일 팝업 / 셀렉트박스 업데이트 확인
      expect(window.alert).toHaveBeenCalledWith(
        `상품1은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
      );
    });

    it('화요일 할인이 적용되는지 확인', () => {
      const mockDate = new Date('2024-10-15'); // 화요일
      vi.setSystemTime(mockDate);

      if (type === 'origin') {
        sel.value = 'p1';
        addBtn.click();
        expect(document.getElementById('cart-total').textContent).toContain(
          '(10.0% 할인 적용)'
        );
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품1 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p1' } });

        // 상품1 +1 버튼을 클릭
        const addButton = screen.getByTestId('add-to-cart');
        fireEvent.click(addButton);

        // 장바구니 총액 라벨 검증
        const cartTotalLabel = screen.getByTestId('cart-total');
        expect(cartTotalLabel.textContent).toContain('(10.0% 할인 적용)');
      }
    });

    it('재고가 부족한 경우 추가되지 않는지 확인', () => {
      if (type === 'origin') {
        // p4 상품 선택 (재고 없음)
        sel.value = 'p4';
        addBtn.click();

        // p4 상품이 장바구니에 없는지 확인
        const p4InCart = Array.from(cartDisp.children).some(
          (item) => item.id === 'p4'
        );
        expect(p4InCart).toBe(false);
        expect(stockInfo.textContent).toContain('상품4: 품절');
      }

      if (type === 'advanced') {
        render(<App />);

        // 셀렉트박스 상품4 선택
        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p4' } });

        // 상품4 장바구니에 없는지 확인
        const cartItems = screen.getByTestId('cart-items');
        const p4InCart = within(cartItems).queryByTestId('p4');
        expect(p4InCart).toBeNull();

        // 재고 업데이트 확인
        const stockLabel = screen.getByTestId('stock-status');
        expect(stockLabel.textContent).toContain('상품4: 품절');
      }
    });

    it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
      if (type === 'origin') {
        sel.value = 'p5';
        addBtn.click();

        // p5 상품이 장바구니에 추가되었는지 확인
        const p5InCart = Array.from(cartDisp.children).some(
          (item) => item.id === 'p5'
        );
        expect(p5InCart).toBe(true);

        // 수량 증가 버튼 찾기
        const increaseBtn = cartDisp.querySelector(
          '#p5 .quantity-change[data-change="1"]'
        );
        expect(increaseBtn).not.toBeNull();

        // 수량을 10번 증가시키기
        for (let i = 0; i < 10; i++) {
          increaseBtn.click();
        }

        // 11번째 클릭 시 재고 부족 알림이 표시되어야 함
        increaseBtn.click();

        // 재고 부족 알림이 표시되었는지 확인
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('재고가 부족합니다')
        );

        // 장바구니의 상품 수량이 10개인지 확인
        const itemQuantity = cartDisp.querySelector('#p5 span').textContent;
        expect(itemQuantity).toContain('x 10');

        // 재고 상태 정보에 해당 상품이 재고 부족으로 표시되는지 확인
        expect(stockInfo.textContent).toContain('상품5: 품절');
      }

      if (type === 'advanced') {
        render(<App />);

        const selectBox = screen.getByTestId('product-select');
        fireEvent.change(selectBox, { target: { value: 'p5' } });

        const addBtn = screen.getByTestId('add-to-cart');
        fireEvent.click(addBtn);

        // p5 상품이 장바구니에 추가되었는지 확인
        const cart = screen.getByTestId('cart-items');
        const p5InCart = within(cart).queryByTestId('p5');
        expect(p5InCart).toBeInTheDocument();

        // 수량 증가 버튼 찾기
        const p5IncreaseBtn = within(p5InCart).getByTestId(
          'p5-item-increase-btn'
        );
        expect(p5IncreaseBtn).not.toBeNull();

        // 수량을 10번 증가시키기
        for (let i = 0; i < 10; i++) {
          fireEvent.click(p5IncreaseBtn);
        }

        // 11번째 클릭 시 재고 부족 알림이 표시되어야 함
        p5IncreaseBtn.click();

        // 재고 부족 알림이 표시되었는지 확인
        expect(window.alert).toHaveBeenCalledWith(
          expect.stringContaining('재고가 부족합니다')
        );

        // 장바구니의 p5 상품 수량이 10개인지 확인
        const p5InCartLabel = within(p5InCart).getByRole('p5-cart-data-label');
        expect(p5InCartLabel.textContent).toContain('x 10');

        // 재고 상태 정보에 해당 상품이 재고 부족으로 표시되는지 확인
        const stockLabel = screen.getByTestId('stock-status');
        expect(stockLabel.textContent).toContain('상품5: 품절');
      }
    });

    it('상품이 선택되면 액션이 호출되는지 확인', () => {
      if (type === 'origin') return;
      const mockStore = configureMockStore();
      const store = mockStore({
        cart: {
          lastPickItemId: 'p1',
          items: [],
          totalPrice: 0,
          discountedPrice: 0,
        },
        productStore: {
          productsList: [
            {
              id: 'p1',
              name: '상품1',
              price: 10000,
              quantity: 50,
              discount: 0.1,
            },
          ],
        },
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <CartSelectBox
            productList={store.getState().productStore.productsList}
          />
        </Provider>
      );

      // select 박스에서 값 변경 시 액션 호출 테스트
      const select = getByTestId('product-select');
      fireEvent.change(select, { target: { value: 'p1' } });

      // 액션이 디스패치되었는지 확인
      const actions = store.getActions();
      expect(actions).toEqual([pickItemId({ id: 'p1' })]);
    });
  });
});
