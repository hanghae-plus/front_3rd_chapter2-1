import { PRODUCTS, LIGHTNING_SALE_INTERVAL, SUGGESTION_INTERVAL } from './src/constants';
import { ProductManager } from './src/managers/ProductManager';
import { CartManager } from './src/managers/CartManager';
import { UIManager } from './src/managers/UIManager';


export function main() {
  const root = document.getElementById('app');
  const productManager = new ProductManager(PRODUCTS);
  const cartManager = new CartManager(productManager);
  const uiManager = new UIManager(root, productManager, cartManager);

  uiManager.initialize();

  let lastSelectedProduct = null;

  setInterval(() => {
    const lightningSaleProduct = productManager.applyLightningSale();
    if (lightningSaleProduct) {
      uiManager.showLightningSale(lightningSaleProduct);
    }
  }, LIGHTNING_SALE_INTERVAL);

  setInterval(() => {
    if (lastSelectedProduct) {
      const suggestedProduct = productManager.getSuggestion(lastSelectedProduct);
      if (suggestedProduct) {
        uiManager.showSuggestion(suggestedProduct);
      }
    }
  }, SUGGESTION_INTERVAL);

  uiManager.elements.addButton.addEventListener('click', () => {
    lastSelectedProduct = uiManager.elements.productSelect.value;
  });
}

main();