import { createOption } from './createElements';

function updateSelectOptions($select, productList) {
  if (!$select) return null;

  $select.innerHTML = '';
  productList.forEach((item) => {
    const { id, name, val, q } = item;
    const opt = createOption({ val: id, text: `${name} - ${val}원`, disabled: q === 0 });

    $select.appendChild(opt);
  });
}

export default updateSelectOptions;
