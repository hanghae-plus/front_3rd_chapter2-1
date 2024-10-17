import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

// Constants
const CONSTANTS = {
  DEDUCTION_QUALIFIED_BULK: 30,
  DEDUCTION_RATE_BULK: 0.75,
  DEDUCTION_QUALIFIED_WEEKDAY: 2,
  DEDUCTION_RATE_WEEKDAY: 0.9,
  DISCOUNT_QUALIFIED_PRODUCT: 10,
  DISCOUNT_RATES_PRODUCT: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
  DISCOUNT_RATE_LUCKY: 0.2,
  DISCOUNT_RATE_EXTRA_SUGGESTION: 0.05,
  TIME_INTERVAL_LUCKY_SALE: 30,
  TIME_INTERVAL_EXTRA_SUGGESTION: 60,
  MILLISECONDS: 1000,
};

const MESSAGES = {
  OUT_OF_STOCK: '재고가 부족합니다.',
  PRODUCT_NOT_FOUND: '존재하지 않는 상품입니다.',
};

// Product Context
interface ProductContextType {
  products: Product[];
  updateProductStock: (productId: string, change: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ]);

  const updateProductStock = useCallback((productId: string, change: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: Math.max(0, product.stock - change) }
          : product
      )
    );
  }, []);

  useEffect(() => {
    const luckyTimer = setInterval(() => {
      setProducts(prevProducts => {
        const luckyItem = prevProducts[Math.floor(Math.random() * prevProducts.length)];
        if (Math.random() < 0.3 && luckyItem.stock > 0) {
          alert(`번개세일! ${luckyItem.name}이(가) ${CONSTANTS.DISCOUNT_RATE_LUCKY * 100}% 할인 중입니다!`);
          return prevProducts.map(p =>
            p.id === luckyItem.id
              ? { ...p, price: Math.round(p.price * (1 - CONSTANTS.DISCOUNT_RATE_LUCKY)) }
              : p
          );
        }
        return prevProducts;
      });
    }, CONSTANTS.TIME_INTERVAL_LUCKY_SALE * CONSTANTS.MILLISECONDS);

    return () => clearInterval(luckyTimer);
  }, []);

  return (
    <ProductContext.Provider value={{ products, updateProductStock }}>
      {children}
    </ProductContext.Provider>
  );
};

const useProduct = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};

// Cart Context
interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, change: number) => void;
  removeFromCart: (productId: string) => void;
  calculateTotal: () => { totalAmount: number; itemCount: number; newBonusPoints: number };
  bonusPoints: number;
  setBonusPoints: React.Dispatch<React.SetStateAction<number>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bonusPoints, setBonusPoints] = useState(0);
  const { products, updateProductStock } = useProduct();

  const addToCart = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      alert(MESSAGES.PRODUCT_NOT_FOUND);
      return;
    }
    if (product.stock === 0) {
      alert(MESSAGES.OUT_OF_STOCK);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    updateProductStock(productId, 1);
  }, [products, updateProductStock]);

  const updateCartItemQuantity = useCallback((productId: string, change: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
      return updatedCart;
    });

    updateProductStock(productId, -change);
  }, [updateProductStock]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId);
      if (item) {
        updateProductStock(productId, -item.quantity);
      }
      return prevCart.filter(item => item.id !== productId);
    });
  }, [updateProductStock]);

  const calculateTotal = useCallback(() => {
    let subTotal = 0;
    let totalAmount = 0;
    let itemCount = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const discountRate = CONSTANTS.DISCOUNT_RATES_PRODUCT[item.id as keyof typeof CONSTANTS.DISCOUNT_RATES_PRODUCT] || 0;

      itemCount += item.quantity;
      subTotal += itemTotal;
      totalAmount += itemTotal * (1 - (item.quantity >= CONSTANTS.DISCOUNT_QUALIFIED_PRODUCT ? discountRate : 0));
    });

    if (itemCount >= CONSTANTS.DEDUCTION_QUALIFIED_BULK) {
      totalAmount = Math.min(totalAmount, subTotal * CONSTANTS.DEDUCTION_RATE_BULK);
    }

    if (new Date().getDay() === CONSTANTS.DEDUCTION_QUALIFIED_WEEKDAY) {
      totalAmount *= CONSTANTS.DEDUCTION_RATE_WEEKDAY;
    }

    const newBonusPoints = Math.floor(totalAmount / 1000);

    return {
      totalAmount: Math.round(totalAmount),
      itemCount,
      newBonusPoints,
    };
  }, [cart]);

  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    calculateTotal,
    bonusPoints,
    setBonusPoints,
  }), [cart, addToCart, updateCartItemQuantity, removeFromCart, calculateTotal, bonusPoints]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Components
