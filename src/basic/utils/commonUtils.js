/**
 * 주어진 확귤에 따라 true/false를 반환합니다
 *
 * @param {number} percentage - 0에서 100 사이의 확률
 * @returns {boolean} 주어진 확률에 따른 결과
 */
const probability = (percentage = 0) => {
  return Math.random() < percentage / 100;
};

/**
 * 주어진 배열에서 무작위로 하나의 항목을 선택해서 반환합니다
 *
 * @param {Array} array
 * @returns {*} 무작위로 선택된 항목
 */
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * 주어진 가격에 할인율을 적용하여 할인된 가격을 반환합니다
 *
 * @param {number} price - 원래 가격
 * @param {number} [percentage=0] - 적용할 할인율 (0부터 100 사이의 값, 기본값은 0)
 * @returns {number} 할인이 적용된 가격
 */
const discountPrice = (price, percentage = 0) => {
  return price * (1 - percentage / 100);
};

/**
 * 지정된 시간(밀리초) 동안 실행을 지연시키는 Promise를 반환합니다
 *
 * @param {number} [delay=0] - 지연 시간 (밀리초)
 * @returns {Promise<void>} 지정된 시간 후에 resolve되는 Promise
 */
const sleep = (delay = 0) => {
  return new Promise((resolve) => setTimeout(resolve, delay));
};

export { probability, getRandomItem, discountPrice, sleep };
