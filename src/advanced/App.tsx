import React from 'react';
import { AppProvider } from './context/appContext';
import { Layout } from './components/Layout';

const App = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default App;
