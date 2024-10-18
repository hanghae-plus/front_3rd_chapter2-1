import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function main() {
  const appElement = document.getElementById('app');
  if (appElement) {
    const root = ReactDOM.createRoot(appElement); // appElement를 직접 사용합니다.
    root.render(<App />); // root.render를 사용하여 컴포넌트를 렌더링합니다.
  }
}

main();
