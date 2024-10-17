export function isNullish(value) {
  return value === null || value === undefined;
}

export function createElement({
  tagName = 'div',
  id = null,
  classNames = [],
  textContent = '',
}) {
  const element = document.createElement(tagName);

  if (typeof id === 'string') {
    element.id = id;
  }

  if (Array.isArray(classNames) && classNames.length > 0) {
    classNames.forEach((className) => element.classList.add(className));
  }

  if (typeof textContent === 'string' && textContent.length > 0) {
    element.textContent = textContent;
  }

  return element;
}

export function getCartInfoFromElements(cartElements = []) {
  return cartElements.map((cartElement) => {
    const count = parseInt(
      cartElement.querySelector('span').textContent.split('x ')[1]
    );
    return { productId: cartElement.id, count };
  });
}

export function checkSaleDay(saleDay) {
  const today = new Date();
  if (today.getDay() === saleDay) {
    return true;
  } else {
    return false;
  }
}
