import { SetStateAction, useState } from 'react';

interface ProductSelectProps {
  productList: Product[];
  addCart: (id: string) => void;
}

export const ProductSelect: React.FC<ProductSelectProps> = ({
  productList,
  addCart,
}) => {
  const [selectedProductId, setSelectedProductId] = useState('');

  return (
    <>
      <select
        className="border rounded p-2 mr-2"
        id="product-select"
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {productList.map((productItem) => {
          return (
            <option value={productItem.id} key={productItem.id}>
              {productItem.name}-{productItem.price}원
            </option>
          );
        })}
      </select>
      <button
        id="add-to-cart"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => addCart(selectedProductId)}
      >
        추가
      </button>
    </>
  );
};
