import React from "react";
import { ProductType } from "./ProductContainer";

interface ProductCartProps {
  selectProduct: ProductType;
}

const ProductCart = ({ selectProduct }: ProductCartProps) => {
  return <div>ProductCart</div>;
};

export default ProductCart;
