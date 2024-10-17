import { useCallback, useMemo, useState } from "react";

import { productOptions, WEEKDAY } from "@/constants";
import useAdditionalDiscountEvent from "@/hooks/useAdditionalDiscountEvent";
import useLuckyDiscountEvent from "@/hooks/useLuckyDiscountEvent";
import useOutOfStock from "@/hooks/useOutOfStock";
import DiscountController from "@/models/DiscountController";
import { DiscountType, ProductOption } from "@/types";

import CartItems from "./CartItems";
import PriceSection from "./PriceSection";
import SelectSection from "./SelectSection";

const CartClient = () => {
  const [options, setOptions] = useState<ProductOption[]>(productOptions);
  const [cartItems, setCartItems] = useState<ProductOption[]>(() =>
    productOptions.map((option) => ({ ...option, q: 0 })),
  );

  const remainingStock = useCallback((itemId: string, quantity: number) => {
    const originalItem = productOptions.find((option) => option.id === itemId);
    if (!originalItem) return 0;
    const stock = originalItem.q - quantity;
    return stock;
  }, []);

  const updateOptionPrice = useCallback((data: ProductOption) => {
    setOptions((prev) =>
      prev.map((item) => {
        if (item.id === data.id) {
          return { ...item, val: data.val };
        }
        return item;
      }),
    );
  }, []);

  const lastSelectedIdRef = useAdditionalDiscountEvent(updateOptionPrice);
  useLuckyDiscountEvent(updateOptionPrice);
  useOutOfStock(cartItems, options);

  const updateQuantity = useCallback(
    (data: ProductOption) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === data.id) {
            const stock = remainingStock(data.id, item.q + data.q);
            if (stock < 0 && item.q > 0) {
              alert("재고가 부족합니다.");

              return item;
            }
            return { ...data, q: item.q + data.q };
          }
          return item;
        }),
      );
    },
    [remainingStock],
  );

  const manageProduct = useCallback(
    (data: ProductOption) => {
      lastSelectedIdRef.current = data.id;

      updateQuantity(data);
    },
    [updateQuantity, lastSelectedIdRef],
  );

  const calculateTotalPrice = useMemo(() => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.q, 0);
    const discountController = new DiscountController(cartItems);
    const discountType = {
      noItem: cartItems.length === 0,
      bulk: totalQuantity >= discountController.getBulkSize(),
      weekday: new Date().getDay() === WEEKDAY.TUESDAY,
      default: true,
    };
    const typeKey = Object.entries(discountType).find(({ 1: value }) => !!value)?.[0];
    return discountController.calculate(typeKey as DiscountType);
  }, [cartItems]);

  const renderStockStatus = useMemo(
    () => () => {
      const stockStatus = cartItems.map((item) => {
        const stock = remainingStock(item.id, item.q);
        if (stock < 5) {
          return `${item.name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : "품절"}`;
        }
        return "";
      });

      return stockStatus.join("\n").trim();
    },
    [cartItems, remainingStock],
  );

  return (
    <>
      <CartItems items={cartItems} onClick={manageProduct} />
      <PriceSection
        totalPrice={calculateTotalPrice.discountedTotalPrice}
        discountRate={calculateTotalPrice.discountRate}
      />
      <SelectSection options={options} onSelect={manageProduct} />
      <div id="stock-status" className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
        {renderStockStatus()}
      </div>
    </>
  );
};

export default CartClient;
