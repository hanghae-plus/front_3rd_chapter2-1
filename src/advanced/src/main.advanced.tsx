import React from 'react';
import { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
// import './index.css'; // Tailwind CSS가 포함된 스타일
import App from './App';

// function main() {
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
// }

// main();
