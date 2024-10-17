const productList = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

export const Cart = () => {
  return (
    <>
      <div id="cart-items"></div>
      <div id="cart-total" className="text-xl font-bold my-4">
        총액: 0원
        <span id="loyalty-points" className="text-blue-500 ml-2">
          (포인트: 0)
        </span>
      </div>
      <select id="product-select" className="border rounded p-2 mr-2">
        {productList.map(function (product, index) {
          return <option key={index} value={product.id}>{`${product.name} - ${product.val}원`}</option>;
        })}
      </select>
      <button id="add-to-cart" className="bg-blue-500 text-white px-4 py-2 rounded">
        추가
      </button>
      {productList.map(function (product, index) {
        return (
          <div key={index} id="stock-status" className="text-sm text-gray-500 mt-2">
            {product.q < 5 ? (product.q > 0 ? `${product.name} 재고 부족(${product.q}개 남음)` : `${product.name} 품절`) : null}
          </div>
        );
      })}
    </>
  );
};
