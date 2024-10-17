function createCart({ id, name, price, quantity }) {
  function increaseQuantity(amount = 1) {
    quantity += amount;
  }

  function decreaseQuantity(amount = 1) {
    quantity -= amount;
  }

  function toObject() {
    return { id, name, price, quantity };
  }

  function getId() {
    return id;
  }

  function getPrice() {
    return price;
  }

  function getName() {
    return name;
  }

  function getQuantity() {
    return quantity;
  }

  return {
    id,
    name,
    price,
    quantity,
    getId,
    getName,
    getPrice,
    getQuantity,
    toObject,
    increaseQuantity,
    decreaseQuantity,
  };
}

function createCartList(cartList) {
  function addItem({ id, name, price, quantity }) {
    const cart = createCart({ id, name, price, quantity });
    cartList.push(cart);
  }

  function removeItem(id) {
    const index = cartList.findIndex((cart) => cart.getId() === id);
    if (index !== -1) cartList.splice(index, 1);
  }

  function getItem(id) {
    return cartList.find((cart) => cart.getId() === id);
  }

  function hasItem(id) {
    return cartList.some((cart) => cart.getId() === id);
  }

  function toObject() {
    return cartList.map((cart) => cart.toObject());
  }

  function getTotalPrice() {
    return cartList.reduce(
      (acc, cart) => acc + cart.getPrice() * cart.getQuantity(),
      0
    );
  }

  function getTotalQuantity() {
    return cartList.reduce((acc, cart) => acc + cart.getQuantity(), 0);
  }

  return {
    cartList,
    toObject,
    addItem,
    removeItem,
    getItem,
    hasItem,
    getTotalPrice,
    getTotalQuantity,
  };
}

export const cartList = createCartList([]);
