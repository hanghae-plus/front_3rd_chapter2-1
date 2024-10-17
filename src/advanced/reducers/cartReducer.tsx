// import React from "react";
// import { CartProductType, ProductType } from "../components/ProductContainer";

// interface CartActionType {
//   type: "ADD_PRODUCT" | "DECREMENT_PRODUCT" | "REMOVE_PRODUCT";
//   payload: {
//     product: ProductType;
//   };
// }

// const cartReducer = (prev: CartProductType[], action: CartActionType): CartProductType => {
//   const payloadProduct = action.payload.product;
//   const productIndex = prev.findIndex((product: ProductType) => product.id === payloadProduct.id);
//   switch (action.type) {
//     case 'ADD_PRODUCT':
//       return productIndex === -1
//         ? [...prev, { ...payloadProduct, count: 1 }].sort((a, b) => a.id.localeCompare(b.id))
//         : prev.with(productIndex, { ...prev[productIndex], count: prev[productIndex].count + 1 })
//     case 'DECREMENT_PRODUCT':
//       return
//   }
// };

// export default cartReducer;
