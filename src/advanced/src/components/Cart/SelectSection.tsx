import { ChangeEvent, useEffect, useState } from "react";

import { productOptions } from "@/constants/product";
import type { ProductOption } from "@/types/cart";

type SelectSectionProps = {
  onSelect?: (data: ProductOption) => void;
  options: ProductOption[];
};

export default function SelectSection({ onSelect, options }: SelectSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState(() => productOptions[0].id);
  const [data, setData] = useState<ProductOption[]>(() => options);

  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedProductId(value);
  };

  const addProduct = () => {
    const selectedOption = options.find((option) => option.id === selectedProductId);
    if (selectedOption) {
      onSelect?.({ ...selectedOption, q: 1 });
    }
  };

  useEffect(() => {
    setData(options);
  }, [options]);

  return (
    <div>
      <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelectProduct}>
        {data.map((option) => (
          <option key={option.id} value={option.id} disabled={option.q === 0}>
            {`${option.name} - ${option.val}원`}
          </option>
        ))}
      </select>
      <button id="add-to-cart" type="button" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addProduct}>
        추가
      </button>
    </div>
  );
}
