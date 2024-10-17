export type CartState = {
  products: Product[];
  cart: { id: string; quantity: number }[];
  totalPrice: number;
  bonusPoints: number;
  discountRate: number;
  selectedProduct: string;
};

type Product = {
  id: string;
  name: string;
  value: number;
  quantity: number;
  discount: number;
};

export type CartAction =
  | { type: "ADD_TO_CART"; productId: string }
  | { type: "REMOVE_FROM_CART"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SELECT_PRODUCT"; productId: string }
  | { type: "CALCULATE_TOTALS" };

export const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const product = state.products.find((p) => p.id === action.productId);
      if (!product || product.quantity <= 0) {
        alert("해당 상품은 품절되었습니다.");
        return state;
      }

      const existingItem = state.cart.find((item) => item.id === action.productId);
      const updatedCart = existingItem
        ? state.cart.map((item) => (item.id === action.productId ? { ...item, quantity: item.quantity + 1 } : item))
        : [...state.cart, { id: action.productId, quantity: 1 }];

      // 재고 감소
      const updatedProducts = state.products.map((p) =>
        p.id === action.productId ? { ...p, quantity: p.quantity - 1 } : p
      );

      return { ...state, cart: updatedCart, products: updatedProducts };

    case "REMOVE_FROM_CART":
      const removedItem = state.cart.find((item) => item.id === action.productId);
      if (removedItem) {
        const restoredProducts = state.products.map((p) =>
          p.id === action.productId ? { ...p, quantity: p.quantity + removedItem.quantity } : p
        );
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.productId),
          products: restoredProducts,
        };
      }
      return state;

    case "UPDATE_QUANTITY":
      const updatedQuantityCart = state.cart.map((item) =>
        item.id === action.productId ? { ...item, quantity: action.quantity } : item
      );

      const productToUpdate = state.products.find((p) => p.id === action.productId);
      const currentCartItem = state.cart.find((item) => item.id === action.productId);

      if (productToUpdate && currentCartItem) {
        const quantityDiff = currentCartItem.quantity - action.quantity;

        if (action.quantity === 0) {
          return {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.productId),
            products: state.products.map((p) =>
              p.id === action.productId ? { ...p, quantity: p.quantity + currentCartItem.quantity } : p
            ),
          };
        } else {
          return {
            ...state,
            cart: updatedQuantityCart,
            products: state.products.map((p) =>
              p.id === action.productId ? { ...p, quantity: p.quantity + quantityDiff } : p
            ),
          };
        }
      }

      return state;

    case "SELECT_PRODUCT":
      return { ...state, selectedProduct: action.productId };

    case "CALCULATE_TOTALS":
      let total = 0;
      let discountRate = 0;
      state.cart.forEach((cartItem) => {
        const product = state.products.find((p) => p.id === cartItem.id);
        if (product) {
          let discount = 0;
          if (cartItem.quantity >= 10) {
            discount = product.discount;
          }
          total += product.value * cartItem.quantity * (1 - discount);
          discountRate = Math.max(discountRate, discount);
        }
      });

      return {
        ...state,
        totalPrice: Math.round(total),
        bonusPoints: Math.floor(total / 1000),
        discountRate,
      };

    default:
      return state;
  }
};
