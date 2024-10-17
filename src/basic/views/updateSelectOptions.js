import { createOptions } from "../createElements";
import { prodList } from "../constants/prodList";

/**
 * @function updateSelectOptions
 * @description select 요소를 업데이트하여 사용 가능한 상품 목록 표시
 * 각 상품에 대해 활성화 또는 비활성화 상태에 따라 option 요소를 생성하고 select 요소에 추가
 * @param {HTMLElement} sel - 업데이트할 select HTML 요소.
 */

function updateSelectOptions(sel) {
  if (!sel) return;

  sel.innerHTML = '';
  prodList.forEach((item) => {
    const { id, name, val, q } = item;
    const opt = createOptions({ val: id, text: `${name} - ${val}원`, disabled: q === 0 });
    sel.appendChild(opt);
  });
}

export default updateSelectOptions;
