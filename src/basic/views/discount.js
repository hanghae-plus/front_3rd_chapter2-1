import { renderTextContent } from './shared';

export const createDiscountInfo = (discountRate) => {
  const span = document.createElement('span');
  span.className = 'text-green-500 ml-2';
  renderTextContent(span, `(${(discountRate * 100).toFixed(1)}% 할인 적용)`);
  return span;
};
