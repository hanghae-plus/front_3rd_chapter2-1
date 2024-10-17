import { useState } from 'react';
import useCartStore from '../store/useCartStore';
import Button from './common/Button';

interface Product {
  id: string;
  name: string;
  price: number;
  count: number;
}

const CartSelectForm: React.FC = () => {
  const { productList } = useCartStore();

  const [selectProductId, setSelectProductId] = useState('p1');

  return (
    <>
      <select
        id="product-select"
        className="border rounded p-2 mr-2"
        onChange={(e) => setSelectProductId(e.target.value)}>
        {productList.map((product: Product) => (
          <SelectOptions key={product.id} {...product} />
        ))}
      </select>
      <Button type="addCart" dataProductId={selectProductId} />
    </>
  );
};

const SelectOptions = (product) => {
  const { id, name, price, count } = product;
  return (
    <option value={id} disabled={count === 0}>
      {name} - {price}원
    </option>
  );
};

export default CartSelectForm;
