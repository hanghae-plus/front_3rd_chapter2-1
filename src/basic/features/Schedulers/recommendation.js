import { updateSelectOptions } from "../Cart/updateSelectOptions";
import { getLastSelectedItem } from "../../stores/lastSelectedProductStore";
import { getProductList } from "../../stores/productListStore";

export function recommendation() {
  const delay = Math.random() * 20000;
  const interval = 60000;
  setTimeout(() => {
    setInterval(recommendationInterval, interval);
  }, delay);
}

function recommendationInterval() {
  const lastSelectedItem = getLastSelectedItem();
  const productList = getProductList();
  let suggest = productList.find((item) => item.id !== lastSelectedItem && item.quantity > 0);
  if (suggest) {
    alert(suggest.name + "은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!");
    suggest.val = Math.round(suggest.price * 0.95);
    updateSelectOptions();
  }
}
