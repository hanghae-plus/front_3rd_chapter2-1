import { CartItem } from './features/cart/components/CartItem';
import { CartSummary } from './features/cart/components/CartSummary';
import { useCart } from './features/cart/hooks/useCart';
import { ProductPicker } from './features/product/components/ProductPicker';
import { StockSummary } from './features/product/components/StockSummary';
import { useProduct } from './features/product/hooks/useProduct';
import { useStock } from './features/product/hooks/useStock';
import { IProduct } from './features/product/types';

export const App = () => {
  const { products } = useProduct();

  const {
    stock,
    message: stockMessage,
    addStock,
    minusStock,
    resetStock,
  } = useStock({ products });
  const {
    cartItems,
    totalAmount,
    discountRate,
    bonusPoint,
    addToCart,
    minusFromCart,
    removeFromCart,
  } = useCart({
    products,
  });

  const handleAddCart = (productId: IProduct['id']) => {
    const isActionExecuted = minusStock(productId);

    if (!isActionExecuted) return;
    addToCart(productId);
  };

  const handleMinusCart = async (productId: IProduct['id']) => {
    const isActionExecuted = addStock(productId);

    if (!isActionExecuted) return;
    minusFromCart(productId);
  };

  const handleRemoveCart = (productId: IProduct['id']) => {
    const isActionExecuted = resetStock(productId);

    if (!isActionExecuted) return;
    removeFromCart(productId);
  };

  return (
    <div className="bg-gray-100 p-8 ">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>

        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <CartItem
              key={`cart_item_${item.id}`}
              {...item}
              onAdd={handleAddCart}
              onMinus={handleMinusCart}
              onRemove={handleRemoveCart}
            />
          ))}
        </div>
        <CartSummary
          totalAmount={totalAmount}
          discountRate={discountRate}
          point={bonusPoint}
        />

        <ProductPicker
          products={products}
          stock={stock}
          onClick={handleAddCart}
        />
        <StockSummary message={stockMessage} />
      </div>
    </div>
  );
};
