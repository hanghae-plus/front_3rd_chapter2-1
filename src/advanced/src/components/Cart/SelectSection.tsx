import { ChangeEvent, useEffect, useState } from "react";

import { productOptions, QUANTITY_CHANGE } from "@/constants";
import type { ProductOption } from "@/types";

type SelectSectionProps = {
  onSelect?: (option: ProductOption) => void;
  options: ProductOption[];
};

export default function SelectSection({ onSelect, options: optionsProp }: SelectSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState(() => productOptions[0].id);
  const [options, setOption] = useState<ProductOption[]>(() => optionsProp);

  const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  };

  const addProduct = () => {
    const selectedOption = optionsProp.find((options) => options.id === selectedProductId);
    if (selectedOption) {
      onSelect?.({ ...selectedOption, q: QUANTITY_CHANGE.PLUS });
    }
  };

  useEffect(() => {
    setOption(options);
  }, [options]);

  return (
    <div>
      <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelectProduct}>
        {options.map((option) => (
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
