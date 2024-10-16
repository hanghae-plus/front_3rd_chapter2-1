import { FC, memo } from 'react'
import { Product } from '../types'

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: Product[]
}

const SelectField: FC<SelectFieldProps> = ({ value, onChange, options }) => {
  return (
    <select
      id="product-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 mr-2"
    >
      {options.map((product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name}
        </option>
      ))}
    </select>
  )
}

export default memo(SelectField)
