import { useMemo, useRef } from 'react';
import { IProduct } from '../types';

export interface IProductPickerProps {
  products: IProduct[];
  stock: IProduct[];
  onClick: (productId: IProduct['id']) => void;
}

export const ProductPicker = ({
  products,
  stock,
  onClick,
}: IProductPickerProps) => {
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const handleClick = () => {
    const value = selectRef.current?.value;

    if (!value) return;
    onClick(value);
  };

  const outOfStocks = useMemo(
    () =>
      stock.reduce(
        (obj, { id, q }) => {
          obj[id] = q <= 0;
          return obj;
        },
        {} as Record<string, boolean>
      ),
    [stock]
  );

  const defaultValue =
    products && products.length > 0 ? products[0].id : undefined;

  return (
    <div>
      <select
        ref={selectRef}
        className="border rounded p-2 mr-2"
        defaultValue={defaultValue}
      >
        {products.map(({ id, name, val }) => (
          <option
            key={`product_option_${id}`}
            value={id}
            disabled={outOfStocks[id]}
          >
            {name} - {val}
          </option>
        ))}
      </select>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleClick}
      >
        추가
      </button>
    </div>
  );
};