const ProductSelect: React.FC = () => {
  const { products } = useProduct();
  const { addToCart } = useCart();
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const handleAddToCart = useCallback(() => {
    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  }, [selectedProductId, addToCart]);

  return (
    <div className="flex items-center space-x-2">
      <select
        id="product-select"
        className="border rounded p-2"
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        <option value="">상품을 선택하세요</option>
        {products.map((product) => (
          <option key={product.id} value={product.id} disabled={product.stock === 0}>
            {product.name} - {product.price}원 (재고: {product.stock})
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleAddToCart}
        disabled={!selectedProductId}
      >
        추가
      </button>
    </div>
  );
};

const CartItem: React.FC<{
  item: CartItem;
  onUpdateQuantity: (productId: string, change: number) => void;
  onRemove: (productId: string) => void;
}> = React.memo(({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div id={item.id} className="flex justify-between items-center mb-2">
      <span>
        {item.name} - {item.price}원 x {item.quantity}
      </span>
      <div>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onUpdateQuantity(item.id, -1)}
        >
          -
        </button>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
          onClick={() => onUpdateQuantity(item.id, 1)}
        >
          +
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded"
          onClick={() => onRemove(item.id)}
        >
          삭제
        </button>
      </div>
    </div>
  );
});

const CartSummary: React.FC<{
  total: number;
  bonusPoints: number;
  itemCount: number;
}> = React.memo(({ total, bonusPoints, itemCount }) => {
  return (
    <div className="text-xl font-bold my-4">
      총액: {total}원
      {itemCount >= 10 && <span className="text-sm font-normal ml-2">(10.0% 할인 적용)</span>}
      <span id="loyalty-points" className="text-blue-500 text-sm font-normal ml-2">
        (포인트: {bonusPoints})
      </span>
    </div>
  );
});

const StockInfo: React.FC = React.memo(() => {
  const { products } = useProduct();
  
  const lowStockProducts = useMemo(() => 
    products.filter((product) => product.stock < 5),
    [products]
  );

  return (
    <div className="text-sm text-gray-500 mt-2">
      {lowStockProducts.map((product) => (
        <div key={product.id}>
          {product.name}: {product.stock > 0 ? `재고 부족 (${product.stock}개 남음)` : '품절'}
        </div>
      ))}
    </div>
  );
});

const CartContent: React.FC = () => {
  const { cart, updateCartItemQuantity, removeFromCart, calculateTotal, bonusPoints, setBonusPoints } = useCart();
  const { totalAmount, itemCount, newBonusPoints } = calculateTotal();

  useEffect(() => {
    if (newBonusPoints !== bonusPoints) {
      setBonusPoints(newBonusPoints);
    }
  }, [newBonusPoints, bonusPoints, setBonusPoints]);

  return (
    <>
      <div id="cart-items">
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateCartItemQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>
      <CartSummary total={totalAmount} bonusPoints={bonusPoints} itemCount={itemCount} />
      <ProductSelect />
      <StockInfo />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <div className="bg-gray-100 p-8">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
            <h1 className="text-2xl font-bold mb-4">장바구니</h1>
            <CartContent />
          </div>
        </div>
      </CartProvider>
    </ProductProvider>
  );
};

// Render the App
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
});