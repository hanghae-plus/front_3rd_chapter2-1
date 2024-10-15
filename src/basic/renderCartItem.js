import { createDiv, createQuantityChangeBtn, createRemoveBtn, createSpan } from './createElements';

const renderCartItem = ({ id, name, val }) => {
  const $wrap = createDiv({ id, className: 'flex justify-between items-center mb-2' });
  const $newCartSpan = createSpan({ text: `${name} - ${val}원 x 1` });
  const $buttonWrap = createDiv();
  const $minusBtn = createQuantityChangeBtn({ id, text: '-', changeValue: '-1' });
  const $plusBtn = createQuantityChangeBtn({ id, text: '+', changeValue: '1' });
  const $removeBtn = createRemoveBtn({ id, text: '+', changeValue: '1' });

  $buttonWrap.appendChild($minusBtn);
  $buttonWrap.appendChild($plusBtn);
  $buttonWrap.appendChild($removeBtn);

  $wrap.appendChild($newCartSpan);
  $wrap.appendChild($buttonWrap);

  return $wrap;
};

export default renderCartItem;
