import { addEvent } from '../../utils/eventUtils.js';
import { cartStore } from './store.js';

export function events() {
  const setCartState = cartStore.setState;

  function test() {
    console.log('2323');
  }

  function test2() {
    console.log('66666');
  }

  function test3() {
    console.log('3333');
    addEvent('click', '#add-to-cart', (e) => {
      e.preventDefault();
      console.log('hihihi');
      setCartState({ name: 'hihi' });
    });
  }

  return {
    test,
    test2,
    test3,
  };
}
