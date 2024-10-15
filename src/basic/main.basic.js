import {
  handleCartItemsClick,
  handleItemAddButtonClick,
} from './utils/eventUtils';
import {
  createAddButton,
  createCartItemsDiv,
  createCartTotalDiv,
  createContainerDiv,
  createProductSelect,
  createStockStatusDiv,
  createTitleH1,
  createWrapperDiv,
  renderCart,
  renderOptionList,
} from './utils/renderUtils';
import { setLuckyTimer, setSuggestTimer } from './utils/timerUtils';

function main() {
  const $root = document.getElementById('app');
  const $containerDiv = createContainerDiv();
  const $wrapperDiv = createWrapperDiv();
  const $titleH1 = createTitleH1();
  const $cartItemsDiv = createCartItemsDiv();
  const $cartTotalDiv = createCartTotalDiv();
  const $productSelect = createProductSelect();
  const $addButton = createAddButton();
  const $stockStatusDiv = createStockStatusDiv();

  renderOptionList($productSelect);

  $wrapperDiv.appendChild($titleH1);
  $wrapperDiv.appendChild($cartItemsDiv);
  $wrapperDiv.appendChild($cartTotalDiv);
  $wrapperDiv.appendChild($productSelect);
  $wrapperDiv.appendChild($addButton);
  $wrapperDiv.appendChild($stockStatusDiv);
  $containerDiv.appendChild($wrapperDiv);
  $root.appendChild($containerDiv);

  renderCart($cartItemsDiv, $cartTotalDiv, $stockStatusDiv);

  setLuckyTimer($productSelect)();
  setSuggestTimer($productSelect)();

  handleItemAddButtonClick({
    $addButton,
    $productSelect,
    $cartItemsDiv,
    $cartTotalDiv,
    $stockStatusDiv,
  });

  handleCartItemsClick({
    $cartItemsDiv,
    $cartTotalDiv,
    $stockStatusDiv,
  });
}

main();
