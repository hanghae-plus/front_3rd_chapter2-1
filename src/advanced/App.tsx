import React, { useEffect } from 'react';
import Home from './pages/Home';
import { startFlashSale, startSuggestSale } from './utils';

const App = () => {
  console.log('App 컴포넌트 렌더링');
  useEffect(() => {
    console.log('App 컴포넌트 useEffect');
    startFlashSale();
    startSuggestSale();
  }, []);

  return <Home />;
};

export default App;
