import { createElementWithProps } from '@basic/lib/dom';

/**
 * 장바구니 내부 아이템의 요소들을 가져온다.
 * @param {string} productId
 * @returns {{ itemWrap: HTMLElement, label: HTMLSpanElement, currentQty: number }}
 */
export const getCartItemDOM = (productId: string) => {
  // 장바구니 해당 제품 wrap DOM
  const itemWrap = document.getElementById(productId)!;

  // 장바구니 해당 제품 설명 span DOM
  const label = itemWrap?.querySelector('span') as HTMLSpanElement;

  // 장바구니 해당 제품 총 수량
  const currentQty = parseInt(label?.textContent?.split('x ')[1] ?? '0', 10);

  return { itemWrap, label, currentQty };
};

/**
 * 수량 변경 버튼을 생성합니다.
 * @param {string} id - 제품 ID.
 * @param {number} changeValue - 변경할 수량 (-1 또는 1).
 * @param {string} text - 버튼에 표시할 텍스트.
 * @returns {HTMLElement} 생성된 버튼 요소.
 */
export const createQuantityButton = (
  id: string,
  changeValue: number,
  text: string
) => {
  const props = {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    'data-product-id': id,
    'data-change': changeValue.toString(),
  };
  const button = createElementWithProps('button', props);

  button.textContent = text;
  return button;
};

/**
 * 삭제 버튼을 생성합니다.
 * @param {string} id - 제품 ID.
 * @returns {HTMLElement} 생성된 삭제 버튼 요소.
 */
export const createRemoveButton = (id: string) => {
  const props = {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    'data-product-id': id,
  };
  const button = createElementWithProps('button', props);

  button.textContent = '삭제';
  return button;
};

/**
 * select box에서 선택한 options id 반환
 */
export const getProductIdBySelectTag = () => {
  const selectTag = document.getElementById(
    'product-select'
  ) as HTMLSelectElement;

  return selectTag.value;
};
