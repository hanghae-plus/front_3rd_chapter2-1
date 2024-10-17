import React from 'react';

interface Props {
  handleAddCartItem: () => void;
}

const AddCartItemButton: React.FC<Props> = ({ handleAddCartItem }) => {
  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddCartItem}>
      추가
    </button>
  );
};

export default AddCartItemButton;
