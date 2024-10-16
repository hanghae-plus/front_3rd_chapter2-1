import React from "react";

const ItemSelecter = () => {
  return (
    <div>
      <select id="product-select" className="border rounded p-2 mr-2"></select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </div>
  );
};

export default ItemSelecter;
