import { useState } from 'react';
import { UpsertCart } from '../../hooks/useCart';
import { Button } from '../Shared/Button';

type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface ProductSelectorProps {
  defaultValue?: string;
  options: Option[];
  handleUpsertCart: UpsertCart;
}

export const ProductSelector = ({
  defaultValue,
  options,
  handleUpsertCart,
}: ProductSelectorProps) => {
  const [selectedId, setSelectedId] = useState(defaultValue);

  return (
    <div>
      <select
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
        text="추가"
        size="l"
        onClick={() => handleUpsertCart(selectedId)}
      />
    </div>
  );
};
