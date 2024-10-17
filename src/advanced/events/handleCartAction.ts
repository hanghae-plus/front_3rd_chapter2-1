import { updateCartItem } from '../components/cartItem';
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

export function handleCartAction(event: React.MouseEvent<HTMLElement>, context: CartContext) {
  if(!context.productSelect || !context.cartList || !context.cartTotal || !context.stockStatus) return;
    
  const target = event.currentTarget;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productId = target.dataset.productId!;
    const product = context.productList.find((item) => item.id === productId);
    const cartItemElement = document.getElementById(productId)!;

    if (target.classList.contains('quantity-change')) {
      const countChange = parseInt(target.dataset.change!); // +1 또는 -1 값
      updateCartItem(cartItemElement, product!, countChange);
    } else if (target.classList.contains('remove-item')) {
      const currentQuantity = parseInt(
        cartItemElement.querySelector('span')!.textContent!.split('x ')[1]
      );
      product!.stock += currentQuantity;
      cartItemElement.remove();
    }

    calculateCart(context.cartList, context.productList, context.cartTotal); // 장바구니 총액 재계산
    updateProductStock(context.productList, context.stockStatus); // 재고 업데이트
  }
}
