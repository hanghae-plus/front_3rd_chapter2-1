export const getTargetItemElementQuantity = ($targetItemElement) => {
  return parseInt($targetItemElement.querySelector('span').textContent.split('x ')[1]);
};
