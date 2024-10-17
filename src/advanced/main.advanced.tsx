// main.advanced.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function main(): void {
  const appElement: HTMLElement | null = document.getElementById('app');
  if (appElement) {
    const app = ReactDOM.createRoot(appElement);
    app.render(<App />);
  }
}

main();
