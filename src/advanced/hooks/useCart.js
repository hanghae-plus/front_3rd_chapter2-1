import { useState, useEffect } from 'react';
import { productList } from '../data/productData';

const useCart = () => {
  const [products, setProducts] = useState(productList);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bonusPoint, setBonusPoint] = useState(0);

  useEffect(() => {
    calculateCart();
  }, [cart, products]);

  const addToCart = (product) => {
    const productInStock = products.find((p) => p.id === product.id);
    if (productInStock.q <= 0) {
      alert('재고가 부족합니다.');
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setProducts(products.map((p) => (p.id === product.id ? { ...p, q: p.q - 1 } : p)));
  };

  const updateQuantity = (productId, change) => {
    const productInStock = products.find((p) => p.id === productId);
    const item = cart.find((item) => item.id === productId);

    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > productInStock.q) {
        alert('재고가 부족합니다.');
        return;
      }
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        setCart(
          cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)),
        );
        setProducts(products.map((p) => (p.id === productId ? { ...p, q: p.q - change } : p)));
      }
    }
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cart.find((item) => item.id === productId);
    if (itemToRemove) {
      setCart(cart.filter((item) => item.id !== productId));
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, q: p.q + itemToRemove.quantity } : p)),
      );
    }
  };

  const calculateCart = () => {
    let total = 0;
    let points = 0;

    cart.forEach((item) => {
      const subtotal = item.val * item.quantity;
      const discount = getDiscount(item.id, item.quantity);
      total += subtotal * (1 - discount);
    });

    if (cart.reduce((acc, item) => acc + item.quantity, 0) >= 30) {
      total *= 0.75;
    }

    if (new Date().getDay() === 2) {
      total *= 0.9;
    }

    points = Math.floor(total / 1000);
    setTotalAmount(Math.round(total));
    setBonusPoint(points);
  };

  const getDiscount = (itemId, quantity) => {
    if (quantity < 10) return 0;
    const discounts = { p1: 0.1, p2: 0.15, p3: 0.2, p4: 0.05, p5: 0.25 };
    return discounts[itemId] || 0;
  };

  return {
    products,
    cart,
    totalAmount,
    bonusPoint,
    setProducts,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
};

export default useCart;
