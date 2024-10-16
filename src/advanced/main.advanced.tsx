// main.advanced.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Test from './Test';

function main(): void {
  const appElement: HTMLElement | null = document.getElementById('app');
  if (appElement) {
    const app = ReactDOM.createRoot(appElement);
    app.render(<Test />);
  }
}

main();
