import { createCartItem, updateCartItem } from '../components/cartItem';
import { calculateCart } from '../components/cartTotal';
import { updateProductStock } from '../components/productStock'

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartContext {
  productSelect: HTMLSelectElement | null;
  productList: Product[];
  cartList: HTMLElement | null;
  cartTotal: HTMLElement | null;
  stockStatus: HTMLElement | null;
}

export function handleAddCart({
  productSelect,
  productList,
  cartList,
  cartTotal,
  stockStatus,
}: CartContext) {

    if(!productSelect || !cartList || !cartTotal || !stockStatus) return;

    const selectedItem = productList.find(
        (product) => product.id === productSelect.value
      );
    
      if (!selectedItem || selectedItem.stock <= 0) return;
    
      const cartItem = document.getElementById(selectedItem.id);
      if (cartItem) {
        updateCartItem(cartItem, selectedItem, 1);
      } else {
        cartList.appendChild(createCartItem(selectedItem));
        selectedItem.stock--;
      }
    
      calculateCart(cartList, productList, cartTotal);
      updateProductStock(productList, stockStatus);
}
