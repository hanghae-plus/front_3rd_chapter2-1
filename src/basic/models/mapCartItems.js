/**
 * @function mapCartItems
 * @description 장바구니의 DOM 요소로부터 상품 아이템 목록을 추출하고 매핑하는 함수 
 * @param {Element} cartsDiv - 장바구니 아이템들이 포함된 DOM 컨테이너 요소
 * @param {Array<Object>} prodList - 모든 상품 정보를 포함한 배열
 * @returns {Array<Object>} 각 상품 정보를 담은 새 배열을 반환
 */

export const mapCartItems = (cartsDiv, prodList) => {
  const elements = Array.from(cartsDiv.children);
  return elements.map((element) => {
    const id = element.id;
    const product = findProductById(prodList, id);
    const quantity = extractQuantity(element);

    return { ...product, quantity: quantity };
  });
};

/**
 * @function findProductById
 * @description 주어진 ID에 해당하는 상품을 찾아 반환
 * 
 * @param {Array<Object>} prodList - 상품 목록
 * @param {string} id - 찾고자 하는 상품의 ID
 * @returns {Object} 상품 객체
 */

function findProductById(prodList, id) {
  return prodList.find((product) => product.id === id);
}

/**
 * @function extractQuantity
 * @description 주어진 엘리먼트에서 상품 수량 추출
 * 
 * @param {Element} element - 상품 정보가 담긴 DOM 엘리먼트
 * @returns {number} 상품 수량
 */

function extractQuantity(element) {
  const quantityText = element.querySelector('span').textContent;
  return parseInt(quantityText.split('x ')[1]);
}