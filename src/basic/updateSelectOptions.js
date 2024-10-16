import { createOption } from './createElements';
import { productList } from './global';

function updateSelectOptions() {
  const $select = document.getElementById('product-select');
  if (!$select) return null;

  $select.innerHTML = '';
  productList.toObject().forEach((item) => {
    const { id, name, price, quantity } = item;
    const opt = createOption({ val: id, text: `${name} - ${price}원`, disabled: quantity === 0 });

    $select.appendChild(opt);
  });
}

export default updateSelectOptions;
