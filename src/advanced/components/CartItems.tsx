import { useEffect } from 'react';

interface CartItemsProps {
  cartList: Cart[];
  productList: Product[];
  changeAmount: (id: string, changeNum: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({
  cartList,
  productList,
  changeAmount,
}) => {
  return (
    <div id="cart-items">
      {cartList.map((cartItem: Cart) => {
        const product = productList.find(
          (productItem) => productItem.id === cartItem.productId
        );
        if (!product) return null;
        return (
          <div
            id={product.id}
            className="flex justify-between items-center mb-2"
          >
            {' '}
            <span>
              {product.name} - {product.price}원 x 1
            </span>
            <div>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-change="-1"
                onClick={() => changeAmount(product.id, -1)}
              >
                -
              </button>
              <button
                className="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1"
                data-change="1"
                onClick={() => changeAmount(product.id, -1)}
              >
                +
              </button>
              <button className="remove-item bg-red-500 text-white px-2 py-1 rounded">
                삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
