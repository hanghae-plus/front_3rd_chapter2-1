import { productList } from "./data/productList";
import { ProductList } from "../types/product";

interface CartSelectListProps {
  onSelectChange: (id: string) => void; // 상품 선택 시 호출할 함수
}

export const CartSelectList = ({ onSelectChange }: CartSelectListProps) => {
  return (
    <select onChange={(e) => onSelectChange(e.target.value)} className="border p-2 rounded">
      <option value="">상품 선택</option>
      {productList.map((product) => (
        <option key={product.id} value={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  );
};
