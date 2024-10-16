import { useCallback, useMemo, useState } from "react";

import { CartItems, PriceSection, SelectSection } from "../components";
import { WEEKDAY } from "../constants/discount";
import { productOptions } from "../constants/product";
import useAdditionalDiscountEvent from "../hooks/useAdditionalDiscountEvent";
import useLuckyDiscountEvent from "../hooks/useLuckyDiscountEvent";
import DiscountController from "../models/DiscountController";
import { ProductOption } from "../types/cart";

export default function CartPage() {
  return (
    <div className="bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold mb-4">장바구니</h1>
        <Test />
      </div>
    </div>
  );
}

const Test = () => {
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

  const manageQuantity = useCallback(
    (productId: string, quantity: number) => {
      //TODO: 업데이트된 상품 가격도 반영해줘야함
      lastSelectedIdRef.current = productId;
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === productId) {
            const stock = remainingStock(productId, item.q + quantity);
            if (stock < 0) {
              alert("재고가 부족합니다.");
              return item;
            }

            return { ...item, q: item.q + quantity };
          }
          return item;
        }),
      );
    },
    [remainingStock, lastSelectedIdRef],
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
    return discountController.calculate(typeKey as "bulk" | "weekday" | "noItem" | "default");
  }, [cartItems]);

  const renderStockStatus = () => {
    const stockStatus = cartItems.map((item) => {
      const stock = remainingStock(item.id, item.q);
      if (stock < 5) {
        return `${item.name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : "품절"}`;
      }
      return "";
    });

    return stockStatus.join("\n").trim();
  };

  return (
    <>
      <CartItems items={cartItems} onClick={manageQuantity} />
      <PriceSection
        totalPrice={calculateTotalPrice.discountedTotalPrice}
        discountRate={calculateTotalPrice.discountRate}
      />
      <SelectSection options={options} onSelect={manageQuantity} />
      <div id="stock-status" className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">
        {renderStockStatus()}
      </div>
    </>
  );
};
