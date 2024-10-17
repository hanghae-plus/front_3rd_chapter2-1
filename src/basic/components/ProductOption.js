const ProductOption = (product) => {
  return /* HTML */ `<option
    value="${product.id}"
    ${product.quantity === 0 ? 'disabled' : ''}
  >${product.name} - ${product.price}원</option>`.trim();
};

export default ProductOption;
