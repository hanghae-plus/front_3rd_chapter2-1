import useProductSelect from '../hooks/useProductSelect';

const ProductSelect = () => {
  const { selected, handleSelect, handleAddToCart } = useProductSelect();

  return (
    <>
      <select onChange={handleSelect} value={selected} id="product-select" className="border rounded p-2 mr-2">
        <option value="p1">상품1 - 10000원</option>
        <option value="p2">상품2 - 20000원</option>
        <option value="p3">상품3 - 30000원</option>
        <option value="p4" disabled>
          상품4 - 15000원
        </option>
        <option value="p5">상품5 - 25000원</option>
      </select>

      <button onClick={handleAddToCart} id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
    </>
  );
};

export default ProductSelect;
