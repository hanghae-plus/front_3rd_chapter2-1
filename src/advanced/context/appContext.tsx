import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IProduct, RenderElementType } from '../ts/interface/interface';

const AppContext = createContext<RenderElementType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [renderCart, setRenderCart] = useState<JSX.Element>(<></>);
  const [productSum, setProductSum] = useState<string>('');
  const [productSelectDropDown, setProductSelectDropDown] = useState<JSX.Element>(<></>);
  const [addCartBtn, setAddCartBtn] = useState<JSX.Element>(<></>);
  const [stockInfo, setStockInfo] = useState<string>('');
  const [lastSelectedProductId, setLastSelectedProductId] = useState<string>('');
  const [discountSpan, setDiscountSpan] = useState<string>('');
  const [cartProductList, setCartProductList] = useState<IProduct[]>([]);
  const [bonusPointsSpan, setBonusPointsSpan] = useState<string>('');
  const [productList, setProductList] = useState<IProduct[]>([
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ]);

  return (
    <AppContext.Provider
      value={{
        renderCart,
        productSum,
        productSelectDropDown,
        addCartBtn,
        stockInfo,
        lastSelectedProductId,
        discountSpan,
        cartProductList,
        bonusPointsSpan,
        productList,
        setRenderCart,
        setProductSum,
        setProductSelectDropDown,
        setAddCartBtn,
        setStockInfo,
        setLastSelectedProductId,
        setDiscountSpan,
        setCartProductList,
        setBonusPointsSpan,
        setProductList,
      }}>
      {children}
    </AppContext.Provider>
  );
};
