class ProductsStore {
  static #instance;

  #itemList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];

  #lastSelectItemId = '';

  static getInstance() {
    if (!ProductsStore.#instance) {
      ProductsStore.#instance = new ProductsStore();
    }

    return ProductsStore.#instance;
  }

  getAllProductList() {
    return this.#itemList;
  }
  getProductByIndex(index) {
    return this.#itemList[index];
  }

  getProductById(id) {
    return this.#itemList.find((item) => item.id === id);
  }

  setProductStock(index, newStock) {
    this.#itemList[index].stock = newStock;
  }
  setValue(newValue) {
    this.#itemList = newValue;
  }

  getlastSelectItemId() {
    return this.#lastSelectItemId;
  }
  setLastSelectItemId(id) {
    this.#lastSelectItemId = id;
  }
}

export default new ProductsStore();
