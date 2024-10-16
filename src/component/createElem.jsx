

const createElem = (tag, attributes = {}, text = '') => {
  const element = document.createElement(tag);
  Object.keys(attributes).forEach((key) => {
    if (key === 'className') {
      element.className = attributes[key]; // className을 직접 할당
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });
  if (text) element.textContent = text;
  return element;
};

export default createElem;