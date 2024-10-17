import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { act } from 'react-dom/test-utils';

describe('Cart Component Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<App />);
  });

  it('초기 상태: 상품 목록이 올바르게 그려졌는지 확인', () => {
    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();
    expect(select.children.length).toBe(6); // 기본 옵션 포함

    const options = screen.getAllByRole('option');
    expect(options[1].value).toBe('p1');
    expect(options[1].textContent).toBe('상품1 - 10000원');
    expect(options[1].disabled).toBe(false);

    expect(options[5].value).toBe('p5');
    expect(options[5].textContent).toBe('상품5 - 25000원');
    expect(options[5].disabled).toBe(false);

    expect(options[4].value).toBe('p4');
    expect(options[4].textContent).toBe('상품4 - 15000원');
    expect(options[4].disabled).toBe(true);
  });

  it('초기 상태: DOM 요소가 올바르게 생성되었는지 확인', () => {
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('장바구니');
    expect(screen.getByRole('combobox')).toBeDefined();
    expect(screen.getByRole('button', { name: '추가' })).toBeDefined();
    expect(screen.getByTestId('cart-items')).toBeDefined();
    expect(screen.getByTestId('cart-total')).toBeDefined();
    expect(screen.getByTestId('stock-status')).toBeDefined();
  });

  it('상품을 장바구니에 추가할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'p1');
    await userEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      const cartItems = screen.getByTestId('cart-items');
      expect(cartItems.children.length).toBe(1);
      expect(cartItems.textContent).toContain('상품1 - 10000원 x 1');
    });
  });

  it('장바구니에서 상품 수량을 변경할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'p1');
    await userEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      const increaseButton = screen.getByRole('button', { name: '+' });
      userEvent.click(increaseButton);
      expect(screen.getByTestId('cart-items').textContent).toContain('상품1 - 10000원 x 2');
    });
  });

  it('장바구니에서 상품을 삭제할 수 있는지 확인', async () => {
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'p1');
    await userEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      const removeButton = screen.getByRole('button', { name: '삭제' });
      userEvent.click(removeButton);
      expect(screen.getByTestId('cart-items').children.length).toBe(0);
    });
  });

  it('총액이 올바르게 계산되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      expect(screen.getByTestId('cart-total').textContent).toContain('총액: 20000원');
      expect(screen.getByTestId('loyalty-points').textContent).toContain('(포인트: 20)');
    });
  });

  it('할인이 올바르게 적용되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: '추가' }));
    }

    await waitFor(() => {
      expect(screen.getByTestId('cart-total').textContent).toContain('(10.0% 할인 적용)');
    });
  });

  it('포인트가 올바르게 계산되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p2' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      expect(screen.getByTestId('loyalty-points').textContent).toContain('(포인트: 20)');
    });
  });

  it('화요일 할인이 적용되는지 확인', async () => {
    const mockDate = new Date('2024-10-15'); // 화요일
    vi.setSystemTime(mockDate);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p1' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      expect(screen.getByTestId('cart-total').textContent).toContain('(10.0% 할인 적용)');
    });
  });

  it('재고가 부족한 경우 추가되지 않는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p4' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      const cartItems = screen.getByTestId('cart-items');
      const p4InCart = Array.from(cartItems.children).some(item => item.id === 'p4');
      expect(p4InCart).toBe(false);
      expect(screen.getByTestId('stock-status').textContent).toContain('상품4: 품절');
    });
  });

  it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', async () => {
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'p5' } });
    fireEvent.click(screen.getByRole('button', { name: '추가' }));

    await waitFor(() => {
      const cartItems = screen.getByTestId('cart-items');
      const p5InCart = Array.from(cartItems.children).some(item => item.id === 'p5');
      expect(p5InCart).toBe(true);
    });

    const increaseButton = screen.getAllByRole('button', { name: '+' })[0];
    for (let i = 0; i < 10; i++) {
      fireEvent.click(increaseButton);
    }

    fireEvent.click(increaseButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));
      expect(screen.getByTestId('cart-items').textContent).toContain('상품5 - 25000원 x 10');
      expect(screen.getByTestId('stock-status').textContent).toContain('상품5: 품절');
    });
  });
});