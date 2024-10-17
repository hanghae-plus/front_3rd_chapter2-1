const createElement = (tagName, { id, className, text, value, disabled }) => {
  const element = document.createElement(tagName);
  if (id) element.id = id;
  if (className) element.className = className;
  if (text) element.textContent = text;
  if (value !== undefined) element.value = value;
  if (disabled !== undefined) element.disabled = disabled;
  return element;
};
