import { Cart, Product } from '../App';
import { MESSAGE } from '../constants';

const ProductSelect = ({ productList, setCart, setProductList }) => {
  const handleAddToCart = (productId: string) => {
    const product = productList.find((product: Product) => product.id === productId);

    if (!product) {
      return;
    }

    if (product.quantity <= 0) {
      alert(MESSAGE.NOT_ENOUGH_PRODUCT);
      return;
    }

    setCart((prevCart: Cart) => ({
      ...prevCart,
      [productId]: (prevCart[productId] || 0) + 1,
    }));

    setProductList((prevList: Product[]) =>
      prevList.map((prev: Product) => (prev.id === productId ? { ...prev, quantity: prev.quantity - 1 } : prev)),
    );
  };

  return (
    <select id="product-select" className="border rounded p-2 mr-2" onChange={(e) => handleAddToCart(e.target.value)}>
      {productList.map((product: Product) => (
        <option key={product.id} value={product.id} disabled={product.quantity === 0}>
          {product.name} - {product.price}원
        </option>
      ))}
    </select>
  );
};

export default ProductSelect;
