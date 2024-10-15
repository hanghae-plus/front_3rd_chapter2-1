function createElement(tagName) {
  return document.createElement(tagName);
}

function getElementById(id) {
  return document.getElementById(id);
}

function setId(element, id) {
  element.id = id;
}

function setClassName(element, className) {
  element.className = className;
}

function setTextContent(element, textContent) {
  element.textContent = textContent;
}

function appendChildren(parent, ...children) {
  children.forEach(child => parent.appendChild(child));
}


export { createElement, getElementById, setId, setClassName, setTextContent, appendChildren };