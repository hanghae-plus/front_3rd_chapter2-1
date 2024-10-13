import Cart from './pages/cart/index.js';
import { cartStore } from './pages/cart/store.js';
import { registerGlobalEvents } from './utils/eventUtils.js';

const rootPage = {
  '/index.basic.html': Cart,
};

function render() {
  const { element, events } = rootPage[location.pathname]();
  const $root = document.getElementById('app');
  $root.innerHTML = element;

  Object.keys(events).forEach((key) => {
    if (typeof events[key] === 'function') {
      events[key](); // 함수 실행
    }
  });

  registerGlobalEvents();
}

function rerender() {
  const { element } = rootPage[location.pathname]();
  const $root = document.getElementById('app');
  $root.innerHTML = element;
}

function main() {
  render();
  cartStore.subscribe(rerender);
}

main();
