import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import { StrictMode } from 'react';
import { ProductProvider } from './providers/ProductProvider';
import { CartProvider } from './providers/CartProvider';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <StrictMode>
    <ProductProvider>
      <CartProvider>
        <Home />
      </CartProvider>
    </ProductProvider>
  </StrictMode>
);
