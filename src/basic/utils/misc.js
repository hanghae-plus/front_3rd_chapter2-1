export function getItemQuentity(item) {
  if (!item) {
    return 0;
  }
  return parseInt(item.querySelector('span').textContent.split('x ')[1]);
}

export function isTuesday() {
  return new Date().getDay() === 2;
}
