import { useState } from 'react';
import { BoxTitle } from '../templates/BoxTitle';
import { CartItems } from './CartItems';
import { CartTotal } from './CartTotal';
import { ProductSelector } from './ProductSelector';
import { StockStatus } from './StockStatus';
import { initialProductInventory } from '../../datas/productInventory';

export const Cart = () => {
  const [productInventory, setProductInventory] = useState(initialProductInventory);
  const [selectedProduct, setSelectedProduct] = useState(initialProductInventory[0]);
  const [cartList, setCartList] = useState([]);

  return (
    <div className="bg-gray-100 p-8">
      <div className="mx-auto max-w-md overflow-hidden rounded-xl bg-white p-8 shadow-md md:max-w-2xl">
        <BoxTitle />
        <CartItems cartList={cartList} />
        <CartTotal cartList={cartList} productInventory={productInventory} />
        <ProductSelector productInventory={productInventory} setProductInventory={setProductInventory} cartList={cartList} setCartList={setCartList} setSelectedProduct={setSelectedProduct} selectedProduct={selectedProduct} />
        <StockStatus productInventory={productInventory} />
      </div>
    </div>
  );
};
