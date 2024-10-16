import { Product } from "../../types";

interface CartItemProps {
  product: Product;
  updateCartItemQuantity: (productId: string, quantityChange: number) => void;
  removeCartItem: (productId: string) => void;
}

const CartItem = ({ product, updateCartItemQuantity, removeCartItem }: CartItemProps) => {
  const { id, name, price, quantity } = product;
  return (
    <div className="flex justify-between items-center mb-2">
      <span>
        {name} - {price}원 x {quantity}
      </span>
      <div>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          onClick={() => updateCartItemQuantity(id, -1)}
        >
          -
        </button>
        <button
          className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
          data-product-id={id}
          onClick={() => updateCartItemQuantity(id, +1)}
        >
          +
        </button>
        <button
          className="remove-item bg-red-500 text-white px-2 py-1 rounded"
          data-product-id={id}
          onClick={() => removeCartItem(id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default CartItem;
