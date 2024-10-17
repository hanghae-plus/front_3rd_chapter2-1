import { Store } from "./index";

const initialProductList = [
  { id: "p1", name: "상품1", price: 10000, quantity: 50 },
  { id: "p2", name: "상품2", price: 20000, quantity: 30 },
  { id: "p3", name: "상품3", price: 30000, quantity: 20 },
  { id: "p4", name: "상품4", price: 15000, quantity: 0 },
  { id: "p5", name: "상품5", price: 25000, quantity: 10 },
];

const productListStore = new Store({
  productList: initialProductList,
});

export const getProductList = () => [...productListStore.getState().productList];
export const updateProductQuantity = (productId, newQuantity) => {
  const updatedProductList = productListStore
    .getState()
    .productList.map((product) =>
      product.id === productId ? { ...product, quantity: newQuantity } : product,
    );
  productListStore.setState({ productList: updatedProductList });
};
export const subscribeToProductList = (listener) => productListStore.subscribe(listener);

export default productListStore;
