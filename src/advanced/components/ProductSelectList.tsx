import React from 'react';
import { useAppContext } from '../context/appContext';

export const ProductSelectList = () => {
  const { setSelectedProductId, productSelectDropDown } = useAppContext();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(event.target.value);
  };

  return (
    <div>
      <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelectChange}>
        {productSelectDropDown}
      </select>
    </div>
  );
};
