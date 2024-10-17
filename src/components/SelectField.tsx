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
      {options.map(({ id, quantity, name, value }) => (
        <option key={id} value={id} disabled={quantity === 0}>
          {name} ({value.toLocaleString()}원)
        </option>
      ))}
    </select>
  )
}

export default memo(SelectField)
