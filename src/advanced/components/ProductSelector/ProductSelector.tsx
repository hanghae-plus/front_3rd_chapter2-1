import { useState } from 'react';
import { Button } from '../Shared/Button';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface ProductSelectorProps {
  defaultValue?: string;
  options: Option[];
  handleAddCart: (selectedId?: string) => void;
}

export const ProductSelector = ({
  defaultValue,
  options,
  handleAddCart,
}: ProductSelectorProps) => {
  const [selectedId, setSelectedId] = useState(defaultValue);

  return (
    <div>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        defaultValue={defaultValue}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {options.map(({ label, value, disabled }) => (
          <option value={value} key={value} disabled={disabled}>
            {label}
          </option>
        ))}
      </select>

      <Button
        id="add-to-cart"
        text="추가"
        size="l"
        onClick={() => handleAddCart(selectedId)}
      />
    </div>
  );
};
