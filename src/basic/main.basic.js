import Cart from './pages/cart/index.js';
import { registerGlobalEvents } from './utils/eventUtils.js';

const rootPage = {
  '/index.basic.html': Cart(),
};

function render() {
  const component = rootPage[window.location.pathname];
  const { element, events } = component;
  const $root = document.getElementById('app');
  $root.innerHTML = element;

  Object.keys(events).forEach((key) => {
    if (typeof events[key] === 'function') {
      events[key](); // 함수 실행
    }
  });

  registerGlobalEvents();
}

function main() {
  render();
}

main();
