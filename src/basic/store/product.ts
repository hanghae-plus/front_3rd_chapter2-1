import { createStore } from '@basic/lib/store';
import { deepClone } from '@basic/utils';

export const productStore = createStore({
  productList: [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50, discount: 0.1 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30, discount: 0.15 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20, discount: 0.2 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0, discount: 0.05 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10, discount: 0.25 },
  ] as Array<ProductType>,
});

export const getProductData = (productId: string) => {
  const { productList } = productStore.getState();

  return productList.find((item: ProductType) => item.id === productId);
};

export const updateProductList = (
  id: string,
  newData: {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
    discount?: number;
  }
) => {
  const { productList } = productStore.getState();
  const cloneProducts = deepClone(productList);

  const updatedProductList = cloneProducts.map((item: ProductType) => {
    if (item.id === id) {
      return { ...item, ...newData };
    }
    return item;
  });

  productStore.setState({ productList: updatedProductList });
};

export const updateStock = (id: string, shippingCount: number) => {
  const { productList } = productStore.getState();
  const cloneProducts = deepClone(productList);

  const updatedProductList = cloneProducts.map((item: ProductType) => {
    if (item.id === id) {
      const resetQty = item.quantity + shippingCount;
      item.quantity = resetQty >= 0 ? resetQty : 0;
    }
    return item;
  });

  productStore.setState({ productList: updatedProductList });
};
