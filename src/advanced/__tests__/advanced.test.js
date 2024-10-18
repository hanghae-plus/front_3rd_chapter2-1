import { beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { useLuckySale } from "../src/services/useLuckySale.ts";
describe('advanced test', () => {
  describe.each([
    { type: 'origin', loadFile: () => import('../../main.js') },
    { type: 'advanced', loadFile: () => import('../src/main.advanced.tsx') },
  ])('$type 장바구니 시나리오 테스트', ({ loadFile }) => {
    let sel, addBtn, cartDisp, sum, stockInfo;

    beforeAll(async () => {
      // DOM 초기화
      document.body.innerHTML = '<div id="root"></div>';
      await loadFile();

      // 전역 변수 참조
      sel = document.getElementById('product-select');
      addBtn = document.getElementById('add-to-cart');
      cartDisp = document.getElementById('cart-items');
      sum = document.getElementById('cart-total');
      stockInfo = document.getElementById('stock-status');
    });

    beforeEach(() => {
      vi.useFakeTimers();
      vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('번개세일 기능이 정상적으로 동작하는지 확인', async () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0.1);
      global.prodList = [
        { id: 'p1', name: '상품1', price: 10000, quantity: 10 },
        { id: 'p2', name: '상품2', price: 20000, quantity: 5 }
      ];

      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
      await useLuckySale();
    
      vi.runAllTimers();
    
      expect(global.prodList[0].price).toBe(8000);ㅌ
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('번개세일! 상품1이(가) 20% 할인 중입니다!'));

      vi.restoreAllMocks();
    });

    it('추천 상품 알림이 표시되는지 확인', async () => {
      vi.spyOn(global.Math, 'random').mockReturnValue(0);
      global.prodList = [
        { id: 'p1', name: '상품1', price: 10000, quantity: 0 },
        { id: 'p2', name: '상품2', price: 20000, quantity: 5 },
        { id: 'p3', name: '상품3', price: 30000, quantity: 10 }
      ];
    
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
      await useRecommendPromotion('p1');
    
      vi.runAllTimers();

      expect(global.prodList[1].price).toBe(Math.round(20000 * 0.95));
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('상품2은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'));

      vi.restoreAllMocks();
    });
    

    it('화요일 할인이 적용되는지 확인', () => {
      const mockDate = new Date('2024-10-15'); // 화요일
      vi.setSystemTime(mockDate);
      sel.value = 'p1';
      addBtn.click();
      expect(document.getElementById('cart-total').textContent).toContain('(10.0% 할인 적용)');
    });

    it('재고가 부족한 경우 추가되지 않는지 확인', () => {
      // p4 상품 선택 (재고 없음)
      sel.value = 'p4';
      addBtn.click();

      // p4 상품이 장바구니에 없는지 확인
      const p4InCart = Array.from(cartDisp.children).some((item) => item.id === 'p4');
      expect(p4InCart).toBe(false);
      expect(stockInfo.textContent).toContain('상품4: 품절');
    });

    it('재고가 부족한 경우 추가되지 않고 알림이 표시되는지 확인', () => {
      sel.value = 'p5';
      addBtn.click();

      // p5 상품이 장바구니에 추가되었는지 확인
      const p5InCart = Array.from(cartDisp.children).some((item) => item.id === 'p5');
      expect(p5InCart).toBe(true);

      // 수량 증가 버튼 찾기
      const increaseBtn = cartDisp.querySelector('#p5 .quantity-change[data-change="1"]');
      expect(increaseBtn).not.toBeNull();

      // 수량을 10번 증가시키기
      for (let i = 0; i < 10; i++) {
        increaseBtn.click();
      }

      // 11번째 클릭 시 재고 부족 알림이 표시되어야 함
      increaseBtn.click();

      // 재고 부족 알림이 표시되었는지 확인
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('재고가 부족합니다'));

      // 장바구니의 상품 수량이 10개인지 확인
      const itemQuantity = cartDisp.querySelector('#p5 span').textContent;
      expect(itemQuantity).toContain('x 10');

      // 재고 상태 정보에 해당 상품이 재고 부족으로 표시되는지 확인
      expect(stockInfo.textContent).toContain('상품5: 품절');
    });
  });
});
