import ReactDOM from 'react-dom/client';
import Home from './pages/Home';
import { StrictMode } from 'react';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);
root.render(
  <StrictMode>
    <Home />
  </StrictMode>
);
