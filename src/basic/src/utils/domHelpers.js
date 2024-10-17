export function createElement(tag, className, textContent, id) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (textContent) element.textContent = textContent;
    if (id) element.id = id;
    return element;
  }