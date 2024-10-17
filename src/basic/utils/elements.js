export const createElement = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element[key] = value;
  });
  return element;
};

export const updateSelectOptions = (options, targetElement) => {
  const fragment = document.createDocumentFragment();

  options.forEach((opt) => {
    const option = createElement('option', {
      value: opt.id,
      textContent: `${opt.name} - ${opt.val}원`,
      disabled: opt.q === 0
    });
    fragment.appendChild(option);
  });

  targetElement.innerHTML = '';
  targetElement.appendChild(fragment);
};

export const createButtonElement = (text, className, productId, change) => {
  const button = createElement('button', {
    textContent: text,
    className: `${className} bg-blue-500 text-white px-2 py-1 rounded mr-1`
  });
  button.dataset.productId = productId;
  if (change) {
    button.dataset.change = change;
  }
  return button;
};
