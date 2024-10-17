import RootProvider from '@advanced/provider/RootProvider';
import AlertPopUp from './components/templates/AlertPopUp';
import Cart from '@templates/Cart';
import React from 'react';

const App: React.FC = () => {
  return (
    <RootProvider>
      <div className="bg-gray-100 p-8" data-testid="app">
        <AlertPopUp />
        <Cart />
      </div>
    </RootProvider>
  );
};

export default App;
