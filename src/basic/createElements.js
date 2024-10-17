const createElement = (tagName, { id, className, text, value, disabled }) => {
  const element = document.createElement(tagName);
  if (id) element.id = id;
  if (className) element.className = className;
  if (text) element.textContent = text;
  if (value !== undefined) element.value = value;
  if (disabled !== undefined) element.disabled = disabled;
  return element;
};

export const createTitle = (text) => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    text: text
  });
};

export const createButton = ({ id, className = '', text }) => {
  const defaultClass = 'bg-blue-500 text-white px-4 py-2 rounded';
  return createElement('button', {
    id,
    className: `${defaultClass} ${className}`,
    text: text
  });
};

export const createSpan = ({ id, className, text }) => {
  return createElement('span', { id, className, text });
};

export const createDiv = ({ id, className }) => {
  return createElement('div', { id, className });
};

export const createSelect = ({ id, className }) => {
  return createElement('select', { id, className });
};

export const createOptions = ({ price, text, disabled }) => {
  return createElement('option', {
    value: price,
    text: text,
    disabled: disabled
  });
};
