// 요소 생성 헬퍼 함수
export const createElement = (tag, textContent = '', className = '', attributes = {}) => {
  const element = document.createElement(tag);
  element.textContent = textContent;
  element.className = className;
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
};

// 버튼 생성 함수
export const createButton = (text, productId, change, className) => {
  const attributes = { 'data-product-id': productId };
  if (change) {
    attributes['data-change'] = change;
  }
  return createElement('button', text, className, attributes);
};
