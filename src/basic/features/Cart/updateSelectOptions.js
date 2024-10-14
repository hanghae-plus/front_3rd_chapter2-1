import { subscribeToProductList, getProductList } from "../../stores/productListStore";

export function updateSelectOptions() {
  const selectWrap = document.getElementById("product-select");

  function renderOptions() {
    const productList = getProductList();
    selectWrap.innerHTML = "";
    productList.forEach(function (item) {
      const option = document.createElement("option");
      option.value = item.id;
      if (item.quantity === 0) {
        option.disabled = true;
      }
      option.textContent = `${item.name} - ${item.price}원`;
      selectWrap.appendChild(option);
    });
  }

  // 초기 렌더링
  renderOptions();

  // 상품 목록 변경 시 업데이트
  subscribeToProductList(renderOptions);
}
