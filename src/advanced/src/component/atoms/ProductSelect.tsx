import React, { ChangeEvent } from 'react';
import { prodList } from '../../constant/productList';

interface Props {
  handleSelectChange: (event: ChangeEvent) => void;
}

export const ProductSelect: React.FC<Props> = ({ handleSelectChange }) => {
  return (
    <select className="border rounded p-2 mr-2" onChange={handleSelectChange}>
      {prodList.map(({ id, quantity, name, price }) => (
        <option key={id} disabled={quantity === 0} value={id}>
          {name} - {price}원
        </option>
      ))}
    </select>
  );
};
