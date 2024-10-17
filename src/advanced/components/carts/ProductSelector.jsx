export const ProductSelector = ({ productInventory, setProductInventory, cartList, setCartList, selectedProduct, setSelectedProduct }) => {
  const handleOptionChange = (lastSelectedProductId) => {
    if (Array.isArray(productInventory) === true) {
      const cartItem = productInventory.find((product) => product.id === lastSelectedProductId);
      setSelectedProduct(cartItem);
    }
  };

  const handleAddCartButton = () => {
    const newCartList = cartList.slice();

    const isNewCartItemIndex = cartList.findIndex((item) => item.id === selectedProduct.id) === -1;

    if (isNewCartItemIndex === true) {
      newCartList.push(selectedProduct);
      setCartList(newCartList);

      // const newProductInventory = productInventory.slice()
      // newProductInventory[]

      // setProductInventory(Object.assign({}, productInventory, ))
    }
  };

  return (
    <>
      <select id="product-select" className="-2 mr-2 rounded border" onChange={(e) => handleOptionChange(e.target.value)}>
        {productInventory.map((product) => (
          <option key={product.id} value={product.id}>{`${product.name} - ${product.price}`}</option>
        ))}
      </select>
      <button id="add-to-cart" className="rounded bg-blue-500 px-4 py-2 text-white" onClick={handleAddCartButton}>
        추가
      </button>
    </>
  );
};
