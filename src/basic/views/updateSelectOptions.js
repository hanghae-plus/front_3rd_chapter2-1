import { createOptions } from '../createElements';
import { prodList } from '../constants/prodList';

/**
 * @function updateSelectOptions
 * @description select 요소를 업데이트하여 사용 가능한 상품 목록 표시
 * 각 상품에 대해 활성화 또는 비활성화 상태에 따라 option 요소를 생성하고 select 요소에 추가
 * @param {HTMLElement} sel - 업데이트할 select HTML 요소.
 */

function updateSelectOptions(select) {
  if (!select) {return;}

  select.innerHTML = '';
  prodList.forEach((item) => {
    const { id, name, price, quantity } = item;
    const option = createOptions({
      price: id,
      text: `${name} - ${price}원`,
      disabled: quantity === 0,
    });
    select.appendChild(option);
  });
}

export default updateSelectOptions;
