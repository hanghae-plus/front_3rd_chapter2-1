import { updateSelectOptions } from "./product";

const randomDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const { products } = store.getState();
      const updatedProducts = [...products];
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        const productIndex = updatedProducts.findIndex((product) => product.id === luckyItem.id);
        updatedProducts[productIndex] = { ...luckyItem, value: Math.round(luckyItem.value * 0.8) };
        store.setState({ ...store.getState(), products: updatedProducts });

        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
};

const suggestDiscount = () => {
  setTimeout(() => {
    setInterval(() => {
      const { products, lastSelectItem } = store.getState();
      const updatedProducts = [...products];

      if (lastSelectItem) {
        const suggest = products.find((item) => item.id !== lastSelectItem && item.quantity > 0);
        if (suggest) {
          const productIndex = updatedProducts.findIndex((product) => product.id === suggest.id);
          updatedProducts[productIndex] = { ...suggest, value: Math.round(suggest.value * 0.95) };
          store.setState({ ...store.getState(), products: updatedProducts });

          alert(`${suggest.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

export const renderDiscounts = () => {
  randomDiscount();
  suggestDiscount();
};
