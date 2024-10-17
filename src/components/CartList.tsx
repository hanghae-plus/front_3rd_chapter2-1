import { FC, memo } from 'react'
import { Product } from '../types'
import Button from './Button'

type CartItemProps = {
  cart: Product[]
  handleQuantityChange: (id: string, change: number) => void
  handleRemoveItem: (id: string) => void
}

const CartList: FC<CartItemProps> = ({ cart, handleQuantityChange, handleRemoveItem }) => {
  return (
    <div id="cart-items">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - {item.price.toLocaleString()}원 x {item.quantity}
          </span>
          <div>
            <Button id="quantity-change" size="sm" onClick={() => handleQuantityChange(item.id, -1)} className="mr-1">
              -
            </Button>
            <Button id="quantity-change" size="sm" onClick={() => handleQuantityChange(item.id, 1)} className="mr-1">
              +
            </Button>
            <Button id="remove-item" size="sm" color="error" onClick={() => handleRemoveItem(item.id)} className="mr-1">
              삭제
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(CartList)
