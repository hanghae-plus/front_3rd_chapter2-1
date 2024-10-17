import React from 'react';
import { StrictMode } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

// const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
