import { FC, memo } from 'react'
import { Product } from '../types'
import Button from './Button'

type CartItemProps = {
  cart: Product[]
  onChange: (id: string, change: number) => void
  onClick: (id: string) => void
}

const CartList: FC<CartItemProps> = ({ cart, onChange, onClick }) => {
  return (
    <div id="cart-items">
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>
            {item.name} - {item.price.toLocaleString()}원 x {item.quantity}
          </span>
          <div>
            <Button id="quantity-change" size="sm" onClick={() => onChange(item.id, -1)} className="mr-1" text="-" />
            <Button id="quantity-change" size="sm" onClick={() => onChange(item.id, 1)} className="mr-1" text="+" />
            <Button id="remove-item" size="sm" color="error" onClick={() => onClick(item.id)} text="삭제" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default memo(CartList)
