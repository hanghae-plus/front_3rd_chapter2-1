import React, { useEffect } from 'react'
import Cart from './component/Cart'
import { useCart } from './hooks/useCart'
import useProducts from './hooks/useProducts'
import ProductSelect from './component/ProductSelect'
import StockInfo from './component/StockInfo'
import { initializeTimedEvents } from './utils/timedEvents'

function App() {
  const { products, updateProductStock } = useProducts()
  const {
    cartItems,
    discountRate,
    bonusPoints,
    cartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
  } = useCart(products, updateProductStock);

  useEffect(() => {
    initializeTimedEvents(products, updateProductStock);
  }, [])
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Cart 
          items={cartItems} 
          updateItem={updateCartItem} 
          removeItem={removeFromCart} 
          total={cartTotal}
          discountRate={discountRate}
          bonusPoints={bonusPoints}
        />
        <ProductSelect products={products} onAddToCart={addToCart} />
        <StockInfo products={products} />
      </div>
    </div>
  )
}

export default App