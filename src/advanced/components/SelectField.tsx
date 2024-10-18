import { FC, memo } from 'react'
import { Product } from '../types'

type SelectFieldProps = {
  price: string
  onChange: (price: string) => void
  options: Product[]
}

const SelectField: FC<SelectFieldProps> = ({ price, onChange, options }) => {
  return (
    <select
      id="product-select"
      value={price}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 mr-2"
    >
      {options.map(({ id, quantity, name, price }) => (
        <option key={id} value={id} disabled={quantity === 0}>
          {name} ({price.toLocaleString()}원)
        </option>
      ))}
    </select>
  )
}

export default memo(SelectField)
