import { updateSelectOptions } from "../Cart/updateSelectOptions";
import { getProductList } from "../../stores/productListStore";

// 랜덤 할인
export const randomDiscount = () => {
  const delay = Math.random() * 10000;
  const interval = 30000;
  setTimeout(() => {
    setInterval(randomDiscountInterval, interval);
  }, delay);
};

// 랜덤 할인 주기
const randomDiscountInterval = () => {
  const productList = getProductList();
  let luckyItem = productList[Math.floor(Math.random() * productList.length)];
  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.8);
    alert("번개세일! " + luckyItem.name + "이(가) 20% 할인 중입니다!");
    updateSelectOptions();
  }
};
