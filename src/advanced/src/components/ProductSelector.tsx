import { Product } from "../types";

interface ProductSelectorProps {
  productList: Product[];
  selectProductId: string;
  handleProductId: (id: string) => void;
  AddToCart: () => void;
}

const ProductSelector = ({
  productList,
  selectProductId,
  handleProductId,
  AddToCart,
}: ProductSelectorProps) => {
  return (
    <>
      <select
        className="border rounded p-2 mr-2"
        value={selectProductId}
        onChange={(e) => handleProductId(e.target.value)}
      >
        {productList.map((product) => (
          <option key={product.id} value={product.id} disabled={product.quantity <= 0}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={AddToCart}>
        추가
      </button>
    </>
  );
};

export default ProductSelector;
