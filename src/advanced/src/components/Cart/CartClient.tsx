import { useCallback } from "react";

import useAdditionalDiscountEvent from "@/hooks/useAdditionalDiscountEvent";
import useCalculate from "@/hooks/useCalculate";
import useCart from "@/hooks/useCart";
import useLuckyDiscountEvent from "@/hooks/useLuckyDiscountEvent";
import useOptions from "@/hooks/useOptions";
import { ProductOption } from "@/types";

import CartItems from "./CartItems";
import PriceSection from "./PriceSection";
import SelectSection from "./SelectSection";
import StockStatusText from "./StockStatusText";

const productOptions = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

const CartClient = () => {
  const { options, updateOption } = useOptions<ProductOption>(productOptions);
  const { cartItems, updateCartItem } = useCart<ProductOption>(productOptions);
  const { discountedTotalPrice, discountRate } = useCalculate(cartItems);

  const discountTargetIdRef = useAdditionalDiscountEvent(options, updateOption);

  useLuckyDiscountEvent(options, updateOption);

  const manageProduct = useCallback(
    (data: ProductOption) => {
      discountTargetIdRef.current = data.id;
      updateCartItem(data.id, { q: data.q });
    },
    [updateCartItem, discountTargetIdRef],
  );

  return (
    <>
      <CartItems items={cartItems} onClick={manageProduct} />
      <PriceSection totalPrice={discountedTotalPrice} discountRate={discountRate} />
      <SelectSection options={options} onSelect={manageProduct} />
      <StockStatusText items={cartItems} productOptions={productOptions} />
    </>
  );
};

export default CartClient;
