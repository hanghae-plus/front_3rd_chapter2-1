import { subscribeToProductList, getProductList } from "../../stores/productListStore";

export const updateSelectOptions = () => {
  const selectWrap = document.getElementById("product-select");

  // 상품 목록 렌더링
  const renderOptions = () => {
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
  };

  renderOptions();

  subscribeToProductList(renderOptions);
};
