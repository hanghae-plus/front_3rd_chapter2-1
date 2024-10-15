import CartInfo from '../components/CartInfo';
import CartItem from '../components/CartItem';
import HeaderTitle from '../components/headerTitle';
import ProductSelect from '../components/ProductSelect';
import TotalPrice from '../components/TotalPrice';
import StockStatus from '../components/StockStatus';

function main() {
  const root = document.getElementById('app');

  root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
          ${HeaderTitle()}
          ${CartItem({ id: 1, title: 'testTitle' })}
          ${CartInfo()}
          ${TotalPrice()}
          ${ProductSelect()}
          ${StockStatus()}
      </div>
    </div>
  `;
}

main();
