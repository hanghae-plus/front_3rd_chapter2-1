import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { App } from '../components/App';
import { vi } from 'vitest';

describe('advanced 장바구니 시나리오 테스트', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select).toBeDefined();
    expect(select.children.length).toBe(5);

    expect(select.children[0].textContent).toBe('상품1 - 10000원');
    expect(select.children[0].getAttribute('value')).toBe('p1');
    expect(select.children[0].getAttribute('disabled')).toBe(null);

    expect(select.children[4].textContent).toBe('상품5 - 25000원');
    expect(select.children[4].getAttribute('value')).toBe('p5');
    expect(select.children[4].getAttribute('disabled')).toBe(null);

    expect(select.children[3].textContent).toBe('상품4 - 15000원');
    expect(select.children[3].getAttribute('value')).toBe('p4');
    expect(select.children[3].getAttribute('disabled')).toBe('');
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    expect(screen.getByText('장바구니')).toBeDefined();
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByText('추가')).toBeDefined();
    expect(screen.getByTestId('cart-items')).toBeDefined();
    expect(screen.getByTestId('cart-total')).toBeDefined();
    expect(screen.getByTestId('stock-status')).toBeDefined();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    fireEvent.click(screen.getByText('추가'));
    expect(screen.getByText('상품1 - 10000원 x 1')).toBeDefined();
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    fireEvent.click(screen.getByText('추가'));
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('상품1 - 10000원 x 2')).toBeDefined();
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    fireEvent.click(screen.getByText('추가'));
    fireEvent.click(screen.getByText('삭제'));
    expect(screen.queryByText('상품1 - 10000원 x 1')).toBeNull();
  });

  it('총액이 올바르게 계산되는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    fireEvent.click(screen.getByText('추가'));
    fireEvent.click(screen.getByText('추가'));
    expect(screen.getByTestId('cart-total')).toHaveTextContent('총액: 20000원');
    expect(screen.getByTestId('cart-total')).toHaveTextContent('(포인트: 20)');
  });

  it('할인이 올바르게 적용되는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByText('추가'));
    }
    expect(screen.getByTestId('cart-total')).toHaveTextContent('(10.0% 할인 적용)');
  });

  it('포인트가 올바르게 계산되는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p2';
    fireEvent.click(screen.getByText('추가'));
    expect(screen.getByTestId('cart-total')).toHaveTextContent('(포인트: 20)');
  });

  it('화요일 할인이 적용되는지 확인', () => {
    const mockDate = new Date('2024-10-15'); // 화요일
    vi.setSystemTime(mockDate);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p1';
    fireEvent.click(screen.getByText('추가'));
    expect(screen.getByTestId('cart-total')).toHaveTextContent('(10.0% 할인 적용)');
  });

  it('재고가 부족한 경우 추가되지 않는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p4';
    fireEvent.click(screen.getByText('추가'));
    expect(screen.queryByText('상품4')).toBeNull();
    expect(screen.getByTestId('stock-status')).toHaveTextContent('상품4: 품절');
  });

  it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    select.value = 'p5';
    fireEvent.click(screen.getByText('추가'));
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getAllByText('+')[0]);
    }
    fireEvent.click(screen.getAllByText('+')[0]);
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));
    expect(screen.getByText('상품5 - 25000원 x 10')).toBeDefined();
    expect(screen.getByTestId('stock-status')).toHaveTextContent('상품5: 품절');
  });
});
