import { createOption } from './createElements';

function updateSelOpts(sel, prodList) {
  if (!sel) return null;

  sel.innerHTML = '';
  prodList.forEach((item) => {
    const { id, name, val, q } = item;
    const opt = createOption({ val: id, text: `${name} - ${val}원`, disabled: q === 0 });

    sel.appendChild(opt);
  });
}

export default updateSelOpts;
