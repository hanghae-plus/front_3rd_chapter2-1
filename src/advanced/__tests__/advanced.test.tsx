import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from '../src/App';
import '@testing-library/jest-dom';
import React from 'react';

describe('advanced test', () => {
  beforeEach(() => {
    render(<App />);

    vi.useFakeTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    // 1. h1 요소가 '장바구니' 텍스트를 가지고 있는지 확인
    const heading = screen.getByRole('heading', { name: /장바구니/i });
    expect(heading).toBeInTheDocument();

    // 2. select 요소가 존재하는지 확인 (aria-label 또는 접근 가능한 이름 사용)
    const select = screen.getByRole('combobox', { name: /상품을 선택하세요/i });
    expect(select).toBeInTheDocument();

    // 3. '추가' 버튼이 존재하는지 확인
    const addButton = screen.getByRole('button', { name: /추가/i });
    expect(addButton).toBeInTheDocument();

    // 4. 장바구니 항목이 표시되는 영역이 존재하는지 확인
    const cartItems = screen.getByTestId('cart-items');
    expect(cartItems).toBeInTheDocument();

    // 5. 총액이 표시되는 영역이 존재하는지 확인
    const cartTotal = screen.getByTestId('cart-total');
    expect(cartTotal).toBeInTheDocument();

    // 6. 재고 상태가 표시되는 영역이 존재하는지 확인
    const stockStatus = screen.getByTestId('stock-status');
    expect(stockStatus).toBeInTheDocument();
  });
  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    // h1 요소 확인
    const heading = screen.getByRole('heading', { name: /장바구니/i });
    expect(heading).toBeInTheDocument();

    // select 요소 확인
    const select = screen.getByRole('combobox', { name: /상품을 선택하세요/i });
    expect(select).toBeInTheDocument();

    // '추가' 버튼 확인
    const addButton = screen.getByRole('button', { name: /추가/i });
    expect(addButton).toBeInTheDocument();

    // 장바구니 항목 영역 확인
    const cartItems = screen.getByTestId('cart-items');
    expect(cartItems).toBeInTheDocument();

    // 총액 영역 확인
    const cartTotal = screen.getByTestId('cart-total');
    expect(cartTotal).toBeInTheDocument();

    // 재고 상태 영역 확인
    const stockStatus = screen.getByTestId('stock-status');
    expect(stockStatus).toBeInTheDocument();
  });

  it('상품을 추가하고 장바구니에 추가된 것을 확인', () => {
    // 상품 선택 드롭다운 찾기
    const select = screen.getByRole('combobox', { name: /상품을 선택하세요/i });

    // 첫 번째 상품 선택
    fireEvent.change(select, { target: { value: 'p1' } });

    // '추가' 버튼 클릭
    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 장바구니에 상품이 추가되었는지 확인
    const cartItem = screen.getByText(/상품1 - 10000원 x 1/i);
    expect(cartItem).toBeInTheDocument();

    // 총액 확인
    const totalAmount = screen.getByText(/총액: 10000원/i);
    expect(totalAmount).toBeInTheDocument();

    // 포인트 확인
    const bonusPoints = screen.getByText(/\(포인트: 10\)/i);
    expect(bonusPoints).toBeInTheDocument();
  });

  it('상품을 추가하고 삭제하여 장바구니에서 제거하는 것을 확인', () => {
    // 상품 선택 드롭다운 찾기
    const select = screen.getByRole('combobox', { name: /상품을 선택하세요/i });

    // 두 번째 상품 선택
    fireEvent.change(select, { target: { value: 'p2' } });

    // '추가' 버튼 클릭
    const addButton = screen.getByRole('button', { name: /추가/i });
    fireEvent.click(addButton);

    // 장바구니에 상품이 추가되었는지 확인
    const cartItem = screen.getByText(/상품2 - 20000원 x 1/i);
    expect(cartItem).toBeInTheDocument();

    // 삭제 버튼 클릭
    const deleteButton = screen.getByRole('button', { name: /삭제/i });
    fireEvent.click(deleteButton);

    // 장바구니에서 상품이 제거되었는지 확인
    expect(cartItem).not.toBeInTheDocument();

    // 총액 확인 (0원으로 돌아감)
    const totalAmount = screen.getByText(/총액: 0원/i);
    expect(totalAmount).toBeInTheDocument();

    // 포인트 확인 (0으로 돌아감)
    const bonusPoints = screen.getByText(/\(포인트: 0\)/i);
    expect(bonusPoints).toBeInTheDocument();
  });
  //   it('상품을 장바구니에 추가할 수 있는지 확인', () => {
  //     sel.value = 'p1';
  //     addBtn.click();
  //     expect(cartDisp.children.length).toBe(1);
  //     expect(cartDisp.children[0].querySelector('span').textContent).toContain(
  //       '상품1 - 10000원 x 1'
  //     );
  //   });
  //   it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
  //     const increaseBtn = cartDisp.querySelector('.quantity-change[data-change="1"]');
  //     increaseBtn.click();
  //     expect(cartDisp.children[0].querySelector('span').textContent).toContain(
  //       '상품1 - 10000원 x 2'
  //     );
  //   });
  //   it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
  //     sel.value = 'p1';
  //     addBtn.click();
  //     const removeBtn = cartDisp.querySelector('.remove-item');
  //     removeBtn.click();
  //     expect(cartDisp.children.length).toBe(0);
  //   });
  //   it('총액이 올바르게 계산되는지 확인', () => {
  //     sel.value = 'p1';
  //     addBtn.click();
  //     addBtn.click();
  //     expect(sum.textContent).toContain('총액: 20000원(포인트: 90)');
  //   });
  //   it('할인이 올바르게 적용되는지 확인', () => {
  //     sel.value = 'p1';
  //     for (let i = 0; i < 10; i++) {
  //       addBtn.click();
  //     }
  //     expect(sum.textContent).toContain('(10.0% 할인 적용)');
  //   });
  //   it('포인트가 올바르게 계산되는지 확인', () => {
  //     sel.value = 'p2';
  //     addBtn.click();
  //     expect(document.getElementById('loyalty-points').textContent).toContain('(포인트: 935)');
  //   });
  //   it('번개세일 기능이 정상적으로 동작하는지 확인', () => {
  //     // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
  //   });
  //   it('추천 상품 알림이 표시되는지 확인', () => {
  //     // 일부러 랜덤이 가득한 기능을 넣어서 테스트 하기를 어렵게 만들었습니다. 이런 코드는 어떻게 하면 좋을지 한번 고민해보세요!
  //   });
  //   it('화요일 할인이 적용되는지 확인', () => {
  //     const mockDate = new Date('2024-10-15'); // 화요일
  //     vi.setSystemTime(mockDate);
  //     sel.value = 'p1';
  //     addBtn.click();
  //     expect(document.getElementById('cart-total').textContent).toContain('(10.0% 할인 적용)');
  //   });
  //   it('재고가 부족한 경우 추가되지 않는지 확인', () => {
  //     // p4 상품 선택 (재고 없음)
  //     sel.value = 'p4';
  //     addBtn.click();
  //     // p4 상품이 장바구니에 없는지 확인
  //     const p4InCart = Array.from(cartDisp.children).some((item) => item.id === 'p4');
  //     expect(p4InCart).toBe(false);
  //     expect(stockInfo.textContent).toContain('상품4: 품절');
  //   });
  //   it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
  //     sel.value = 'p5';
  //     addBtn.click();
  //     // p5 상품이 장바구니에 추가되었는지 확인
  //     const p5InCart = Array.from(cartDisp.children).some((item) => item.id === 'p5');
  //     expect(p5InCart).toBe(true);
  //     // 수량 증가 버튼 찾기
  //     const increaseBtn = cartDisp.querySelector('#p5 .quantity-change[data-change="1"]');
  //     expect(increaseBtn).not.toBeNull();
  //     // 수량을 10번 증가시키기
  //     for (let i = 0; i < 10; i++) {
  //       increaseBtn.click();
  //     }
  //     // 11번째 클릭 시 재고 부족 알림이 표시되어야 함
  //     increaseBtn.click();
  //     // 재고 부족 알림이 표시되었는지 확인
  //     expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));
  //     // 장바구니의 상품 수량이 10개인지 확인
  //     const itemQuantity = cartDisp.querySelector('#p5 span').textContent;
  //     expect(itemQuantity).toContain('x 10');
  //     // 재고 상태 정보에 해당 상품이 재고 부족으로 표시되는지 확인
  //     expect(stockInfo.textContent).toContain('상품5: 품절');
  //   });
  // });
});
