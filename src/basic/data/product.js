function createProduct({ id = '', name = '', price = 0, quantity = 0 }) {
  function increaseQuantity(amount = 1) {
    quantity += amount;
  }

  function decreaseQuantity(amount = 1) {
    quantity -= amount;
  }

  function isSoldOut() {
    return quantity <= 0;
  }

  function setPrice(newPrice) {
    price = newPrice;
  }

  function getPrice() {
    return price;
  }

  function getId() {
    return id;
  }

  function getName() {
    return name;
  }

  function getQuantity() {
    return quantity;
  }

  function toObject() {
    return { id, name, price, quantity };
  }

  return {
    getId,
    getName,
    getPrice,
    getQuantity,
    toObject,
    increaseQuantity,
    decreaseQuantity,
    isSoldOut,
    setPrice,
  };
}

function createProductList(initProductList) {
  let productList = initProductList;

  function getItem(id) {
    return productList.find((product) => product.getId() === id);
  }

  function getLastSelectedItem() {
    const lastSelectedId = document.getElementById('product-select').value;
    return productList.find((product) => product.getId() === lastSelectedId);
  }

  function getLastSelectedId() {
    const lastSelectedId = document.getElementById('product-select').value;
    return lastSelectedId;
  }

  function getProductList() {
    return productList;
  }

  function toObject() {
    return productList.map((product) => product.toObject());
  }

  return {
    getProductList,
    toObject,
    getLastSelectedId,
    getItem,
    getLastSelectedItem,
  };
}

export const productList = createProductList([
  createProduct({ id: 'p1', name: '상품1', price: 10000, quantity: 50 }),
  createProduct({ id: 'p2', name: '상품2', price: 20000, quantity: 30 }),
  createProduct({ id: 'p3', name: '상품3', price: 30000, quantity: 20 }),
  createProduct({ id: 'p4', name: '상품4', price: 15000, quantity: 0 }),
  createProduct({ id: 'p5', name: '상품5', price: 25000, quantity: 10 }),
]);
