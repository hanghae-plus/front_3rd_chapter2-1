import Container from './components/Container';
import Button from './components/Button';
import Cart from './components/Cart';
import Total from './components/Total';
import Select from './components/Select';
import StockInfo from './components/StockInfo';
import Title from './components/Title';
import { CartProvider } from './context/CartContext';
import { useState } from 'react';
import { productList } from './data/productData';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (productId) => {
    const product = productList.find((p) => p.id === productId);
    setSelectedProduct(product);
  };

  return (
    <CartProvider>
      <Container>
        <Title text="장바구니" />
        <Cart text="장바구니" />
        <Total />
        <Select onChange={handleProductSelect} />
        <Button selectedProduct={selectedProduct}>추가</Button>
        <StockInfo />
      </Container>
    </CartProvider>
  );
}

export default App;
