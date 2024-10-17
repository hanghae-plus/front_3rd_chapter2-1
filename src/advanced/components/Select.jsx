import React from 'react';
import { productList } from '../data/productData';

const Select = ({ onChange }) => {
  return (
    <select className="border rounded p-2 mr-2" onChange={(e) => onChange(e.target.value)}>
      {productList.map((product) => (
        <option key={product.id} value={product.id} disabled={product.q === 0}>
          {product.name} - {product.val}원 {product.q === 0 ? '(품절)' : ''}
        </option>
      ))}
    </select>
  );
};

export default Select;
