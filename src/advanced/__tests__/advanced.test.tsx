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

    // // 2. select 요소가 존재하는지 확인 (aria-label 또는 접근 가능한 이름 사용)
    // const select = screen.getByRole('combobox', { name: /상품을 선택하세요/i });
    // expect(select).toBeInTheDocument();

    // 3. '추가' 버튼이 존재하는지 확인
    const addButton = screen.getByRole('button', { name: /추가/i });
    expect(addButton).toBeInTheDocument();

    // // 4. 장바구니 항목이 표시되는 영역이 존재하는지 확인
    // const cartItems = screen.getByTestId('cart-items');
    // expect(cartItems).toBeInTheDocument();

    // // 5. 총액이 표시되는 영역이 존재하는지 확인
    // const cartTotal = screen.getByTestId('cart-total');
    // expect(cartTotal).toBeInTheDocument();

    // // 6. 재고 상태가 표시되는 영역이 존재하는지 확인
    // const stockStatus = screen.getByTestId('stock-status');
    // expect(stockStatus).toBeInTheDocument();
  });

  it('상품을 추가하고 장바구니에 추가된 것을 확인', () => {
    // 상품 선택 드롭다운 찾기
    // const select = screen.getByRole('select', { name: /상품을 선택하세요/i });

    // // 첫 번째 상품 선택
    // fireEvent.change(select, { target: { value: 'p1' } });

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
    // const select = screen.getByRole('select', { name: /상품을 선택하세요/i });

    // // 두 번째 상품 선택
    // fireEvent.change(select, { target: { value: 'p2' } });

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
    // const totalAmount = screen.getByText(/총액: 0원/i);
    // expect(totalAmount).toBeInTheDocument();

    // // 포인트 확인 (0으로 돌아감)
    // const bonusPoints = screen.getByText(/\(포인트: 0\)/i);
    // expect(bonusPoints).toBeInTheDocument();
  });
});
