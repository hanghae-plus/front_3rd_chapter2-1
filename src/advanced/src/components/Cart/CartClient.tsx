import { useCallback, useMemo } from "react";

import useAdditionalDiscountEvent from "@/hooks/useAdditionalDiscountEvent";
import useCalculate from "@/hooks/useCalculate";
import useCart from "@/hooks/useCart";
import useLuckyDiscountEvent from "@/hooks/useLuckyDiscountEvent";
import useOptions from "@/hooks/useOptions";
import useOutOfStock from "@/hooks/useOutOfStock";
import { ProductOption } from "@/types";

import CartItems from "./CartItems";
import PriceSection from "./PriceSection";
import SelectSection from "./SelectSection";

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

  const remainingStock = useCallback((itemId: string, quantity: number) => {
    const originalItem = productOptions.find((option) => option.id === itemId);
    if (!originalItem) return 0;
    const stock = originalItem.q - quantity;
    return stock;
  }, []);
  const discountTargetIdRef = useAdditionalDiscountEvent(options, updateOption);

  useLuckyDiscountEvent(options, updateOption);
  useOutOfStock(cartItems, options);

  const manageProduct = useCallback(
    (data: ProductOption) => {
      discountTargetIdRef.current = data.id;
      updateCartItem(data.id, { q: data.q });
    },
    [updateCartItem, discountTargetIdRef],
  );

  const renderStockStatus = useMemo(() => {
    const stockStatus = cartItems.map((item) => {
      const stock = remainingStock(item.id, item.q);
      if (stock >= 5) return "";
      return `${item.name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : "품절"}`;
    });

    return stockStatus.join("\n").trim();
  }, [cartItems, remainingStock]);

  return (
    <>
      <CartItems items={cartItems} onClick={manageProduct} />
      <PriceSection totalPrice={discountedTotalPrice} discountRate={discountRate} />
      <SelectSection options={options} onSelect={manageProduct} />
      <div id="stock-status" className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
        {renderStockStatus}
      </div>
    </>
  );
};

export default CartClient;
