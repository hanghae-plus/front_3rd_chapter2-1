import React, { ChangeEvent } from 'react';
import { DEFAULT_PRODUCT_LIST } from '../constant/defaultProducts';

interface Props {
  handleSelectChange: (event: ChangeEvent) => void;
}

const ProductSelect: React.FC<Props> = ({ handleSelectChange }) => {
  return (
    <select className="border rounded p-2 mr-2" onChange={handleSelectChange}>
      {DEFAULT_PRODUCT_LIST.map(({ id, quantity, name, price }) => (
        <option key={id} disabled={quantity === 0} value={id}>
          {name} - {price}원
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
