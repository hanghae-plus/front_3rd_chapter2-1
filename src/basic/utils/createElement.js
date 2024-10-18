export const createElement = (type, { id, className = '', textContent = '', dataSet = {} }) => {
  const element = document.createElement(type);

  if (id) element.id = id;
  if (className) element.className = className;
  if (textContent) element.textContent = textContent;

  Object.keys(dataSet).forEach((key) => {
    element.dataset[key] = dataSet[key];
  });

  return element;
};
