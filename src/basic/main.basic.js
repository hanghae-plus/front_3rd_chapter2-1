import Cart from './pages/cart/index.js';
import { registerGlobalEvents } from './utils/eventUtils.js';

const pageRoutes = {
  '/index.basic.html': Cart(),
};

function render() {
  const { element, events } = pageRoutes[window.location.pathname];
  const $root = document.getElementById('app');
  $root.innerHTML = element;

  Object.keys(events).forEach((key) => {
    if (typeof events[key] === 'function') {
      events[key]();
    }
  });

  registerGlobalEvents();
}

function main() {
  render();
}

main();
