const setProps = ($element, props) => {
  Object.keys(props).forEach((key) => {
    const value = props[key];

    if (key === 'className') {
      $element.className = value;
    } else if (key === 'textContent') {
      $element.textContent = value;
    } else if (key === 'value' && $element.nodeName === 'SELECT') {
      $element.value = value;
    } else {
      $element.setAttribute(key, value);
    }
  });
};

export const createElement = (type, props = {}) => {
  const $element = document.createElement(type);

  setProps($element, props);

  return $element;
};
