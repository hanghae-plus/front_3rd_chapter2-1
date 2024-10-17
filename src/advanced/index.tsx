import React from 'react';
import { Container } from 'react-dom';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>Hello, React!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root') as Container);
root.render(<App />);
