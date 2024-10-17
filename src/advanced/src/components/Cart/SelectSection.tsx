import { ChangeEvent, useCallback, useState } from "react";

import { QUANTITY_CHANGE } from "@/constants";
import type { ProductOption } from "@/types";

type SelectSectionProps = {
  onSelect?: (option: ProductOption) => void;
  options: ProductOption[];
};

export default function SelectSection({ onSelect, options: optionsProp }: SelectSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState(() => optionsProp[0].id);

  const handleSelectProduct = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(e.target.value);
  }, []);

  const addProduct = useCallback(() => {
    const selectedOption = optionsProp.find((option) => option.id === selectedProductId);
    if (selectedOption) {
      onSelect?.({ ...selectedOption, q: QUANTITY_CHANGE.PLUS });
    }
  }, [onSelect, optionsProp, selectedProductId]);

  return (
    <div>
      <select id="product-select" className="border rounded p-2 mr-2" onChange={handleSelectProduct}>
        {optionsProp.map((option) => (
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
