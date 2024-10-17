import CartInfo from './components/CartInfo';
import CartAddButton from './components/CartAddButton';
import HeaderTitle from './components/HeaderTitle';
import ProductSelect from './components/ProductSelect';
import TotalPrice from './components/TotalPrice';
import StockStatus from './components/StockStatus';

import { updateSelectOptions } from './utils/ui';
import { updateCartInfo } from './utils/cart';
import { setupIntervals } from './intervals';
import { setupEventListner } from './eventHandler';

function main() {
  const root = document.getElementById('app');
  root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          ${HeaderTitle()}
          ${CartInfo()}
          ${TotalPrice()}
          ${ProductSelect()}
          ${CartAddButton()}
          ${StockStatus()}
      </div>
    </div>
  `;

  updateSelectOptions();
  updateCartInfo();

  setupIntervals();
  setupEventListner();
}

main();
