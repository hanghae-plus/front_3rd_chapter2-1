import React from 'react';
import Layout from './components/layout';
import { AppProvider } from './context/appContext';

const App = () => {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
};

export default App;
